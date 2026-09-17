import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import type { Role, User } from "@/types/db";

/**
 * Authorization is enforced here, server-side, on every protected page and
 * server action — never inferred from client state. `middleware.ts` only
 * does a fast cookie-presence redirect for UX; it is not the security
 * boundary.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(allowedRoles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

export function isStaffRole(role: Role): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN" || role === "CONTENT_MANAGER";
}

/** Route a freshly authenticated user to the home screen for their role. */
export function homePathForRole(role: Role): string {
  switch (role) {
    case "STUDENT":
      return "/dashboard";
    case "TEACHER":
      return "/teacher/dashboard";
    case "ADMIN":
    case "SUPER_ADMIN":
    case "CONTENT_MANAGER":
      return "/admin/dashboard";
    default:
      return "/";
  }
}
