// Types shared between the API and the Expo app (via tRPC inference).
// Domain enums that both sides need can live here; most request/response
// types are inferred from the tRPC router rather than hand-written.

export type ReceiptResultState =
  | "SUCCESS"
  | "QR_UNREADABLE"
  | "INVALID"
  | "TOO_OLD"
  | "DUPLICATE";
