import { queryOne, query } from "@/lib/db/client";

export interface StudentDashboardData {
  activeEnrollment: {
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    level: string;
    progressPercent: number;
  } | null;
  nextLesson: { id: string; title: string; moduleTitle: string } | null;
  pendingAssignment: { id: string; title: string; dueDate: Date | null } | null;
  upcomingClass: {
    id: string;
    title: string;
    startTime: Date;
    format: string;
    meetingLink: string | null;
    location: string | null;
  } | null;
  practiceStreak: number;
  practiceSecondsThisWeek: number;
  recentFeedback: { id: string; writtenFeedback: string | null; decision: string; createdAt: Date }[];
  recentAchievements: { title: string; iconKey: string | null; earnedAt: Date }[];
  announcements: { id: string; title: string; description: string; publishAt: Date }[];
}

export async function getStudentDashboardData(studentId: string): Promise<StudentDashboardData> {
  const activeEnrollment = await queryOne<{
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    level: string;
    progressPercent: number;
  }>(
    `SELECT e."courseId", c."title" AS "courseTitle", c."slug" AS "courseSlug", c."level", e."progressPercent"
     FROM "enrollments" e
     JOIN "courses" c ON c."id" = e."courseId"
     WHERE e."studentId" = $1 AND e."status" = 'ACTIVE'
     ORDER BY e."enrolledAt" DESC
     LIMIT 1`,
    [studentId]
  );

  const nextLesson = activeEnrollment
    ? await queryOne<{ id: string; title: string; moduleTitle: string }>(
        `SELECT l."id", l."title", cm."title" AS "moduleTitle"
         FROM "lessons" l
         JOIN "course_modules" cm ON cm."id" = l."moduleId"
         WHERE cm."courseId" = $1
           AND l."status" = 'PUBLISHED'
           AND NOT EXISTS (
             SELECT 1 FROM "lesson_progress" lp
             WHERE lp."lessonId" = l."id" AND lp."studentId" = $2 AND lp."status" = 'COMPLETED'
           )
         ORDER BY cm."sortOrder" ASC, l."sortOrder" ASC
         LIMIT 1`,
        [activeEnrollment.courseId, studentId]
      )
    : null;

  const pendingAssignment = activeEnrollment
    ? await queryOne<{ id: string; title: string; dueDate: Date | null }>(
        `SELECT a."id", a."title", a."dueDate"
         FROM "assignments" a
         WHERE a."courseId" = $1
           AND a."status" = 'PUBLISHED'
           AND NOT EXISTS (
             SELECT 1 FROM "assignment_submissions" s
             WHERE s."assignmentId" = a."id" AND s."studentId" = $2 AND s."status" = 'PASSED'
           )
         ORDER BY a."dueDate" ASC NULLS LAST
         LIMIT 1`,
        [activeEnrollment.courseId, studentId]
      )
    : null;

  const upcomingClass = await queryOne<{
    id: string;
    title: string;
    startTime: Date;
    format: string;
    meetingLink: string | null;
    location: string | null;
  }>(
    `SELECT cl."id", cl."title", cl."startTime", cl."format", cl."meetingLink", cl."location"
     FROM "classes" cl
     JOIN "class_enrollments" ce ON ce."classId" = cl."id"
     WHERE ce."studentId" = $1 AND cl."startTime" > now()
     ORDER BY cl."startTime" ASC
     LIMIT 1`,
    [studentId]
  );

  const streakRow = await queryOne<{ currentPracticeStreak: number; totalPracticeSeconds: number }>(
    `SELECT "currentPracticeStreak", "totalPracticeSeconds" FROM "student_profiles" WHERE "id" = $1`,
    [studentId]
  );

  const weekRow = await queryOne<{ total: string | null }>(
    `SELECT SUM("durationSeconds") AS total FROM "practice_sessions"
     WHERE "studentId" = $1 AND "startedAt" > now() - interval '7 days'`,
    [studentId]
  );

  const recentFeedback = await query<{
    id: string;
    writtenFeedback: string | null;
    decision: string;
    createdAt: Date;
  }>(
    `SELECT f."id", f."writtenFeedback", f."decision", f."createdAt"
     FROM "feedback" f
     JOIN "assignment_submissions" s ON s."id" = f."submissionId"
     WHERE s."studentId" = $1
     ORDER BY f."createdAt" DESC
     LIMIT 3`,
    [studentId]
  );

  const recentAchievements = await query<{ title: string; iconKey: string | null; earnedAt: Date }>(
    `SELECT ach."title", ach."iconKey", sa."earnedAt"
     FROM "student_achievements" sa
     JOIN "achievements" ach ON ach."id" = sa."achievementId"
     WHERE sa."studentId" = $1
     ORDER BY sa."earnedAt" DESC
     LIMIT 4`,
    [studentId]
  );

  const announcements = await query<{ id: string; title: string; description: string; publishAt: Date }>(
    `SELECT "id", "title", "description", "publishAt"
     FROM "announcements"
     WHERE "audience" = 'ALL_STUDENTS'
       AND "publishAt" <= now()
       AND ("expiresAt" IS NULL OR "expiresAt" > now())
     ORDER BY "publishAt" DESC
     LIMIT 3`
  );

  return {
    activeEnrollment,
    nextLesson,
    pendingAssignment,
    upcomingClass,
    practiceStreak: streakRow?.currentPracticeStreak ?? 0,
    practiceSecondsThisWeek: Number(weekRow?.total ?? 0),
    recentFeedback,
    recentAchievements,
    announcements,
  };
}
