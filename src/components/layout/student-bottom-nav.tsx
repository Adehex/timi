"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Guitar, Music2, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/learning", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Guitar },
  { href: "/songs", label: "Songs", icon: Music2 },
  { href: "/profile", label: "Profile", icon: User },
];

export function StudentBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-100 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Student navigation"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              isActive ? "text-gold-700" : "text-ink-400"
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
