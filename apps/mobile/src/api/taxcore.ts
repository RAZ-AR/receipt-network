/**
 * TaxCore / PURS receipt verification (ADR-P-013).
 * Mirrors apps/api/scripts/taxcore-spike.ts, which was verified live against a
 * real receipt: GET the QR's suf.purs.gov.rs/v/?vl=... URL with
 * `Accept: application/json` and the tax authority returns the verified receipt.
 *
 * This client-side call is fine for the MVP scanner; verification will move
 * server-side (Recognition module) once the API is in place, so points can be
 * granted only from a trusted source.
 */

const SUF_HOST = "suf.purs.gov.rs";

/**
 * Matches a fiscal receipt verification URL without relying on the URL class:
 * React Native's URL is a regex-based shim, so this stays explicit and
 * tolerant — any suf.purs.gov.rs host (incl. subdomains like tap.), any case,
 * and the `vl` payload in any query position.
 */
const SUF_URL_RE = /^https?:\/\/(?:[\w-]+\.)*suf\.purs\.gov\.rs\/[^\s]*[?&]vl=/i;

export interface VerifiedReceipt {
  isValid: boolean;
  invoiceNumber?: string;
  date?: string;
  totalAmount?: number;
  merchant?: string;
}

/** True if a scanned barcode looks like a Serbian fiscal receipt QR. */
export function isFiscalReceiptUrl(value: string): boolean {
  return SUF_URL_RE.test(value.trim());
}

/** Merchant name sits in the plain-text journal, not in the structured fields. */
function merchantFromJournal(journal: string): string | undefined {
  const lines = journal
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const header = lines.findIndex((l) => l.includes("ФИСКАЛНИ РАЧУН"));
  return header >= 0 ? lines[header + 2] : undefined;
}

export async function verifyReceipt(rawUrl: string): Promise<VerifiedReceipt> {
  const url = rawUrl.trim();
  if (!isFiscalReceiptUrl(url)) {
    throw new Error("Nije fiskalni QR kod");
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`TaxCore: HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    isValid?: boolean;
    invoiceResult?: { invoiceNumber?: string; sdcTime?: string; totalAmount?: number };
    journal?: string;
  };

  const r = data.invoiceResult ?? {};
  return {
    isValid: data.isValid === true,
    invoiceNumber: r.invoiceNumber,
    date: r.sdcTime,
    totalAmount: r.totalAmount,
    merchant: data.journal ? merchantFromJournal(data.journal) : undefined,
  };
}
