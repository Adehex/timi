import { requireRole } from "@/lib/auth/rbac";
import {
  getTeacherProfileByUserId,
  listAssignedStudents,
  listPendingSubmissionsForTeacher,
} from "@/lib/db/repositories/teacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";

export default async function TeacherDashboardPage() {
  const user = await requireRole(["TEACHER"]);
  const teacherProfile = await getTeacherProfileByUserId(user.id);
  if (!teacherProfile) throw new Error("Teacher profile not found");

  const [students, pendingSubmissions] = await Promise.all([
    listAssignedStudents(teacherProfile.id),
    listPendingSubmissionsForTeacher(teacherProfile.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase text-ink-400">Assigned students</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase text-ink-400">Pending reviews</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{pendingSubmissions.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions awaiting your review</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSubmissions.length === 0 ? (
            <EmptyState title="You're all caught up" description="No submissions are waiting for review." />
          ) : (
            <ul className="divide-y divide-ink-100">
              {pendingSubmissions.map((s) => (
                <li key={s.submissionId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{s.assignmentTitle}</p>
                    <p className="text-xs text-ink-500">
                      {s.studentFirstName} {s.studentLastName}
                    </p>
                  </div>
                  <Badge variant="warning">Awaiting review</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your students</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <EmptyState
              title="No students assigned yet"
              description="An admin assigns students to teachers from the admin dashboard."
            />
          ) : (
            <ul className="divide-y divide-ink-100">
              {students.map((s) => (
                <li key={s.studentId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-ink-500">{s.activeCourseTitle ?? "No active course"}</p>
                  </div>
                  <Badge variant="neutral">{s.currentPracticeStreak}d streak</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
