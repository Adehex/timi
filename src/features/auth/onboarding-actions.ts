"use server";

import { redirect } from "next/navigation";
import { onboardingSchema } from "@/lib/validation/auth";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentProfileByUserId, completeOnboarding } from "@/lib/db/repositories/students";
import { query, queryOne } from "@/lib/db/client";
import type { ActionState } from "@/features/auth/actions";

export async function completeOnboardingAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireRole(["STUDENT"]);

  const parsed = onboardingSchema.safeParse({
    primaryInstrumentSlug: formData.get("primaryInstrumentSlug"),
    experienceLevel: formData.get("experienceLevel"),
    learningGoals: formData.getAll("learningGoals"),
    preferredLearningStyle: formData.get("preferredLearningStyle") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const studentProfile = await getStudentProfileByUserId(user.id);
  if (!studentProfile) return { error: "Student profile not found." };

  const instrument = await queryOne<{ id: string }>(
    `SELECT "id" FROM "instruments" WHERE "slug" = $1`,
    [parsed.data.primaryInstrumentSlug]
  );
  if (!instrument) return { error: "That instrument isn't available yet." };

  await completeOnboarding({
    studentProfileId: studentProfile.id,
    primaryInstrumentId: instrument.id,
    experienceLevel: parsed.data.experienceLevel,
    learningGoals: parsed.data.learningGoals,
    preferredLearningStyle: parsed.data.preferredLearningStyle,
  });

  await query(
    `INSERT INTO "notifications" ("userId", "type", "title", "body")
     VALUES ($1, 'ANNOUNCEMENT', 'Welcome to TLMI', 'Your profile is set up — time to enroll in your first course.')`,
    [user.id]
  );

  redirect("/learning");
}
