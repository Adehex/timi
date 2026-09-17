import React from 'react';
import Link from "next/link";

export function ClosingCta() {
  return (
    <section id="enroll" className="w-full bg-marketing-forest">
      <div className="mx-auto grid max-w-shell grid-cols-1 items-stretch lg:grid-cols-12">
        <div className="px-6 py-16 lg:col-span-7 lg:px-10 lg:py-24">
          <h2 className="max-w-xl font-marketing-display text-4xl font-semibold leading-[1.02] tracking-tightest text-marketing-cream lg:text-[52px]">
            Ready to find your sound?
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-marketing-cream/75">
            Register free, tell us what you want to play, and start your first lesson today. No instrument experience
            required.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#register"
              className="rounded-[4px] bg-marketing-cream px-6 py-3.5 text-[15px] font-medium text-marketing-ink transition-colors duration-150 ease-out hover:bg-marketing-parchment focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest">
              
              Register free
            </Link>
            <Link
              href="#contact"
              className="rounded-[4px] border border-cream/30 px-6 py-3.5 text-[15px] font-medium text-marketing-cream transition-colors duration-150 ease-out hover:border-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-cream">
              
              Visit the studio
            </Link>
          </div>
        </div>
        <div className="relative min-h-[240px] lg:col-span-5">
          <img
            src="/0ebe8ea2-d48e-4dea-96fe-abd01af319f9.jpg"
            alt="The TLMI teaching studio with guitars on the wall and chairs in a semicircle"
            className="absolute inset-0 h-full w-full object-cover" />
          
        </div>
      </div>
    </section>);

}