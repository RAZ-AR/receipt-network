/**
 * TaxCore / PURS verification spike (IMPLEMENTATION_PLAN §4, ADR-P-013).
 *
 * Proves the QR-first core: a Serbian fiscal receipt QR encodes a
 * `https://suf.purs.gov.rs/v/?vl=<payload>` URL. Requesting that same URL with
 * `Accept: application/json` makes the tax authority return the verified
 * receipt as JSON (content negotiation) — no scraping, no OCR.
 *
 * Verified live against a real receipt on 2026-07-16:
 *   { isValid, invoiceRequest, invoiceResult, journal }
 *   - invoiceResult: invoiceNumber, sdcTime (date), totalAmount (structured)
 *   - journal: plain-text block with merchant, taxId (PIB), address, items
 *
 * Run:
 *   npx tsx apps/api/scripts/taxcore-spike.ts "https://suf.purs.gov.rs/v/?vl=..."
 *
 * No dependencies — uses Node 20+ global fetch.
 */

const SUF_HOST = "suf.purs.gov.rs";

interface InvoiceResult {
  invoiceNumber?: string;
  sdcTime?: string;
  totalAmount?: number;
  businessName?: string | null;
  taxId?: string | null;
  locationName?: string | null;
  address?: string | null;
}

interface VerifyResponse {
  isValid?: boolean;
  invoiceResult?: InvoiceResult;
  journal?: string;
}

function assertSufUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Not a valid URL: ${url}`);
  }
  if (parsed.host !== SUF_HOST) {
    throw new Error(`Only ${SUF_HOST} URLs are supported (got ${parsed.host}).`);
  }
  if (!parsed.searchParams.get("vl")) {
    throw new Error("URL is missing the `vl` query parameter (the QR payload).");
  }
  return parsed;
}

async function verify(url: string): Promise<VerifyResponse> {
  assertSufUrl(url);
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });
  if (res.status !== 200) {
    throw new Error(`TaxCore returned HTTP ${res.status}.`);
  }
  return (await res.json()) as VerifyResponse;
}

// The merchant header and itemized list live in the plain-text journal.
// A production parser (Recognition module) should port the full grammar;
// this is a minimal extraction to prove the data is present.
function summarizeJournal(journal: string): { merchant?: string; items: string[] } {
  const lines = journal.split("\n").map((l) => l.trim()).filter(Boolean);
  const headerIdx = lines.findIndex((l) => l.includes("ФИСКАЛНИ РАЧУН"));
  const merchant = headerIdx >= 0 ? lines[headerIdx + 2] : undefined;
  const startsAt = lines.findIndex((l) => l.startsWith("Назив"));
  const endsAt = lines.findIndex((l) => l.includes("Укупан износ") || l.includes("========"));
  const items =
    startsAt >= 0
      ? lines.slice(startsAt + 1, endsAt > startsAt ? endsAt : undefined).filter((l) => /\(/.test(l))
      : [];
  return { merchant, items };
}

async function main(): Promise<void> {
  const url = process.argv[2] ?? process.env.RECEIPT_URL;
  if (!url) {
    console.error('Usage: npx tsx apps/api/scripts/taxcore-spike.ts "https://suf.purs.gov.rs/v/?vl=..."');
    process.exit(1);
  }

  const data = await verify(url);
  const r = data.invoiceResult ?? {};
  const j = summarizeJournal(data.journal ?? "");

  console.log("— TaxCore verification —");
  console.log("valid:        ", data.isValid === true ? "YES (state-confirmed)" : data.isValid);
  console.log("invoiceNumber:", r.invoiceNumber ?? "—");
  console.log("date:         ", r.sdcTime ?? "—");
  console.log("total:        ", r.totalAmount ?? "—", "RSD");
  console.log("merchant:     ", r.businessName ?? j.merchant ?? "— (see journal)");
  console.log("items:");
  for (const item of j.items) console.log("  •", item);
  if (j.items.length === 0) console.log("  (parse journal for the full itemized list)");
}

main().catch((err) => {
  console.error("Spike failed:", err.message);
  process.exit(1);
});
