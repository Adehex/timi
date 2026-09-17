/**
 * Certificate numbers look like TLMI-GTR-000184: a fixed academy prefix, a
 * 3-letter instrument code, and a zero-padded sequence number. Kept pure and
 * separate from the DB-generated sequence value so the formatting rules are
 * independently testable.
 */
const INSTRUMENT_CODES: Record<string, string> = {
  guitar: "GTR",
  keyboard: "KEY",
  bass: "BAS",
  drums: "DRM",
  voice: "VOC",
  theory: "THY",
};

export function instrumentCodeForSlug(slug: string): string {
  return INSTRUMENT_CODES[slug] ?? slug.slice(0, 3).toUpperCase();
}

export function generateCertificateNumber(instrumentSlug: string, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence <= 0) {
    throw new Error("Certificate sequence must be a positive integer");
  }
  const code = instrumentCodeForSlug(instrumentSlug);
  const padded = String(sequence).padStart(6, "0");
  return `TLMI-${code}-${padded}`;
}
