import { queryOne } from "@/lib/db/client";

export interface CertificateVerification {
  certificateNumber: string;
  studentDisplayName: string;
  courseTitle: string;
  instrumentName: string;
  level: string;
  issuedAt: Date;
}

/**
 * Public verification lookup. Deliberately selects only what a verifier
 * needs to confirm authenticity — no email, no payment history, no
 * progress data — per the "no private student information" requirement.
 */
export async function verifyCertificate(codeOrNumber: string): Promise<CertificateVerification | null> {
  return queryOne<CertificateVerification>(
    `SELECT
        cert."certificateNumber",
        p."firstName" || ' ' || left(p."lastName", 1) || '.' AS "studentDisplayName",
        c."title" AS "courseTitle",
        i."name" AS "instrumentName",
        c."level",
        cert."issuedAt"
     FROM "certificates" cert
     JOIN "student_profiles" sp ON sp."id" = cert."studentId"
     JOIN "profiles" p ON p."userId" = sp."userId"
     JOIN "courses" c ON c."id" = cert."courseId"
     JOIN "instruments" i ON i."id" = c."instrumentId"
     WHERE cert."certificateNumber" = $1 OR cert."verificationCode" = $1`,
    [codeOrNumber]
  );
}
