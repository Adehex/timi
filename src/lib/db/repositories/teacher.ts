import { query, queryOne } from "@/lib/db/client";

export async function getTeacherProfileByUserId(userId: string) {
  return queryOne<{ id: string }>(`SELECT "id" FROM "teacher_profiles" WHERE "userId" = $1`, [userId]);
}

export interface AssignedStudentRow {
  studentId: string;
  firstName: string;
  lastName: string;
  currentPracticeStreak: number;
  activeCourseTitle: string | null;
}

/** Only returns students explicitly assigned to this teacher — never the whole roster. */
export async function listAssignedStudents(teacherId: string): Promise<AssignedStudentRow[]> {
  return query<AssignedStudentRow>(
    `SELECT sp."id" AS "studentId", p."firstName", p."lastName", sp."currentPracticeStreak",
            (SELECT c."title" FROM "enrollments" e JOIN "courses" c ON c."id" = e."courseId"
             WHERE e."studentId" = sp."id" AND e."status" = 'ACTIVE' ORDER BY e."enrolledAt" DESC LIMIT 1
            ) AS "activeCourseTitle"
     FROM "student_profiles" sp
     JOIN "profiles" p ON p."userId" = sp."userId"
     WHERE sp."assignedTeacherId" = $1
     ORDER BY p."firstName" ASC`,
    [teacherId]
  );
}

export interface PendingSubmissionRow {
  submissionId: string;
  assignmentTitle: string;
  studentFirstName: string;
  studentLastName: string;
  submittedAt: Date | null;
}

/**
 * Submissions awaiting this teacher's review. Scoped through
 * assignments.createdById so a teacher only ever sees work tied to
 * assignments they created — never another teacher's queue.
 */
export async function listPendingSubmissionsForTeacher(teacherId: string): Promise<PendingSubmissionRow[]> {
  return query<PendingSubmissionRow>(
    `SELECT s."id" AS "submissionId", a."title" AS "assignmentTitle",
            p."firstName" AS "studentFirstName", p."lastName" AS "studentLastName", s."submittedAt"
     FROM "assignment_submissions" s
     JOIN "assignments" a ON a."id" = s."assignmentId"
     JOIN "student_profiles" sp ON sp."id" = s."studentId"
     JOIN "profiles" p ON p."userId" = sp."userId"
     WHERE a."createdById" = $1 AND s."status" IN ('SUBMITTED', 'UNDER_REVIEW')
     ORDER BY s."submittedAt" ASC NULLS LAST`,
    [teacherId]
  );
}
