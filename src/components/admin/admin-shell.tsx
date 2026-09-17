"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, GraduationCap, LayoutDashboard, LogOut, Search, Users } from "lucide-react";
import type { ReactNode } from "react";
import Image from "next/image";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: undefined },
  { href: "/admin/students", label: "Students", icon: Users, badge: "248" },
  { href: "/admin/teachers", label: "Teachers", icon: GraduationCap, badge: "12" },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, badge: "7" },
];

export function AdminShell({ children, firstName, lastName, role, logoutAction }: { children: ReactNode; firstName: string; lastName?: string | null; role: string; logoutAction: () => void }) {
  const pathname = usePathname();
  const initials = `${firstName.slice(0, 1)}${lastName?.slice(0, 1) ?? ""}`.toUpperCase();
  return <div className="flex min-h-screen w-full bg-canvas font-sans">
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-ink px-4 py-6 lg:flex">
      <div className="flex items-center gap-1.5 px-2">
        <Image src="/logo-transparent.png" alt="TLMI Logo" width={36} height={36} className="object-contain -mt-1" quality={100} priority />
        <span className="leading-tight"><span className="block font-display text-xl font-bold tracking-tight text-white">TLMI</span><span className="block text-[11px] uppercase tracking-[0.14em] text-white/40">Admin console</span></span>
      </div>
      <nav aria-label="Primary" className="mt-8 flex flex-1 flex-col"><ul className="space-y-1">{navItems.map(({ href, label, icon: Icon, badge }) => { const active = pathname === href; return <li key={href}><Link href={href} className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${active ? "bg-white/[0.07] text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"}`}><Icon className="h-[17px] w-[17px]" aria-hidden="true" /><span className="flex-1">{label}</span>{badge && <span className="tabular text-[11px] text-white/35">{badge}</span>}</Link></li>; })}</ul><div className="mt-auto rounded-xl bg-white/[0.05] p-4"><p className="font-display text-[15px] text-white">Term 1 · 2026/27</p><p className="mt-1 text-[12px] leading-relaxed text-white/45">Week 6 of 14 · Mid-term recital on 24 Sep</p><div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full w-[43%] rounded-full bg-brass" /></div></div></nav>
    </aside>
    <div className="flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-canvas/85 px-5 backdrop-blur-md lg:px-8">
      <span className="flex items-center gap-1.5 font-display text-lg font-bold tracking-tight text-ink lg:hidden">
        <Image src="/logo-transparent.png" alt="TLMI Logo" width={28} height={28} className="object-contain -mt-1" quality={100} priority />
        TLMI Admin
      </span>
      <label className="relative hidden max-w-sm flex-1 items-center md:flex"><Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink-faint" aria-hidden="true" /><span className="sr-only">Search students, teachers, courses</span><input type="search" placeholder="Search students, teachers, courses…" className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-brass focus:outline-none" /></label><div className="ml-auto flex items-center gap-2"><button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-line/60" aria-label="Notifications · 3 unread"><Bell className="h-[18px] w-[18px]" aria-hidden="true" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-clay" /></button><div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface py-1 pl-1 pr-3"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-[11px] font-semibold text-canvas">{initials}</span><span className="leading-tight"><span className="block text-[12.5px] font-medium text-ink">{firstName}</span><span className="block text-[10px] uppercase tracking-[0.12em] text-ink-muted">{role}</span></span></div><form action={logoutAction}><button type="submit" className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-line/60 hover:text-ink" aria-label="Log out"><LogOut className="h-[17px] w-[17px]" aria-hidden="true" /></button></form></div></header><main className="flex-1 px-5 py-7 lg:px-8 lg:py-9"><div className="mx-auto max-w-[1240px]">{children}</div></main></div>
  </div>;
}
