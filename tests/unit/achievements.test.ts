import { describe, it, expect } from "vitest";
import { evaluateAchievementCriteria, type StudentAchievementStats } from "@/lib/achievements/evaluate-criteria";

const baseStats: StudentAchievementStats = {
  lessonsCompleted: 0,
  assignmentsSubmitted: 0,
  currentPracticeStreak: 0,
  practiceSessionsCount: 0,
  completedCourseSlugs: [],
};

describe("evaluateAchievementCriteria", () => {
  it("unlocks 'first lesson' once one lesson is completed", () => {
    const criteria = { type: "lessons_completed" as const, threshold: 1 };
    expect(evaluateAchievementCriteria(criteria, { ...baseStats, lessonsCompleted: 0 })).toBe(false);
    expect(evaluateAchievementCriteria(criteria, { ...baseStats, lessonsCompleted: 1 })).toBe(true);
  });

  it("unlocks a 7-day practice streak achievement only at or above the threshold", () => {
    const criteria = { type: "practice_streak" as const, threshold: 7 };
    expect(evaluateAchievementCriteria(criteria, { ...baseStats, currentPracticeStreak: 6 })).toBe(false);
    expect(evaluateAchievementCriteria(criteria, { ...baseStats, currentPracticeStreak: 7 })).toBe(true);
    expect(evaluateAchievementCriteria(criteria, { ...baseStats, currentPracticeStreak: 30 })).toBe(true);
  });

  it("unlocks a course-completion achievement only for the matching course", () => {
    const criteria = { type: "course_completed" as const, courseSlug: "beginner-guitar-fundamentals" };
    expect(evaluateAchievementCriteria(criteria, { ...baseStats, completedCourseSlugs: [] })).toBe(false);
    expect(
      evaluateAchievementCriteria(criteria, {
        ...baseStats,
        completedCourseSlugs: ["intermediate-guitar-lead-technique"],
      })
    ).toBe(false);
    expect(
      evaluateAchievementCriteria(criteria, {
        ...baseStats,
        completedCourseSlugs: ["beginner-guitar-fundamentals"],
      })
    ).toBe(true);
  });

  it("never unlocks a course-completion achievement with no courseSlug configured", () => {
    const criteria = { type: "course_completed" as const };
    expect(
      evaluateAchievementCriteria(criteria, { ...baseStats, completedCourseSlugs: ["anything"] })
    ).toBe(false);
  });

  it("returns false for an unrecognized criteria type rather than throwing", () => {
    // @ts-expect-error deliberately testing an invalid/unknown type from admin-authored JSON
    expect(evaluateAchievementCriteria({ type: "not_a_real_type" }, baseStats)).toBe(false);
  });
});
