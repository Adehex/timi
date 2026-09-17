import { requireRole } from "@/lib/auth/rbac";
import { getProfileByUserId } from "@/lib/db/repositories/profiles";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { StudentBottomNav } from "@/components/layout/student-bottom-nav";
import { StudentTopbar } from "@/components/layout/student-topbar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["STUDENT"]);
  const profile = await getProfileByUserId(user.id);

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <StudentTopbar firstName={profile?.firstName ?? "Student"} lastName={profile?.lastName ?? ""} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>
      <StudentBottomNav />
    </div>
  );
}
