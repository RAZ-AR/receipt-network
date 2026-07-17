import { PrismaClient } from "@prisma/client";

export type RedeemOutcome =
  | { state: "SUCCESS"; code: string; rewardTitle: string; spent: number; balance: number; expiresAt: string }
  | { state: "INSUFFICIENT"; balance: number; needed: number }
  | { state: "OUT_OF_STOCK" }
  | { state: "UNAVAILABLE" };

/** Claim codes are read aloud at a till, so avoid look-alike characters. */
const ALPHABET = "ACEFHJKLMNPRTUVWXY3479";

function generateCode(): string {
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

const CLAIM_VALID_DAYS = 14;

/**
 * Exchange points for a reward (FR-7).
 *
 * The balance check and the deduction are one conditional update rather than
 * read-then-write: two redemptions racing must not both pass a check made
 * against a stale balance. The balance can never go negative (FR-5), and every
 * change is journalled in the ledger.
 */
export async function redeemReward(
  db: PrismaClient,
  userId: string,
  rewardId: string,
  now: Date = new Date()
): Promise<RedeemOutcome> {
  const reward = await db.reward.findUnique({ where: { id: rewardId } });

  if (!reward || reward.status !== "ACTIVE") return { state: "UNAVAILABLE" };
  if (reward.validTo && reward.validTo < now) return { state: "UNAVAILABLE" };
  if (reward.stock !== null && reward.stock <= 0) return { state: "OUT_OF_STOCK" };

  return db.$transaction(async (tx) => {
    const account = await tx.pointsAccount.findUnique({ where: { userId } });
    const balance = account?.balance ?? 0;

    if (!account || balance < reward.pointsCost) {
      return { state: "INSUFFICIENT", balance, needed: reward.pointsCost - balance };
    }

    // Deduct only if the balance is still sufficient at write time.
    const deducted = await tx.pointsAccount.updateMany({
      where: { id: account.id, balance: { gte: reward.pointsCost } },
      data: { balance: { decrement: reward.pointsCost } },
    });
    if (deducted.count === 0) {
      return { state: "INSUFFICIENT", balance, needed: reward.pointsCost - balance };
    }

    // Same guard for stock, so the last item can't be claimed twice.
    if (reward.stock !== null) {
      const taken = await tx.reward.updateMany({
        where: { id: reward.id, stock: { gt: 0 } },
        data: { stock: { decrement: 1 } },
      });
      if (taken.count === 0) throw new Error("STOCK_RACE");
    }

    const expiresAt = new Date(now.getTime() + CLAIM_VALID_DAYS * 86_400_000);
    const claim = await tx.rewardClaim.create({
      data: {
        rewardId: reward.id,
        userId,
        code: generateCode(),
        status: "RESERVED",
        expiresAt,
      },
    });

    await tx.pointsTransaction.create({
      data: {
        accountId: account.id,
        type: "REDEEM",
        amount: -reward.pointsCost,
        sourceType: "reward_claim",
        sourceId: claim.id,
        status: "POSTED",
      },
    });

    return {
      state: "SUCCESS",
      code: claim.code,
      rewardTitle: reward.title,
      spent: reward.pointsCost,
      balance: balance - reward.pointsCost,
      expiresAt: expiresAt.toISOString(),
    };
  });
}
