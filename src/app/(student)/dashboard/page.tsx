import Link from "next/link";
import { CalendarClock, Flame, MessageSquare, Sparkles, Video } from "lucide-react";
import { requireRole } from "@/lib/auth/rbac";
import { getProfileByUserId } from "@/lib/db/repositories/profiles";
import { getStudentProfileByUserId } from "@/lib/db/repositories/students";
import { getStudentDashboardData } from "@/lib/db/repositories/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatClassTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function StudentDashboardPage() {
  const user = await requireRole(["STUDENT"]);
  const [profile, studentProfile] = await Promise.all([
    getProfileByUserId(user.id),
    getStudentProfileByUserId(user.id),
  ]);

  if (!studentProfile) {
    // Defensive: every STUDENT user is created with a student_profiles row
    // (see createUserWithProfile). If this ever triggers, it signals a data
    // integrity issue worth surfacing rather than silently rendering blank.
    throw new Error("Student profile not found for user " + user.id);
  }

  if (!studentProfile.onboardingCompletedAt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={<Sparkles className="size-8" />}
          title="Let's set up your profile"
          description="Answer a few quick questions so we can recommend the right course for you."
          action={
            <Button asChild variant="gold">
              <Link href="/onboarding">Start onboarding</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const data = await getStudentDashboardData(studentProfile.id);
  const practiceMinutesThisWeek = Math.round(data.practiceSecondsThisWeek / 60);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {timeOfDayGreeting()}, {profile?.firstName ?? "there"}
        </h1>
        {data.activeEnrollment ? (
          <p className="mt-1 text-ink-500">
            Continue your {data.activeEnrollment.level.toLowerCase()} {data.activeEnrollment.courseTitle}{" "}
            journey
          </p>
        ) : (
          <p className="mt-1 text-ink-500">Ready to start your first course?</p>
        )}
      </div>

      {!data.activeEnrollment ? (
        <EmptyState
          title="No active course yet"
          description="Browse our course catalog and enroll to start tracking your progress here."
          action={
            <Button asChild variant="gold">
              <Link href="/learning">Browse courses</Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <Badge variant="gold">{data.activeEnrollment.level}</Badge>
              <p className="mt-2 font-display text-lg font-semibold text-ink-900">
                {data.activeEnrollment.courseTitle}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={data.activeEnrollment.progressPercent} className="max-w-xs" />
                <span className="text-sm font-medium text-ink-600">
                  {data.activeEnrollment.progressPercent}%
                </span>
              </div>
            </div>
            <Button asChild variant="gold">
              <Link href={`/learning/${data.activeEnrollment.courseSlug}`}>Continue Learning</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Flame className="size-5 text-ember-500" />}
          label="Practice streak"
          value={`${data.practiceStreak} day${data.practiceStreak === 1 ? "" : "s"}`}
        />
        <StatCard
          icon={<CalendarClock className="size-5 text-info-500" />}
          label="Practice this week"
          value={`${practiceMinutesThisWeek} min`}
        />
        <StatCard
          icon={<Video className="size-5 text-gold-600" />}
          label="Next lesson"
          value={data.nextLesson ? data.nextLesson.title : "All caught up"}
          compact
        />
        <StatCard
          icon={<MessageSquare className="size-5 text-success-500" />}
          label="Pending assignment"
          value={data.pendingAssignment ? data.pendingAssignment.title : "None due"}
          compact
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent teacher feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentFeedback.length === 0 ? (
              <p className="text-sm text-ink-500">
                No feedback yet — submit an assignment to hear from your teacher.
              </p>
            ) : (
              data.recentFeedback.map((f) => (
                <div key={f.id} className="rounded-[var(--radius-control)] border border-ink-100 p-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        f.decision === "PASSED"
                          ? "success"
                          : f.decision === "RESUBMISSION_REQUIRED"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {f.decision.replaceAll("_", " ").toLowerCase()}
                    </Badge>
                    <span className="text-xs text-ink-400">
                      {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(f.createdAt)}
                    </span>
                  </div>
                  {f.writtenFeedback && <p className="mt-2 text-sm text-ink-700">{f.writtenFeedback}</p>}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming class</CardTitle>
          </CardHeader>
          <CardContent>
            {data.upcomingClass ? (
              <div>
                <p className="font-medium text-ink-900">{data.upcomingClass.title}</p>
                <p className="mt-1 text-sm text-ink-500">{formatClassTime(data.upcomingClass.startTime)}</p>
                <Badge variant="neutral" className="mt-2">
                  {data.upcomingClass.format}
                </Badge>
                {data.upcomingClass.meetingLink && (
                  <Button asChild variant="gold" size="sm" className="mt-4 w-full">
                    <a href={data.upcomingClass.meetingLink} target="_blank" rel="noreferrer">
                      Join Class
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-ink-500">No upcoming classes scheduled.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {data.announcements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.announcements.map((a) => (
              <div key={a.id} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
                <p className="font-medium text-ink-900">{a.title}</p>
                <p className="text-sm text-ink-500">{a.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-ink-400">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className={compact ? "mt-2 line-clamp-1 text-sm font-semibold text-ink-900" : "mt-2 text-xl font-semibold text-ink-900"}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
