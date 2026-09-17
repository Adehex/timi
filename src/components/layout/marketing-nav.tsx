import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

import Image from "next/image";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-ink-25/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-1.5">
          <Image src="/logo-transparent.png" alt="TLMI Logo" width={32} height={32} className="object-contain -mt-1" quality={100} priority />
          <span className="font-display text-xl font-bold text-ink-900 tracking-tight">TLMI</span>
          <span className="hidden h-4 w-[1.5px] bg-ink-200 sm:block" aria-hidden="true" />
          <span className="hidden text-[15px] font-medium text-ink-500 sm:block tracking-tight">The Light Music Institute</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-ink-600 hover:text-ink-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-[15px] font-medium text-ink-600 hover:text-ink-900 hidden sm:block"
            >
              Log in
            </Link>
          </nav>
          <Button asChild size="md">
            <Link href="/register">Start learning</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Image src="/logo-transparent.png" alt="TLMI Logo" width={32} height={32} className="object-contain -mt-1" quality={100} priority />
            <p className="font-display text-xl font-bold text-ink-900 tracking-tight">TLMI</p>
          </div>
          <p className="mt-4 text-sm text-ink-500">
            The Light Music Institute — a digital music academy for guitar, and soon keyboard, bass,
            drums, voice, and theory.
          </p>
        </div>
        <FooterColumn
          title="Learn"
          links={[
            { href: "/courses", label: "Courses" },
            { href: "/#instruments", label: "Instruments" },
            { href: "/#pricing", label: "Pricing" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ]}
        />
        <FooterColumn
          title="Resources"
          links={[
            { href: "/verify", label: "Verify a certificate" },
            { href: "/login", label: "Student login" },
          ]}
        />
      </div>
      <div className="border-t border-ink-100 px-4 py-6 text-center text-xs text-ink-400 sm:px-6">
        © {new Date().getFullYear()} The Light Music Institute. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink-500 hover:text-ink-800">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
