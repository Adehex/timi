import { requireRole } from "@/lib/auth/rbac";
import { EmptyState } from "@/components/shared/empty-state";

export default async function TeacherStudentsPage() {
  await requireRole(["TEACHER"]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <EmptyState
        title="Detailed student profiles are coming in the next phase"
        description="The dashboard already lists your assigned students — per-student academic history is next on the roadmap."
      />
    </div>
  );
}
