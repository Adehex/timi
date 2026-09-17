import { queryOne } from "@/lib/db/client";

export interface AdminOverviewStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalCourses: number;
  publishedCourses: number;
  totalRevenueMinor: number;
  pendingAssignments: number;
  upcomingClasses: number;
  newRegistrationsThisWeek: number;
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const row = await queryOne<{
    totalStudents: string;
    activeStudents: string;
    totalTeachers: string;
    totalCourses: string;
    publishedCourses: string;
    totalRevenueMinor: string;
    pendingAssignments: string;
    upcomingClasses: string;
    newRegistrationsThisWeek: string;
  }>(
    `SELECT
       (SELECT count(*) FROM "student_profiles") AS "totalStudents",
       (SELECT count(*) FROM "student_profiles" sp JOIN "users" u ON u."id" = sp."userId" WHERE u."status" = 'ACTIVE') AS "activeStudents",
       (SELECT count(*) FROM "teacher_profiles") AS "totalTeachers",
       (SELECT count(*) FROM "courses" WHERE "deletedAt" IS NULL) AS "totalCourses",
       (SELECT count(*) FROM "courses" WHERE "status" = 'PUBLISHED' AND "deletedAt" IS NULL) AS "publishedCourses",
       (SELECT COALESCE(SUM("amountMinor"), 0) FROM "payments" WHERE "status" = 'SUCCESSFUL') AS "totalRevenueMinor",
       (SELECT count(*) FROM "assignment_submissions" WHERE "status" IN ('SUBMITTED','UNDER_REVIEW')) AS "pendingAssignments",
       (SELECT count(*) FROM "classes" WHERE "startTime" > now()) AS "upcomingClasses",
       (SELECT count(*) FROM "users" WHERE "createdAt" > now() - interval '7 days') AS "newRegistrationsThisWeek"
    `
  );

  return {
    totalStudents: Number(row?.totalStudents ?? 0),
    activeStudents: Number(row?.activeStudents ?? 0),
    totalTeachers: Number(row?.totalTeachers ?? 0),
    totalCourses: Number(row?.totalCourses ?? 0),
    publishedCourses: Number(row?.publishedCourses ?? 0),
    totalRevenueMinor: Number(row?.totalRevenueMinor ?? 0),
    pendingAssignments: Number(row?.pendingAssignments ?? 0),
    upcomingClasses: Number(row?.upcomingClasses ?? 0),
    newRegistrationsThisWeek: Number(row?.newRegistrationsThisWeek ?? 0),
  };
}
