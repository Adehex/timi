"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentProfileByUserId } from "@/lib/db/repositories/students";
import { markLessonComplete } from "@/lib/db/repositories/lesson-progress";

export async function markLessonCompleteAction(lessonId: string, courseSlug: string): Promise<void> {
  const user = await requireRole(["STUDENT"]);
  const studentProfile = await getStudentProfileByUserId(user.id);
  if (!studentProfile) throw new Error("Student profile not found");

  await markLessonComplete(studentProfile.id, lessonId);
  revalidatePath(`/learning/${courseSlug}`);
  revalidatePath("/dashboard");
}
