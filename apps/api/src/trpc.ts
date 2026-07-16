import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Identity is not built yet (Sprint 1). Until it is, every request resolves to
 * one development user so the rest of the pipeline can be exercised end to end.
 * This is the single place to replace with a real session lookup — no route
 * should ever take a userId from the client.
 */
const DEV_USER_PHONE = "+381600000000";

async function devUserId(): Promise<string> {
  const user = await db.user.upsert({
    where: { phone: DEV_USER_PHONE },
    create: { phone: DEV_USER_PHONE, city: "Beograd" },
    update: {},
  });
  return user.id;
}

export async function createContext(_opts: CreateHTTPContextOptions) {
  return { db, userId: await devUserId() };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/** Placeholder for the real auth guard once Identity lands. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx });
});

export { db };
