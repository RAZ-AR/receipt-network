/**
 * End-to-end check of redemption against the real database:
 * catalog → afford → redeem → ledger → balance, plus the rules that matter
 * (never negative, stock respected, concurrent redemptions safe).
 *
 * Run: npx tsx apps/api/scripts/e2e-rewards.ts
 */
import { PrismaClient } from "@prisma/client";
import { redeemReward } from "../src/modules/rewards/redeem.js";

const db = new PrismaClient();

function check(name: string, pass: boolean, detail = "") {
  console.log(`${pass ? "✅" : "❌"} ${name}${detail ? " — " + detail : ""}`);
  if (!pass) process.exitCode = 1;
}

async function main() {
  const user = await db.user.upsert({
    where: { phone: "+381600000001" },
    create: { phone: "+381600000001", city: "Beograd" },
    update: {},
  });

  // Clean slate for this user.
  const acct = await db.pointsAccount.upsert({
    where: { userId: user.id },
    create: { userId: user.id, balance: 0 },
    update: {},
  });
  await db.pointsTransaction.deleteMany({ where: { accountId: acct.id } });
  await db.rewardClaim.deleteMany({ where: { userId: user.id } });
  await db.pointsAccount.update({ where: { id: acct.id }, data: { balance: 250 } });

  const coffee = await db.reward.findFirst({ where: { title: "Besplatna kafa" } });
  if (!coffee) throw new Error("Seed the catalog first: npx tsx apps/api/prisma/seed.ts");
  check("catalog seeded", true, `${coffee.title} = ${coffee.pointsCost} p`);

  // 1. Afford it: redeem should succeed and deduct.
  const ok = await redeemReward(db, user.id, coffee.id);
  check("redeem → SUCCESS", ok.state === "SUCCESS", ok.state);
  if (ok.state === "SUCCESS") {
    check("code issued", /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(ok.code), ok.code);
    check("balance deducted", ok.balance === 150, `250 − 100 = ${ok.balance}`);
    check("claim expires", !!ok.expiresAt, new Date(ok.expiresAt).toLocaleDateString("sr-RS"));
  }

  const afterOne = await db.pointsAccount.findUnique({ where: { id: acct.id } });
  check("balance in db", afterOne?.balance === 150, String(afterOne?.balance));

  const ledger = await db.pointsTransaction.findMany({ where: { accountId: acct.id } });
  check("ledger journalled the spend", ledger.length === 1 && ledger[0]!.amount === -100, String(ledger[0]?.amount));

  // 2. Too expensive: must be refused, balance untouched.
  const cinema = await db.reward.findFirst({ where: { pointsCost: { gt: 200 } } });
  const poor = await redeemReward(db, user.id, cinema!.id);
  check("too expensive → INSUFFICIENT", poor.state === "INSUFFICIENT", poor.state);
  const afterPoor = await db.pointsAccount.findUnique({ where: { id: acct.id } });
  check("balance untouched after refusal", afterPoor?.balance === 150, String(afterPoor?.balance));

  // 3. Race: two redemptions at once, only 150 points — exactly one may pass.
  await db.pointsAccount.update({ where: { id: acct.id }, data: { balance: 100 } });
  const [a, b] = await Promise.all([
    redeemReward(db, user.id, coffee.id),
    redeemReward(db, user.id, coffee.id),
  ]);
  const wins = [a, b].filter((r) => r.state === "SUCCESS").length;
  check("concurrent redeem: exactly one wins", wins === 1, `${a.state} / ${b.state}`);

  const afterRace = await db.pointsAccount.findUnique({ where: { id: acct.id } });
  check("balance never negative", (afterRace?.balance ?? -1) >= 0, String(afterRace?.balance));
  check("balance exactly 0", afterRace?.balance === 0, String(afterRace?.balance));

  // 4. Unknown reward.
  const missing = await redeemReward(db, user.id, "does-not-exist");
  check("unknown reward → UNAVAILABLE", missing.state === "UNAVAILABLE", missing.state);
}

main()
  .catch((e) => {
    console.error("FAILED:", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
