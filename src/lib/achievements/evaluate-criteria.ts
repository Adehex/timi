/**
 * Evaluates whether a student's stats satisfy an achievement's `criteria`
 * JSON (as stored in the achievements table so admins can define new
 * achievements without a code change). Pure function: given the same stats
 * and criteria, always returns the same answer.
 */
export interface AchievementCriteria {
  type:
    | "lessons_completed"
    | "assignments_submitted"
    | "practice_streak"
    | "practice_sessions_count"
    | "course_completed";
  threshold?: number;
  courseSlug?: string;
}

export interface StudentAchievementStats {
  lessonsCompleted: number;
  assignmentsSubmitted: number;
  currentPracticeStreak: number;
  practiceSessionsCount: number;
  completedCourseSlugs: string[];
}

export function evaluateAchievementCriteria(
  criteria: AchievementCriteria,
  stats: StudentAchievementStats
): boolean {
  switch (criteria.type) {
    case "lessons_completed":
      return stats.lessonsCompleted >= (criteria.threshold ?? Infinity);
    case "assignments_submitted":
      return stats.assignmentsSubmitted >= (criteria.threshold ?? Infinity);
    case "practice_streak":
      return stats.currentPracticeStreak >= (criteria.threshold ?? Infinity);
    case "practice_sessions_count":
      return stats.practiceSessionsCount >= (criteria.threshold ?? Infinity);
    case "course_completed":
      return criteria.courseSlug ? stats.completedCourseSlugs.includes(criteria.courseSlug) : false;
    default:
      return false;
  }
}
