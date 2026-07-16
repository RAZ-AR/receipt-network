// Types shared between the API and the Expo app (via tRPC inference).
// Domain enums that both sides need can live here; most request/response
// types are inferred from the tRPC router rather than hand-written.

export type ReceiptResultState =
  | "SUCCESS"
  | "QR_UNREADABLE"
  | "INVALID"
  | "TOO_OLD"
  | "DUPLICATE";

// Max reward-goals a user can track at once (FR-11, ADR-P-010).
export const MAX_ACTIVE_GOALS = 3;

// Rewards catalog filtering (FR-7).
export interface RewardFilter {
  category?: string;
  businessId?: string;
  maxPointsCost?: number;
}

