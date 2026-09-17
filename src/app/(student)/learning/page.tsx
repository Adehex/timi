import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentProfileByUserId } from "@/lib/db/repositories/students";
import { listEnrollmentsForStudent } from "@/lib/db/repositories/enrollments";
import { listPublishedCourses } from "@/lib/db/repositories/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { EnrollButton } from "@/features/courses/enroll-button";
import { formatMoney, formatDuration } from "@/lib/utils/format";

export default async function LearningPage() {
  const user = await requireRole(["STUDENT"]);
  const studentProfile = await getStudentProfileByUserId(user.id);
  if (!studentProfile) throw new Error("Student profile not found");

  const [enrollments, catalog] = await Promise.all([
    listEnrollmentsForStudent(studentProfile.id),
    listPublishedCourses(24),
  ]);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const availableCourses = catalog.filter((c) => !enrolledCourseIds.has(c.id));

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 md:px-8 md:py-8">
      <section>
        <h1 className="font-display text-2xl font-semibold text-ink-900">My Learning</h1>
        {enrollments.length === 0 ? (
          <EmptyState
            className="mt-4"
            title="You haven't enrolled in a course yet"
            description="Pick a course below to get started."
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => (
              <Card key={e.enrollmentId}>
                <CardContent className="p-5">
                  <Badge variant="gold">{e.level}</Badge>
                  <p className="mt-2 font-display font-semibold text-ink-900">{e.courseTitle}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={e.progressPercent} />
                    <span className="text-sm text-ink-600">{e.progressPercent}%</span>
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                    <Link href={`/learning/${e.courseSlug}`}>
                      {e.progressPercent === 0 ? "Start course" : "Continue"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900">Course catalog</h2>
        {availableCourses.length === 0 ? (
          <EmptyState className="mt-4" title="You're enrolled in everything available right now" />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold">{c.level}</Badge>
                    <span className="text-sm font-semibold text-ink-900">
                      {c.priceMinor === 0 ? "Free" : formatMoney(c.priceMinor, c.currency)}
                    </span>
                  </div>
                  <p className="mt-2 font-display font-semibold text-ink-900">{c.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500">{c.description}</p>
                  <p className="mt-3 text-xs text-ink-400">
                    {c.moduleCount} modules · {c.lessonCount} lessons · {formatDuration(c.durationMinutes)}
                  </p>
                  <div className="mt-4">
                    <EnrollButton courseId={c.id} isFree={c.priceMinor === 0} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
