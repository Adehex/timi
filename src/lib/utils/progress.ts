/**
 * Course completion percentage from actual lesson-completion counts —
 * never from page visits or time-on-page. Kept as a pure function so the
 * progress engine's core arithmetic is unit-testable without a database.
 */
export function calculateCourseProgressPercent(completedLessons: number, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  if (completedLessons <= 0) return 0;
  const clamped = Math.min(completedLessons, totalLessons);
  return Math.round((clamped / totalLessons) * 100);
}

export function isCourseComplete(completedLessons: number, totalLessons: number): boolean {
  return totalLessons > 0 && completedLessons >= totalLessons;
}
