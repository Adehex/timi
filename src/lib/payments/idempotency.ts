import { createHash } from "crypto";

/**
 * Deterministic idempotency key for a payment attempt: the same student
 * retrying the same checkout intent (course/plan + a client-supplied
 * attempt token) always produces the same key, so a duplicated client
 * request (double-click, retry after timeout) can't create two payment
 * rows or enroll/charge a student twice.
 */
export function buildPaymentIdempotencyKey(params: {
  studentId: string;
  purpose: string;
  referenceId: string;
  attemptToken: string;
}): string {
  const raw = `${params.studentId}:${params.purpose}:${params.referenceId}:${params.attemptToken}`;
  return createHash("sha256").update(raw).digest("hex");
}
