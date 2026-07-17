import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./trpc.js";
import { submitReceipt } from "./modules/receipts/submit.js";
import { redeemReward } from "./modules/rewards/redeem.js";

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true })),

  receipts: router({
    /**
     * Scan → verify → persist → grant points. The client sends only the URL
     * it read from the QR; verification and the points decision happen on the
     * server (ADR-P-013).
     */
    submit: protectedProcedure
      .input(z.object({ receiptUrl: z.string().url() }))
      .mutation(({ ctx, input }) => submitReceipt(ctx.db, ctx.userId, input.receiptUrl)),
  }),

  rewards: router({
    /** Catalog with the viewer's affordability worked out server-side. */
    list: protectedProcedure
      .input(z.object({ maxPointsCost: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const account = await ctx.db.pointsAccount.findUnique({ where: { userId: ctx.userId } });
        const balance = account?.balance ?? 0;

        const rewards = await ctx.db.reward.findMany({
          where: {
            status: "ACTIVE",
            ...(input?.maxPointsCost ? { pointsCost: { lte: input.maxPointsCost } } : {}),
          },
          orderBy: { pointsCost: "asc" },
          include: { business: { select: { displayName: true } } },
        });

        return {
          balance,
          rewards: rewards.map((r) => ({
            id: r.id,
            title: r.title,
            pointsCost: r.pointsCost,
            stock: r.stock,
            vendor: r.business?.displayName ?? null,
            affordable: balance >= r.pointsCost,
            remaining: Math.max(0, r.pointsCost - balance),
          })),
        };
      }),

    redeem: protectedProcedure
      .input(z.object({ rewardId: z.string() }))
      .mutation(({ ctx, input }) => redeemReward(ctx.db, ctx.userId, input.rewardId)),

    claims: protectedProcedure.query(async ({ ctx }) => {
      const claims = await ctx.db.rewardClaim.findMany({
        where: { userId: ctx.userId },
        orderBy: { id: "desc" },
        include: { reward: { select: { title: true } } },
      });
      return claims.map((c) => ({
        id: c.id,
        code: c.code,
        status: c.status,
        title: c.reward.title,
        expiresAt: c.expiresAt?.toISOString() ?? null,
      }));
    }),
  }),

  wallet: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const account = await ctx.db.pointsAccount.findUnique({
        where: { userId: ctx.userId },
      });

      const transactions = await ctx.db.pointsTransaction.findMany({
        where: { accountId: account?.id ?? "" },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      // Receipts carry the merchant name shown next to each entry.
      const receipts = await ctx.db.receipt.findMany({
        where: { id: { in: transactions.map((t) => t.sourceId) } },
        select: { id: true, receiptNumber: true, totalAmount: true, purchaseDate: true },
      });
      const byId = new Map(receipts.map((r) => [r.id, r]));

      return {
        balance: account?.balance ?? 0,
        transactions: transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          createdAt: t.createdAt.toISOString(),
          receiptNumber: byId.get(t.sourceId)?.receiptNumber ?? null,
          totalAmount: byId.get(t.sourceId)?.totalAmount?.toString() ?? null,
        })),
      };
    }),
  }),

  receiptsHistory: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const rows = await ctx.db.receipt.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return rows.map((r) => ({
        id: r.id,
        status: r.status,
        receiptNumber: r.receiptNumber,
        totalAmount: r.totalAmount?.toString() ?? null,
        purchaseDate: r.purchaseDate?.toISOString() ?? null,
      }));
    }),
  }),
});

export type AppRouter = typeof appRouter;
