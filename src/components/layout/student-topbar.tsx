import Link from "next/link";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

import Image from "next/image";

export function StudentTopbar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <header className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 md:px-8">
      <Link href="/dashboard" className="flex items-center gap-1.5 md:hidden">
        <Image src="/logo-transparent.png" alt="TLMI Logo" width={28} height={28} className="object-contain -mt-1" quality={100} priority />
        <span className="font-display text-lg font-bold text-ink-900 tracking-tight">TLMI</span>
      </Link>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Notifications">
          <Link href="/notifications">
            <Bell className="size-5" />
          </Link>
        </Button>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">
            Log out
          </Button>
        </form>
      </div>
    </header>
  );
}
