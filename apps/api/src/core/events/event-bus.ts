// Internal domain-event bus (PRODUCT_ARCHITECTURE §3–4).
// Domains communicate through events, not direct calls. Each handler must be
// idempotent — a redelivered event must not double-apply (NFR: reliability).

export type DomainEventName =
  | "UserRegistered"
  | "ReceiptUploaded"
  | "ReceiptRecognized"
  | "ReceiptVerified"
  | "ReceiptRejected"
  | "ReceiptFlagged"
  | "PointsGranted"
  | "PointsRevoked"
  | "GoalSelected"
  | "GoalProgressUpdated"
  | "TicketIssued"
  | "DailyOpportunityViewed"
  | "CampaignAttributed"
  | "RewardReserved"
  | "RewardRedeemed"
  | "ReviewSubmitted"
  | "WinnerSelected";

export interface DomainEvent<TPayload = unknown> {
  name: DomainEventName;
  // Stable key for idempotent handling and audit correlation.
  eventId: string;
  occurredAt: Date;
  payload: TPayload;
}

export type EventHandler<TPayload = unknown> = (
  event: DomainEvent<TPayload>,
) => Promise<void>;

export interface EventBus {
  publish<TPayload>(event: DomainEvent<TPayload>): Promise<void>;
  subscribe<TPayload>(
    name: DomainEventName,
    handler: EventHandler<TPayload>,
  ): void;
}

// TODO(sprint-0): concrete implementation (in-process dispatcher first,
// then durable outbox + BullMQ for cross-worker delivery).
