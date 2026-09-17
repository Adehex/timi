import { requireRole } from "@/lib/auth/rbac";
import { getAdminOverviewStats } from "@/lib/db/repositories/admin";
import { DashboardContent } from "@/components/admin/dashboard-content";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER"]);
  const stats = await getAdminOverviewStats();

  return <DashboardContent stats={stats} />;
}
