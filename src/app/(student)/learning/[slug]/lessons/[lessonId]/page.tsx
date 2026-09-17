import Link from "next/link";
import { ArrowLeft, CheckCircle2, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentProfileByUserId } from "@/lib/db/repositories/students";
import { getCourseBySlug, getLessonInCourse } from "@/lib/db/repositories/courses";
import { getEnrollmentForCourse, getLessonProgressMap } from "@/lib/db/repositories/lesson-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LessonCompleteButton } from "@/features/lessons/lesson-complete-button";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const user = await requireRole(["STUDENT"]);
  const studentProfile = await getStudentProfileByUserId(user.id);
  if (!studentProfile) throw new Error("Student profile not found");

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const enrollment = await getEnrollmentForCourse(studentProfile.id, course.id);
  if (!enrollment) notFound();

  const lesson = await getLessonInCourse(course.id, lessonId);
  if (!lesson) notFound();

  const progressMap = await getLessonProgressMap(studentProfile.id, course.id);
  const isComplete = progressMap[lesson.id]?.status === "COMPLETED";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href={`/learning/${course.slug}`}>
          <ArrowLeft aria-hidden="true" />
          Back to {course.title}
        </Link>
      </Button>

      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">{course.level}</Badge>
            <span className="text-sm text-ink-400">{lesson.moduleTitle}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900">{lesson.title}</h1>
          {lesson.summary && <p className="mt-2 text-ink-500">{lesson.summary}</p>}

          <div className="mt-8 space-y-6">
            {lesson.textContent ? (
              <section>
                <h2 className="font-display text-xl font-semibold text-ink-900">Lesson notes</h2>
                <div className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-ink-700">
                  {lesson.textContent}
                </div>
              </section>
            ) : (
              <p className="rounded-[var(--radius-control)] border border-dashed border-ink-200 bg-ink-25 p-4 text-sm text-ink-500">
                Lesson notes are being prepared. You can still mark this lesson complete when you are ready.
              </p>
            )}

            {lesson.practiceInstructions && (
              <section className="border-t border-ink-100 pt-6">
                <h2 className="font-display text-xl font-semibold text-ink-900">Practice instructions</h2>
                <div className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-ink-700">
                  {lesson.practiceInstructions}
                </div>
              </section>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
            {isComplete ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-success-500">
                <CheckCircle2 className="size-5" aria-hidden="true" />
                Lesson complete
              </span>
            ) : (
              <LessonCompleteButton lessonId={lesson.id} courseSlug={course.slug} />
            )}
            <Link
              href={`/learning/${course.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-gold-700"
            >
              <PlayCircle className="size-4" aria-hidden="true" />
              View all lessons
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
