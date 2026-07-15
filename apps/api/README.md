# @beleg/api

Modular monolith backend for Beleg. See [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) for the build order and [PRODUCT_ARCHITECTURE.md](../../PRODUCT_ARCHITECTURE.md) for domain boundaries.

> **Status:** scaffold only. No dependencies installed, no build verified yet. The stack (Node + tRPC + Prisma + Postgres) is recommended in the plan but **not yet fixed in an ADR** — confirm before building on it.

## Layout

```
src/
  core/
    events/   # domain-event bus (idempotent handlers)
    ledger/   # points ledger primitive (idempotent by sourceId)
    audit/    # audit log for critical operations
  modules/    # one folder per domain (identity, recognition, ...)
  main.ts     # bootstrap
```

Domains talk to each other through `core/events`, not direct calls.

## Getting started (once the stack is confirmed)

```bash
pnpm install
# set DATABASE_URL in .env (see .env.example — to be added)
pnpm prisma:generate
pnpm prisma:migrate
pnpm api:dev
```

## First real work

The [TaxCore verification spike](../../IMPLEMENTATION_PLAN.md#4-критический-путь-taxcorepurs) (§4) gates the Recognition and Verification modules. Do it before wiring points/lottery economics — and note that Lottery and points funding remain blocked by Discovery (§6 of the plan).
