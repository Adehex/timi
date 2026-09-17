"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentProfileByUserId } from "@/lib/db/repositories/students";
import { enrollInFreeCourse } from "@/lib/db/repositories/enrollments";
import { queryOne } from "@/lib/db/client";

export async function enrollInCourseAction(courseId: string): Promise<{ error?: string }> {
  const user = await requireRole(["STUDENT"]);
  const studentProfile = await getStudentProfileByUserId(user.id);
  if (!studentProfile) return { error: "Student profile not found." };

  const course = await queryOne<{ priceMinor: number }>(
    `SELECT "priceMinor" FROM "courses" WHERE "id" = $1 AND "status" = 'PUBLISHED'`,
    [courseId]
  );
  if (!course) return { error: "Course not found." };

  if (course.priceMinor > 0) {
    return { error: "This course requires payment. Checkout is coming in a later phase of this build." };
  }

  await enrollInFreeCourse(studentProfile.id, courseId);
  revalidatePath("/learning");
  revalidatePath("/dashboard");
  return {};
}
