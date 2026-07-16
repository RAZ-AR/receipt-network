import { PrismaClient, Prisma } from "@prisma/client";
import { verifyReceipt } from "../recognition/taxcore.js";

export type SubmitOutcome =
  | { state: "SUCCESS"; points: number; merchant?: string; totalAmount?: number; receiptId: string }
  | { state: "INVALID" }
  | { state: "TOO_OLD"; purchaseDate: string }
  | { state: "DUPLICATE"; scannedAt: string };

/** Receipts must be scanned within this window of purchase (FR-6). */
const MAX_AGE_DAYS = 3;

/**
 * Placeholder economics until the Points domain is settled — who funds points
 * for non-partner receipts is still an open Discovery question, so the rate
 * lives in one place and is trivial to change.
 */
function pointsFor(totalAmount: number): number {
  return Math.max(1, Math.round(totalAmount / 30));
}

/**
 * Scan → verify → persist → grant points, as one transaction.
 *
 * Verification happens here, never on the client: points may only come from a
 * source we trust (ADR-P-013). Granting is idempotent — the ledger is keyed by
 * (sourceType, sourceId), so a retried request cannot double-credit.
 */
export async function submitReceipt(
  db: PrismaClient,
  userId: string,
  receiptUrl: string,
  /** Injectable so the age rule is testable without waiting for the clock. */
  now: Date = new Date()
): Promise<SubmitOutcome> {
  const verified = await verifyReceipt(receiptUrl);

  if (!verified.isValid || !verified.invoiceNumber) {
    return { state: "INVALID" };
  }

  // Anti-duplicate: one fiscal receipt counts once, for anyone (Fraud & Risk).
  const existing = await db.receipt.findFirst({
    where: { receiptNumber: verified.invoiceNumber },
    select: { createdAt: true },
  });
  if (existing) {
    return { state: "DUPLICATE", scannedAt: existing.createdAt.toISOString() };
  }

  const purchaseDate = verified.sdcDateTime ? new Date(verified.sdcDateTime) : null;
  if (purchaseDate) {
    const ageDays = (now.getTime() - purchaseDate.getTime()) / 86_400_000;
    if (ageDays > MAX_AGE_DAYS) {
      return { state: "TOO_OLD", purchaseDate: purchaseDate.toISOString() };
    }
  }

  const total = verified.totalAmount ?? 0;
  const points = pointsFor(total);

  const receiptId = await db.$transaction(async (tx) => {
    const receipt = await tx.receipt.create({
      data: {
        userId,
        status: "VERIFIED",
        purchaseDate,
        totalAmount: new Prisma.Decimal(total),
        currency: "RSD",
        receiptNumber: verified.invoiceNumber,
        fiscalId: verified.taxId,
        verificationSource: "TAXCORE_API",
        verificationUrl: receiptUrl,
      },
    });

    const account = await tx.pointsAccount.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    });

    // Idempotent by (sourceType, sourceId) — see the ledger primitive.
    await tx.pointsTransaction.create({
      data: {
        accountId: account.id,
        type: "GRANT",
        amount: points,
        sourceType: "receipt",
        sourceId: receipt.id,
        status: "POSTED",
      },
    });

    await tx.pointsAccount.update({
      where: { id: account.id },
      data: { balance: { increment: points } },
    });

    return receipt.id;
  });

  return {
    state: "SUCCESS",
    points,
    merchant: verified.merchant,
    totalAmount: total,
    receiptId,
  };
}
