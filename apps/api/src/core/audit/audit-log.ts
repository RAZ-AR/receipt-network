// Audit log for critical operations (NFR: security; FR-10 admin adjustments).
// Every sensitive mutation records who did what, with before/after state.

export interface AuditRecord {
  actorType: "user" | "business" | "admin" | "system";
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}

export interface AuditLogger {
  record(entry: AuditRecord): Promise<void>;
}

// TODO(sprint-0): Prisma-backed implementation writing to AuditLog.
