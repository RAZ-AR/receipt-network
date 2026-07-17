/**
 * Seed the reward catalog for local development.
 * Run: npx tsx apps/api/prisma/seed.ts
 *
 * Costs are deliberately low: a receipt grants roughly total/30 points, so a
 * coffee should be a couple of scans away — the catalog has to feel reachable
 * or points mean nothing (RISKS_AND_CONSTRAINTS: "слабый каталог наград").
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const BUSINESSES = [
  { legalName: "Kafeterija Central d.o.o.", displayName: "Kafeterija Central", category: "kafa" },
  { legalName: "Pekara Trocadero d.o.o.", displayName: "Pekara Trocadero", category: "hrana" },
  { legalName: "Maxi d.o.o.", displayName: "Maxi", category: "popust" },
];

const REWARDS = [
  { title: "Besplatna kafa", pointsCost: 100, stock: 50, vendor: "Kafeterija Central" },
  { title: "Kafa + kolač", pointsCost: 180, stock: 30, vendor: "Kafeterija Central" },
  { title: "Croissant gratis", pointsCost: 120, stock: 40, vendor: "Pekara Trocadero" },
  { title: "−10% na kupovinu", pointsCost: 220, stock: null, vendor: "Maxi" },
  { title: "−15% na kupovinu", pointsCost: 300, stock: null, vendor: "Maxi" },
];

async function main() {
  for (const b of BUSINESSES) {
    const existing = await db.business.findFirst({ where: { displayName: b.displayName } });
    if (!existing) {
      await db.business.create({ data: { ...b, partnerStatus: "PARTNER", verificationStatus: "VERIFIED" } });
    }
  }

  for (const r of REWARDS) {
    const business = await db.business.findFirst({ where: { displayName: r.vendor } });
    const existing = await db.reward.findFirst({ where: { title: r.title } });
    if (existing) continue;
    await db.reward.create({
      data: {
        title: r.title,
        pointsCost: r.pointsCost,
        stock: r.stock,
        status: "ACTIVE",
        businessId: business?.id,
      },
    });
  }

  const count = await db.reward.count();
  console.log(`Rewards in catalog: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
