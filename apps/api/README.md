# @beleg/api

Modular monolith backend for Beleg. See [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) for the build order and [PRODUCT_ARCHITECTURE.md](../../PRODUCT_ARCHITECTURE.md) for domain boundaries.

> **Status:** running. Verified against a real Postgres and the real TaxCore endpoint: receipt verification, the 3-day rule, anti-duplicate and the points ledger all behave (see `scripts/e2e-receipt.ts`). Identity is not built yet — every request resolves to one dev user.
>
> The stack (Node + tRPC + Prisma + Postgres) is recommended in the plan but **not yet fixed in an ADR**.

## Layout

```
prisma/
  schema.prisma  # data layer (lives here so prisma + @prisma/client are colocated)
scripts/
  taxcore-spike.ts
src/
  core/
    events/   # domain-event bus (idempotent handlers)
    ledger/   # points ledger primitive (idempotent by sourceId)
    audit/    # audit log for critical operations
  modules/    # one folder per domain (identity, recognition, ...)
  main.ts     # bootstrap
```

Domains talk to each other through `core/events`, not direct calls.

## Getting started

```bash
pnpm install                      # from the repo root
brew install postgresql@16 && pnpm db:start
createdb beleg
cp apps/api/.env.example apps/api/.env   # then set your local user in DATABASE_URL
pnpm prisma:migrate
pnpm api:dev                      # http://localhost:4000
```

Run the API and the app in **two terminals** — `pnpm api:dev` here and
`pnpm mobile:dev` there. They can't share one: Expo's menu (`i`, `a`, `r`,
the QR prompt) needs a real terminal, and running it under `pnpm --parallel`
leaves it without one ("Input is required, but 'npx expo' is in
non-interactive mode").

Quick check:

```bash
curl http://localhost:4000/health          # {"result":{"data":{"ok":true}}}
npx tsx apps/api/scripts/e2e-receipt.ts    # full pipeline against real data
```

## First real work

The [TaxCore verification spike](../../IMPLEMENTATION_PLAN.md#4-критический-путь-taxcorepurs) (§4) gates the Recognition and Verification modules. Do it before wiring points/lottery economics — and note that Lottery and points funding remain blocked by Discovery (§6 of the plan).
