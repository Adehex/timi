import React from 'react';
import Link from "next/link";
import { navItems } from '@/lib/marketing-data/navigation';

const studentLinks = [
{ label: 'Student login', href: '#login' },
{ label: 'Verify a certificate', href: '#verify' },
{ label: 'Practice tools', href: '#tools' }];


const instituteLinks = [
{ label: 'About TLMI', href: '#about' },
{ label: 'Teach with us', href: '#teach' },
{ label: 'Contact', href: '#contact' }];


export function SiteFooter() {
  return (
    <footer className="w-full bg-marketing-cream">
      <div className="mx-auto max-w-shell px-6 py-14 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-marketing-display text-lg font-semibold tracking-tightest text-marketing-ink">TLMI</p>
            <p className="mt-2 max-w-[14rem] text-[14px] leading-relaxed text-marketing-stone">
              The Light Music Institute — learn music, build skill, find your sound.
            </p>
          </div>

          <FooterColumn title="Explore" links={navItems} />
          <FooterColumn title="Students" links={studentLinks} />
          <FooterColumn title="Institute" links={instituteLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-marketing-rule pt-6 text-[13px] text-marketing-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Light Music Institute. All rights reserved.</p>
          <p>Lagos, Nigeria · Online worldwide</p>
        </div>
      </div>
    </footer>);

}

function FooterColumn({ title, links }: {title: string;links: {label: string;href: string;}[];}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-[13px] text-marketing-ink">{title}</h2>
      <ul className="mt-3 space-y-2.5">
        {links.map((link) =>
        <li key={link.label}>
            <Link
            href={link.href}
            className="text-[14px] text-marketing-stone transition-colors duration-150 ease-out hover:text-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest">
            
              {link.label}
            </Link>
          </li>
        )}
      </ul>
    </nav>);

}