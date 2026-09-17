import { query, queryOne } from "@/lib/db/client";
import type { Course, CourseModule, Instrument, Lesson } from "@/types/db";

export async function listActiveInstruments(): Promise<Instrument[]> {
  return query<Instrument>(`SELECT * FROM "instruments" WHERE "isActive" = true ORDER BY "sortOrder" ASC`);
}

export interface CourseCard extends Course {
  instrumentName: string;
  instrumentSlug: string;
  instructorName: string | null;
  moduleCount: number;
  lessonCount: number;
}

export async function listPublishedCourses(limit = 12): Promise<CourseCard[]> {
  return query<CourseCard>(
    `SELECT
        c.*,
        i."name" AS "instrumentName",
        i."slug" AS "instrumentSlug",
        p."firstName" || ' ' || p."lastName" AS "instructorName",
        (SELECT count(*) FROM "course_modules" cm WHERE cm."courseId" = c."id") AS "moduleCount",
        (SELECT count(*) FROM "lessons" l
           JOIN "course_modules" cm2 ON cm2."id" = l."moduleId"
           WHERE cm2."courseId" = c."id") AS "lessonCount"
     FROM "courses" c
     JOIN "instruments" i ON i."id" = c."instrumentId"
     LEFT JOIN "teacher_profiles" tp ON tp."id" = c."instructorId"
     LEFT JOIN "profiles" p ON p."userId" = tp."userId"
     WHERE c."status" = 'PUBLISHED' AND c."deletedAt" IS NULL
     ORDER BY c."publishedAt" DESC NULLS LAST
     LIMIT $1`,
    [limit]
  );
}

export async function getCourseBySlug(slug: string): Promise<CourseCard | null> {
  return queryOne<CourseCard>(
    `SELECT
        c.*,
        i."name" AS "instrumentName",
        i."slug" AS "instrumentSlug",
        p."firstName" || ' ' || p."lastName" AS "instructorName",
        (SELECT count(*) FROM "course_modules" cm WHERE cm."courseId" = c."id") AS "moduleCount",
        (SELECT count(*) FROM "lessons" l
           JOIN "course_modules" cm2 ON cm2."id" = l."moduleId"
           WHERE cm2."courseId" = c."id") AS "lessonCount"
     FROM "courses" c
     JOIN "instruments" i ON i."id" = c."instrumentId"
     LEFT JOIN "teacher_profiles" tp ON tp."id" = c."instructorId"
     LEFT JOIN "profiles" p ON p."userId" = tp."userId"
     WHERE c."slug" = $1 AND c."status" = 'PUBLISHED' AND c."deletedAt" IS NULL`,
    [slug]
  );
}

export async function listModulesWithLessons(
  courseId: string
): Promise<(CourseModule & { lessons: Lesson[] })[]> {
  const modules = await query<CourseModule>(
    `SELECT * FROM "course_modules" WHERE "courseId" = $1 ORDER BY "sortOrder" ASC`,
    [courseId]
  );
  const lessons = await query<Lesson>(
    `SELECT l.* FROM "lessons" l
     JOIN "course_modules" cm ON cm."id" = l."moduleId"
     WHERE cm."courseId" = $1 AND l."status" = 'PUBLISHED'
     ORDER BY l."sortOrder" ASC`,
    [courseId]
  );
  return modules.map((m) => ({ ...m, lessons: lessons.filter((l) => l.moduleId === m.id) }));
}

export async function getLessonInCourse(
  courseId: string,
  lessonId: string
): Promise<(Lesson & { moduleTitle: string }) | null> {
  return queryOne<Lesson & { moduleTitle: string }>(
    `SELECT l.*, cm."title" AS "moduleTitle"
     FROM "lessons" l
     JOIN "course_modules" cm ON cm."id" = l."moduleId"
     WHERE l."id" = $1 AND cm."courseId" = $2 AND l."status" = 'PUBLISHED'`,
    [lessonId, courseId]
  );
}
