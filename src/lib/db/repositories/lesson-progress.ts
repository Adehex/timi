import { query, queryOne, withTransaction } from "@/lib/db/client";

export async function getLessonProgressMap(
  studentId: string,
  courseId: string
): Promise<Record<string, { status: string; watchPercent: number }>> {
  const rows = await query<{ lessonId: string; status: string; watchPercent: number }>(
    `SELECT lp."lessonId", lp."status", lp."watchPercent"
     FROM "lesson_progress" lp
     JOIN "lessons" l ON l."id" = lp."lessonId"
     JOIN "course_modules" cm ON cm."id" = l."moduleId"
     WHERE lp."studentId" = $1 AND cm."courseId" = $2`,
    [studentId, courseId]
  );
  return Object.fromEntries(rows.map((r) => [r.lessonId, { status: r.status, watchPercent: r.watchPercent }]));
}

/**
 * Marks a lesson complete for a student and recomputes the parent course's
 * cached progress percentage from actual completion counts — never from
 * page visits, per the progress-engine requirement.
 */
export async function markLessonComplete(studentId: string, lessonId: string): Promise<void> {
  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO "lesson_progress" ("studentId", "lessonId", "status", "watchPercent", "startedAt", "completedAt")
       VALUES ($1, $2, 'COMPLETED', 100, now(), now())
       ON CONFLICT ("studentId", "lessonId")
       DO UPDATE SET "status" = 'COMPLETED', "watchPercent" = 100, "completedAt" = now(), "updatedAt" = now()`,
      [studentId, lessonId]
    );

    const courseRow = await client.query<{ courseId: string }>(
      `SELECT cm."courseId" FROM "lessons" l JOIN "course_modules" cm ON cm."id" = l."moduleId" WHERE l."id" = $1`,
      [lessonId]
    );
    const courseId = courseRow.rows[0]?.courseId;
    if (!courseId) return;

    const totals = await client.query<{ total: string; completed: string }>(
      `SELECT
         count(*) AS total,
         count(*) FILTER (
           WHERE EXISTS (
             SELECT 1 FROM "lesson_progress" lp
             WHERE lp."lessonId" = l."id" AND lp."studentId" = $1 AND lp."status" = 'COMPLETED'
           )
         ) AS completed
       FROM "lessons" l
       JOIN "course_modules" cm ON cm."id" = l."moduleId"
       WHERE cm."courseId" = $2 AND l."status" = 'PUBLISHED'`,
      [studentId, courseId]
    );

    const total = Number(totals.rows[0]?.total ?? 0);
    const completed = Number(totals.rows[0]?.completed ?? 0);
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    const isComplete = total > 0 && completed === total;

    await client.query(
      `UPDATE "enrollments"
       SET "progressPercent" = $1,
           "status" = CASE WHEN $2 THEN 'COMPLETED' ELSE "status" END,
           "completedAt" = CASE WHEN $2 THEN now() ELSE "completedAt" END,
           "updatedAt" = now()
       WHERE "studentId" = $3 AND "courseId" = $4`,
      [percent, isComplete, studentId, courseId]
    );
  });
}

export async function getEnrollmentForCourse(studentId: string, courseId: string) {
  return queryOne<{ id: string; status: string; progressPercent: number }>(
    `SELECT "id", "status", "progressPercent" FROM "enrollments" WHERE "studentId" = $1 AND "courseId" = $2`,
    [studentId, courseId]
  );
}
