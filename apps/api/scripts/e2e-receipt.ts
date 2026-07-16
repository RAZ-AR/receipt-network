/**
 * End-to-end check of the receipt pipeline against the real database and the
 * real TaxCore endpoint: verify → persist → grant points → dedupe → age rule.
 *
 * Run: npx tsx apps/api/scripts/e2e-receipt.ts
 * Needs DATABASE_URL and a migrated database.
 */
import { PrismaClient } from "@prisma/client";
import { submitReceipt } from "../src/modules/receipts/submit.js";

// A real receipt (from the verification spike), issued 2023-01-03.
const RECEIPT_URL =
  "https://suf.purs.gov.rs/v/?vl=A1ZCTUhYOVNYVzZVQlBaTzCyKwEA%2FmgAAMDh5AAAAAAAAAABhXchESoAAAAP3tYiO2%2BdI6Z5y2v4eC5wJTxirHDeiB1hqaKpgb%2FGvUy6yLkMNgZNqKxLqR40mK2cAfqZmKQ3%2BuCcTbec%2BQ3%2F9YY5EhTDP5HxDNhG%2FugU849FmvrVzP0sKecosSNL10dFtlH8Wgor2A2DDs8sHlmfmpokJnVcm24b%2BCz2bSCSl3HtzGRJ1w4Sw9hhdzsQ4WuPo%2FMEGMlmV8a%2Ffc7X05cWsDCHZoA5uPNWfN%2Bre8%2By5JETDJgRwNDFipYIdh0k62TMp5P0%2FzbCueIJJjas5IxAS9iIdpoTAIIl3eKwUZUWvEwtbGz5nkz52hw5%2Bmg50Uczx1SRifYq%2FEDt79xNkcceS0llpMyNdQ12TSYyL0UjMNymgGX4WPajSzPkQuFBcGLB%2BNLOn2AKLPJXa3B8b87eESXrcIbilNXS3zyr3eg4DIqcTVLXwHwcSh1WDmWKI2TFSu%2Bc6iORB11ln1kYbsEsuCoUegxRJR3RW4%2BkQz45%2Bbm4O5qWTCkDlZ73XHATWPn%2BpPfHP2Fh0Y0QK8gGxNiqrdbob3u0l8uaxKcEDaX%2F4HXnhMezvLEEwBNgWXDMn29uWYx9SWEvPrxV%2FLsIULQbE%2FlcvPeYIla63NhCyuEuGLIlwB2p%2B9O8x7sxD53fTMC7EKKRFUV13WBJS2N5%2BLUh33joYo8Qrc%2BNV2CqrtChYTftFukoKbQvCUKOYYIW0%2FA%3D";

const db = new PrismaClient();

function check(name: string, pass: boolean, detail = "") {
  console.log(`${pass ? "✅" : "❌"} ${name}${detail ? " — " + detail : ""}`);
  if (!pass) process.exitCode = 1;
}

async function main() {
  // Clean slate for a repeatable run.
  await db.pointsTransaction.deleteMany({});
  await db.receipt.deleteMany({});
  await db.pointsAccount.deleteMany({});
  await db.user.deleteMany({ where: { phone: "+381600000000" } });

  const user = await db.user.create({
    data: { phone: "+381600000000", city: "Beograd" },
  });
  check("user created", !!user.id);

  // 1. A day after purchase: should verify, persist and grant points.
  const dayAfter = new Date("2023-01-04T10:00:00Z");
  const first = await submitReceipt(db, user.id, RECEIPT_URL, dayAfter);
  check("1st scan → SUCCESS", first.state === "SUCCESS", first.state);
  if (first.state === "SUCCESS") {
    check("merchant from TaxCore", !!first.merchant, first.merchant);
    check("total from TaxCore", first.totalAmount === 1500, String(first.totalAmount));
    check("points granted", first.points > 0, `+${first.points}`);
  }

  const balance = await db.pointsAccount.findUnique({ where: { userId: user.id } });
  check("balance updated", (balance?.balance ?? 0) > 0, String(balance?.balance));

  const ledger = await db.pointsTransaction.count();
  check("ledger has 1 entry", ledger === 1, String(ledger));

  // 2. Same receipt again: anti-duplicate must reject it.
  const second = await submitReceipt(db, user.id, RECEIPT_URL, dayAfter);
  check("2nd scan → DUPLICATE", second.state === "DUPLICATE", second.state);

  const afterDup = await db.pointsAccount.findUnique({ where: { userId: user.id } });
  check("balance unchanged after duplicate", afterDup?.balance === balance?.balance, String(afterDup?.balance));

  // 3. Age rule: the same receipt scanned today is far past the 3-day window.
  await db.pointsTransaction.deleteMany({});
  await db.receipt.deleteMany({});
  const stale = await submitReceipt(db, user.id, RECEIPT_URL, new Date());
  check("scanned today → TOO_OLD", stale.state === "TOO_OLD", stale.state);

  // 4. A non-fiscal URL must never reach the ledger.
  const bogus = await submitReceipt(db, user.id, "https://example.com/?vl=x").catch(
    (e: Error) => ({ state: "THREW", msg: e.message }) as const
  );
  check("non-fiscal URL rejected", "state" in bogus && bogus.state === "THREW");
}

main()
  .catch((e) => {
    console.error("FAILED:", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
