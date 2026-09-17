import { describe, it, expect } from "vitest";
import { calculateCourseProgressPercent, isCourseComplete } from "@/lib/utils/progress";

describe("calculateCourseProgressPercent", () => {
  it("returns 0 for a course with no lessons", () => {
    expect(calculateCourseProgressPercent(0, 0)).toBe(0);
  });

  it("returns 0 when nothing is completed", () => {
    expect(calculateCourseProgressPercent(0, 10)).toBe(0);
  });

  it("returns 100 when everything is completed", () => {
    expect(calculateCourseProgressPercent(7, 7)).toBe(100);
  });

  it("rounds to the nearest whole percent", () => {
    // 3/7 = 42.857...
    expect(calculateCourseProgressPercent(3, 7)).toBe(43);
  });

  it("never exceeds 100 even if completed count is corrupted upstream", () => {
    expect(calculateCourseProgressPercent(12, 10)).toBe(100);
  });

  it("treats a negative completed count as 0 rather than a negative percent", () => {
    expect(calculateCourseProgressPercent(-3, 10)).toBe(0);
  });
});

describe("isCourseComplete", () => {
  it("is false when there are no lessons at all", () => {
    expect(isCourseComplete(0, 0)).toBe(false);
  });

  it("is false when some lessons remain", () => {
    expect(isCourseComplete(4, 7)).toBe(false);
  });

  it("is true when completed matches total", () => {
    expect(isCourseComplete(7, 7)).toBe(true);
  });
});
