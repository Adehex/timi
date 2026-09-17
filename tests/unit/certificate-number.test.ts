import { describe, it, expect } from "vitest";
import { generateCertificateNumber, instrumentCodeForSlug } from "@/lib/certificates/certificate-number";

describe("instrumentCodeForSlug", () => {
  it("maps known instrument slugs to their 3-letter code", () => {
    expect(instrumentCodeForSlug("guitar")).toBe("GTR");
    expect(instrumentCodeForSlug("keyboard")).toBe("KEY");
    expect(instrumentCodeForSlug("voice")).toBe("VOC");
  });

  it("falls back to an uppercased prefix for an unknown instrument", () => {
    expect(instrumentCodeForSlug("ukulele")).toBe("UKU");
  });
});

describe("generateCertificateNumber", () => {
  it("formats the canonical TLMI certificate number", () => {
    expect(generateCertificateNumber("guitar", 184)).toBe("TLMI-GTR-000184");
  });

  it("zero-pads small sequence numbers to 6 digits", () => {
    expect(generateCertificateNumber("guitar", 1)).toBe("TLMI-GTR-000001");
  });

  it("does not truncate a sequence number larger than 6 digits", () => {
    expect(generateCertificateNumber("guitar", 1234567)).toBe("TLMI-GTR-1234567");
  });

  it("rejects a zero or negative sequence number", () => {
    expect(() => generateCertificateNumber("guitar", 0)).toThrow();
    expect(() => generateCertificateNumber("guitar", -5)).toThrow();
  });

  it("rejects a non-integer sequence number", () => {
    expect(() => generateCertificateNumber("guitar", 1.5)).toThrow();
  });
});
