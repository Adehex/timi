"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from "next/link";
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { navItems } from '@/lib/marketing-data/navigation';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { useSearchParams } from 'next/navigation';

import Image from 'next/image';

function SiteHeaderInner() {
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(searchParams.get('login') === 'true');
  const [registerModalOpen, setRegisterModalOpen] = useState(searchParams.get('register') === 'true');

  const openLogin = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  const openRegister = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };

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
          
          <Image src="/logo.jpg" alt="TLMI Logo" width={36} height={36} className="rounded-sm object-cover" />
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
          <button
            onClick={openLogin}
            className="hidden rounded-sm px-2 py-2 text-[14px] text-marketing-bark transition-colors duration-150 ease-out hover:text-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest sm:block">
            
            Log in
          </button>
          <button
            onClick={openRegister}
            className="whitespace-nowrap rounded-[4px] bg-marketing-forest px-4 py-2.5 text-[14px] font-medium text-marketing-cream transition-colors duration-150 ease-out hover:bg-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
            
            Start learning
          </button>
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
              <button onClick={() => { setMobileOpen(false); openLogin(); }} className="py-3.5 text-[14px] text-marketing-bark sm:hidden text-left">
                Log in
              </button>
            </nav>
          </motion.div>
        }
      </AnimatePresence>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} onSwitchToRegister={openRegister} />
      <RegisterModal open={registerModalOpen} onOpenChange={setRegisterModalOpen} onSwitchToLogin={openLogin} />
    </header>
  );
}

export function SiteHeader() {
  return (
    <Suspense fallback={<div className="h-[73px] w-full bg-marketing-cream"></div>}>
      <SiteHeaderInner />
    </Suspense>
  );
}