"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Guitar,
  ClipboardList,
  Music2,
  CalendarDays,
  TrendingUp,
  Award,
  CreditCard,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learning", label: "My Learning", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Guitar },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/songs", label: "Songs", icon: Music2 },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

import Image from "next/image";

export function StudentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-100 bg-white md:flex md:flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <Image src="/logo-transparent.png" alt="TLMI Logo" width={32} height={32} className="object-contain -mt-1" quality={100} priority />
          <span className="font-display text-xl font-bold text-ink-900 tracking-tight">TLMI</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Student navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-gold-50 text-gold-800" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
