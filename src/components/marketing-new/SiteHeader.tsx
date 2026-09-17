"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { navItems } from '@/lib/marketing-data/navigation';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-marketing-cream/90 backdrop-blur-sm transition-[border-color,box-shadow] duration-200 ease-out ${
      scrolled ? 'border-b border-marketing-rule shadow-[0_1px_0_rgba(27,23,20,0.03)]' : 'border-b border-transparent'}`
      }>
      
      <div className="mx-auto flex max-w-shell items-center gap-8 px-6 py-4 lg:px-10">
        <Link
          href="#top"
          className="group flex items-center gap-3 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-4 focus-visible:ring-offset-cream">
          
          <span className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-marketing-forest">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M13.4 3c1.9 1.7 2.5 3.6 1.9 5.6-.5 1.6-1.7 3.2-2.7 4.6-1 1.4-1.7 2.5-1.7 3.7 0 1.3.8 2.2 1.9 2.2 1 0 1.8-.7 1.8-1.7 0-.8-.5-1.4-1.2-1.6"
                fill="none"
                stroke="#B8863B"
                strokeWidth="1.6"
                strokeLinecap="round" />
              
              <path d="M9.2 9.6c3.6-1.3 6.2-2.6 8.4-4.2" fill="none" stroke="#FBF7EF" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M9.2 13.4c3.6-1.3 6.2-2.6 8.4-4.2" fill="none" stroke="#FBF7EF" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>
          <span className="flex items-baseline gap-3">
            <span className="font-marketing-display text-xl font-semibold tracking-tightest text-marketing-ink">TLMI</span>
            <span className="hidden h-4 w-px bg-marketing-rule lg:block" aria-hidden="true" />
            <span className="hidden text-[13px] leading-none text-marketing-stone lg:block">The Light Music Institute</span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
          <Link
            key={item.label}
            href={item.href}
            className="group relative rounded-sm px-3 py-2 text-[14px] text-marketing-bark transition-colors duration-150 ease-out hover:text-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest">
            
              {item.label}
              <span
              aria-hidden="true"
              className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-200 ease-out-expo group-hover:scale-x-100" />
            
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0 md:gap-4">
          <Link
            href="/login"
            className="hidden rounded-sm px-2 py-2 text-[14px] text-marketing-bark transition-colors duration-150 ease-out hover:text-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest sm:block">
            
            Log in
          </Link>
          <Link
            href="/register"
            className="whitespace-nowrap rounded-[4px] bg-marketing-forest px-4 py-2.5 text-[14px] font-medium text-marketing-cream transition-colors duration-150 ease-out hover:bg-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
            
            Start learning
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="-mr-2 rounded-sm p-2 text-marketing-ink transition-colors duration-150 ease-out hover:bg-marketing-parchment focus:outline-none focus-visible:ring-2 focus-visible:ring-forest md:hidden">
            
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen &&
        <motion.div
          key="mobile-nav"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden border-t border-marketing-rule bg-marketing-cream md:hidden">
          
            <nav aria-label="Mobile" className="mx-auto flex max-w-shell flex-col px-6 py-2">
              {navItems.map((item) =>
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-marketing-rule/70 py-3.5 font-marketing-display text-lg text-marketing-ink last:border-0">
              
                  {item.label}
                </Link>
            )}
              <Link href="/login" className="py-3.5 text-[14px] text-marketing-bark sm:hidden">
                Log in
              </Link>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}