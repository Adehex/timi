import { query, queryOne } from "@/lib/db/client";
import type { StudentProfile } from "@/types/db";

export async function getStudentProfileByUserId(userId: string): Promise<StudentProfile | null> {
  return queryOne<StudentProfile>(`SELECT * FROM "student_profiles" WHERE "userId" = $1`, [userId]);
}

interface CompleteOnboardingInput {
  studentProfileId: string;
  primaryInstrumentId: string;
  experienceLevel: string;
  learningGoals: string[];
  preferredLearningStyle?: string;
}

export async function completeOnboarding(input: CompleteOnboardingInput): Promise<void> {
  await query(
    `UPDATE "student_profiles"
     SET "primaryInstrumentId" = $1,
         "experienceLevel" = $2,
         "learningGoals" = $3,
         "preferredLearningStyle" = $4,
         "onboardingCompletedAt" = now(),
         "updatedAt" = now()
     WHERE "id" = $5`,
    [
      input.primaryInstrumentId,
      input.experienceLevel,
      input.learningGoals,
      input.preferredLearningStyle ?? null,
      input.studentProfileId,
    ]
  );
}
