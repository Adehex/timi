import React from 'react';
import { steps } from '@/lib/marketing-data/content';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full border-t border-marketing-rule bg-marketing-parchment/60 py-20 lg:py-28">
      <div className="mx-auto grid max-w-shell grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="text-[13px] text-marketing-stone">How TLMI works</p>
            <h2 className="mt-4 font-marketing-display text-4xl font-semibold leading-[1.02] tracking-tightest text-marketing-ink lg:text-[46px]">
              Five steps from first chord to certificate.
            </h2>
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-marketing-bark">
              The same path every student takes — no guessing what to practise next, and a real teacher checking your
              playing along the way.
            </p>
          </div>
        </div>

        <ol className="lg:col-span-8">
          {steps.map((step, index) =>
          <li key={step.title} className="group relative flex gap-6 border-t border-marketing-rule py-7 first:border-t-0 sm:gap-10">
              <span className="mt-1 font-marketing-display text-[15px] text-marketing-gold" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="max-w-2xl">
                <h3 className="font-marketing-display text-[22px] font-medium leading-snug text-marketing-ink lg:text-2xl">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marketing-bark">{step.detail}</p>
              </div>
            </li>
          )}
        </ol>
      </div>
    </section>);

}