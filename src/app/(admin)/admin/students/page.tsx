import { requireRole } from "@/lib/auth/rbac";
import { StudentsContent } from "@/components/admin/students-content";

export default async function AdminStudentsPage() {
  await requireRole(["ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER"]);
  return <StudentsContent />;
}
