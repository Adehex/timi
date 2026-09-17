import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";
import { getProfileByUserId } from "@/lib/db/repositories/profiles";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

import Image from "next/image";

const navItems = [
  { href: "/teacher/dashboard", label: "Dashboard" },
  { href: "/teacher/students", label: "Students" },
  { href: "/teacher/assignments", label: "Assignments" },
];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["TEACHER"]);
  const profile = await getProfileByUserId(user.id);

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/teacher/dashboard" className="flex items-center gap-1.5">
            <Image src="/logo-transparent.png" alt="TLMI Logo" width={32} height={32} className="object-contain -mt-1" quality={100} priority />
            <span className="font-display text-xl font-bold text-ink-900 tracking-tight">TLMI Teacher</span>
          </Link>
          <nav className="hidden gap-5 md:flex" aria-label="Teacher navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-ink-600 hover:text-ink-900">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-500 sm:inline">{profile?.firstName}</span>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
