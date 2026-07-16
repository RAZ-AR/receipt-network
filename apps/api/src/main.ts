// Beleg API — modular monolith entrypoint (ADR-P-007).
// Wires the domain-event core and registers modules. Kept intentionally
// minimal: the first real work is the TaxCore verification spike (§4 of
// IMPLEMENTATION_PLAN) which gates the Recognition/Verification modules.

async function bootstrap(): Promise<void> {
  // TODO(sprint-0):
  //   - construct EventBus, Ledger, AuditLogger (core/)
  //   - register modules (identity, receipt-capture, recognition, ...)
  //   - expose tRPC router
  //   - start HTTP server
  console.log("Beleg API — scaffold. See IMPLEMENTATION_PLAN.md for the build order.");
}

void bootstrap();
