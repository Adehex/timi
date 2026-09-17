import { describe, it, expect } from "vitest";
import { isPasswordStrongEnough, hashPassword, verifyPassword } from "@/lib/auth/password";
import { buildPaymentIdempotencyKey } from "@/lib/payments/idempotency";

describe("isPasswordStrongEnough", () => {
  it("rejects passwords under 8 characters", () => {
    expect(isPasswordStrongEnough("Ab1")).toBe(false);
  });

  it("rejects passwords missing a number", () => {
    expect(isPasswordStrongEnough("Abcdefgh")).toBe(false);
  });

  it("rejects passwords missing an uppercase letter", () => {
    expect(isPasswordStrongEnough("abcdefg1")).toBe(false);
  });

  it("accepts a password meeting all rules", () => {
    expect(isPasswordStrongEnough("Password123")).toBe(true);
  });
});

describe("hashPassword / verifyPassword", () => {
  it("produces a hash that verifies against the original password", async () => {
    const hash = await hashPassword("Password123");
    expect(hash).not.toBe("Password123");
    expect(await verifyPassword("Password123", hash)).toBe(true);
  });

  it("fails verification against an incorrect password", async () => {
    const hash = await hashPassword("Password123");
    expect(await verifyPassword("WrongPassword1", hash)).toBe(false);
  });
});

describe("buildPaymentIdempotencyKey", () => {
  it("produces the same key for identical inputs (so retries are safe)", () => {
    const params = {
      studentId: "student-1",
      purpose: "COURSE_PURCHASE",
      referenceId: "course-1",
      attemptToken: "checkout-session-abc",
    };
    expect(buildPaymentIdempotencyKey(params)).toBe(buildPaymentIdempotencyKey(params));
  });

  it("produces a different key for a different student", () => {
    const base = {
      purpose: "COURSE_PURCHASE",
      referenceId: "course-1",
      attemptToken: "checkout-session-abc",
    };
    const keyA = buildPaymentIdempotencyKey({ ...base, studentId: "student-1" });
    const keyB = buildPaymentIdempotencyKey({ ...base, studentId: "student-2" });
    expect(keyA).not.toBe(keyB);
  });

  it("produces a different key for a new checkout attempt token", () => {
    const base = { studentId: "student-1", purpose: "COURSE_PURCHASE", referenceId: "course-1" };
    const keyA = buildPaymentIdempotencyKey({ ...base, attemptToken: "attempt-1" });
    const keyB = buildPaymentIdempotencyKey({ ...base, attemptToken: "attempt-2" });
    expect(keyA).not.toBe(keyB);
  });
});
