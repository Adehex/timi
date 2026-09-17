import { requireRole } from "@/lib/auth/rbac";
import { EmptyState } from "@/components/shared/empty-state";

export default async function ProfilePage() {
  await requireRole(["STUDENT"]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <EmptyState
        title="Profile is coming in the next phase"
        description="This area is part of the build roadmap and isn't implemented yet — see the phase plan for what's next."
      />
    </div>
  );
}
