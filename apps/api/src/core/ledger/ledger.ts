// Points ledger primitive (ADR-P-003: points are not money).
// Every balance change is journaled; posting is idempotent by (sourceType,
// sourceId) so a replayed ReceiptVerified event grants points exactly once.
// Balance must never go negative (FR-5).

export interface LedgerEntry {
  accountId: string;
  type: "GRANT" | "REVOKE" | "REDEEM" | "ADJUSTMENT";
  amount: number; // signed; GRANT/REDEEM sign handled by caller
  sourceType: string; // e.g. "receipt", "reward_claim"
  sourceId: string;
}

export interface Ledger {
  // Idempotent: if an entry with the same (sourceType, sourceId) exists,
  // returns the existing transaction without re-applying.
  post(entry: LedgerEntry): Promise<{ transactionId: string; balance: number }>;
  getBalance(accountId: string): Promise<number>;
}

// TODO(sprint-3): Prisma-backed implementation inside a serializable
// transaction; reject if resulting balance < 0.
