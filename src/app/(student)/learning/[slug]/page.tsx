import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentProfileByUserId } from "@/lib/db/repositories/students";
import { getCourseBySlug, listModulesWithLessons } from "@/lib/db/repositories/courses";
import { getEnrollmentForCourse, getLessonProgressMap } from "@/lib/db/repositories/lesson-progress";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { LessonCompleteButton } from "@/features/lessons/lesson-complete-button";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireRole(["STUDENT"]);
  const studentProfile = await getStudentProfileByUserId(user.id);
  if (!studentProfile) throw new Error("Student profile not found");

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const enrollment = await getEnrollmentForCourse(studentProfile.id, course.id);
  if (!enrollment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="You're not enrolled in this course"
          description="Head back to My Learning to enroll first."
        />
      </div>
    );
  }

  const [modules, progressMap] = await Promise.all([
    listModulesWithLessons(course.id),
    getLessonProgressMap(studentProfile.id, course.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div>
        <Badge variant="gold">{course.level}</Badge>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">{course.title}</h1>
        <p className="mt-1 text-ink-500">{course.description}</p>
        <div className="mt-4 flex max-w-sm items-center gap-3">
          <Progress value={enrollment.progressPercent} />
          <span className="text-sm font-medium text-ink-600">{enrollment.progressPercent}%</span>
        </div>
      </div>

      {modules.length === 0 ? (
        <EmptyState title="Content is being added" description="Modules for this course are coming soon." />
      ) : (
        <div className="space-y-6">
          {modules.map((module, mi) => (
            <Card key={module.id}>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Module {mi + 1}
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-ink-900">{module.title}</h2>
                <ul className="mt-4 divide-y divide-ink-100">
                  {module.lessons.map((lesson) => {
                    const progress = progressMap[lesson.id];
                    const isComplete = progress?.status === "COMPLETED";
                    return (
                      <li key={lesson.id} className="flex items-center justify-between gap-4 py-3">
                        <Link
                          href={`/learning/${course.slug}/lessons/${lesson.id}`}
                          className="group flex min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-control)] py-1 pr-2 focus-visible:outline-2 focus-visible:outline-gold-500 focus-visible:outline-offset-2"
                          aria-label={`Open ${lesson.title}`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="size-5 shrink-0 text-success-500" />
                          ) : (
                            <PlayCircle className="size-5 shrink-0 text-ink-300" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink-900 group-hover:text-gold-700 group-focus-visible:text-gold-700">
                              {lesson.title}
                            </p>
                            {lesson.summary && <p className="text-xs text-ink-500">{lesson.summary}</p>}
                          </div>
                          <ChevronRight className="ml-auto size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-600" />
                        </Link>
                        {!isComplete && (
                          <LessonCompleteButton lessonId={lesson.id} courseSlug={course.slug} />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
