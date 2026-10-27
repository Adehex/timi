import { requireAdmin } from "@/lib/auth/rbac";
import { getProfileByUserId } from "@/lib/db/repositories/profiles";
import { logoutAction } from "@/features/auth/actions";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const profile = await getProfileByUserId(user.id);

  return <AdminShell firstName={profile?.firstName ?? "Admin"} lastName={profile?.lastName} role={user.role.replaceAll("_", " ")} logoutAction={logoutAction}>{children}</AdminShell>;
}
