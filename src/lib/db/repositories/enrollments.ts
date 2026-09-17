import { query, queryOne } from "@/lib/db/client";

export interface EnrolledCourseRow {
  enrollmentId: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  level: string;
  status: string;
  progressPercent: number;
}

export async function listEnrollmentsForStudent(studentId: string): Promise<EnrolledCourseRow[]> {
  return query<EnrolledCourseRow>(
    `SELECT e."id" AS "enrollmentId", c."id" AS "courseId", c."slug" AS "courseSlug",
            c."title" AS "courseTitle", c."level", e."status", e."progressPercent"
     FROM "enrollments" e
     JOIN "courses" c ON c."id" = e."courseId"
     WHERE e."studentId" = $1
     ORDER BY e."enrolledAt" DESC`,
    [studentId]
  );
}

export async function findEnrollment(studentId: string, courseId: string) {
  return queryOne<{ id: string; status: string }>(
    `SELECT "id", "status" FROM "enrollments" WHERE "studentId" = $1 AND "courseId" = $2`,
    [studentId, courseId]
  );
}

/** Direct enrollment for zero-cost courses. Paid courses must go through the payment flow (Phase 5). */
export async function enrollInFreeCourse(studentId: string, courseId: string): Promise<void> {
  await query(
    `INSERT INTO "enrollments" ("studentId", "courseId", "status")
     VALUES ($1, $2, 'ACTIVE')
     ON CONFLICT ("studentId", "courseId") DO NOTHING`,
    [studentId, courseId]
  );
}
