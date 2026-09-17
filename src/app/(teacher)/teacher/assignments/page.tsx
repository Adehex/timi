import { requireRole } from "@/lib/auth/rbac";
import { EmptyState } from "@/components/shared/empty-state";

export default async function TeacherAssignmentsPage() {
  await requireRole(["TEACHER"]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <EmptyState
        title="Assignment creation & the video review timeline are next"
        description="This build phase focuses on the review queue on your dashboard; full assignment creation and the timestamped video feedback UI come next."
      />
    </div>
  );
}
