/**
 * TaxCore / PURS verification — server side (ADR-P-013).
 *
 * This is the trusted copy: points may only ever be granted from a receipt
 * verified here, never from a client-reported result. The mobile app's own
 * call is just for instant feedback.
 *
 * Mechanics proven in apps/api/scripts/taxcore-spike.ts against a real
 * receipt: GET the QR's URL with `Accept: application/json` and the tax
 * authority returns the verified receipt.
 */

const SUF_URL_RE = /^https?:\/\/(?:[\w-]+\.)*suf\.purs\.gov\.rs\/[^\s]*[?&]vl=/i;

export interface VerifiedReceipt {
  isValid: boolean;
  invoiceNumber?: string;
  sdcDateTime?: string;
  totalAmount?: number;
  merchant?: string;
  taxId?: string;
  journal?: string;
}

export function isFiscalReceiptUrl(value: string): boolean {
  return SUF_URL_RE.test(value.trim());
}

/**
 * Merchant, tax id and address live in the plain-text journal rather than in
 * the structured fields. Full item-level parsing is a separate task; the
 * grammar exists in the open-source PHP parser and should be ported here.
 */
function parseJournal(journal: string): { merchant?: string; taxId?: string } {
  const lines = journal
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const header = lines.findIndex((l) => l.includes("ФИСКАЛНИ РАЧУН"));
  if (header < 0) return {};
  // Layout: header, tax id, merchant name, ...
  return { taxId: lines[header + 1], merchant: lines[header + 2] };
}

export async function verifyReceipt(rawUrl: string): Promise<VerifiedReceipt> {
  const url = rawUrl.trim();
  if (!isFiscalReceiptUrl(url)) {
    throw new Error("Not a fiscal receipt URL");
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`TaxCore returned HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    isValid?: boolean;
    invoiceResult?: { invoiceNumber?: string; sdcTime?: string; totalAmount?: number };
    journal?: string;
  };

  const r = data.invoiceResult ?? {};
  const j = data.journal ? parseJournal(data.journal) : {};

  return {
    isValid: data.isValid === true,
    invoiceNumber: r.invoiceNumber,
    sdcDateTime: r.sdcTime,
    totalAmount: r.totalAmount,
    merchant: j.merchant,
    taxId: j.taxId,
    journal: data.journal,
  };
}
