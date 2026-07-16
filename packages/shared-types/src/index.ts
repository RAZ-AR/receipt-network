// Types shared between the API and the Expo app (via tRPC inference).
// Domain enums that both sides need can live here; most request/response
// types are inferred from the tRPC router rather than hand-written.

export type ReceiptResultState =
  | "SUCCESS"
  | "PENDING_REVIEW"
  | "QR_UNREADABLE"
  | "INVALID"
  | "TOO_OLD"
  | "DUPLICATE";

/**
 * Manual entry fallback (FR-3) — the fields the tax authority's own
 * verification form asks for. It is reCAPTCHA-protected, so a manually
 * entered receipt cannot be auto-verified and goes to manual review
 * (FR-4) rather than granting points immediately.
 */
export interface ManualReceiptEntry {
  /** ПФР број рачуна, e.g. "92PY9LTA-92PY9LTA-5425" */
  invoiceNumber: string;
  /** Бројач рачуна, e.g. "5400/5425ПП" */
  invoiceCounter: string;
  /** Укупан износ, RSD */
  totalAmount: string;
  /** ПФР време, e.g. "16.07.2026 14:43:27" */
  sdcDateTime: string;
}

/** Loose shape check for the PFR invoice number: xxxxxxxx-xxxxxxxx-123 */
export function isLikelyInvoiceNumber(v: string): boolean {
  return /^[A-Za-z0-9]{6,10}-[A-Za-z0-9]{6,10}-\d{1,10}$/.test(v.trim());
}

// Max reward-goals a user can track at once (FR-11, ADR-P-010).
export const MAX_ACTIVE_GOALS = 3;

// Rewards catalog filtering (FR-7).
export interface RewardFilter {
  category?: string;
  businessId?: string;
  maxPointsCost?: number;
}

