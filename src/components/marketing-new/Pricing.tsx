import React from 'react';
import Link from "next/link";
import { CheckIcon } from 'lucide-react';
import { plans } from '@/lib/marketing-data/content';

export function Pricing() {
  return (
    <section id="pricing" className="w-full border-t border-marketing-rule bg-marketing-cream py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] text-marketing-stone">Pricing</p>
            <h2 className="mt-4 max-w-xl font-marketing-display text-4xl font-semibold leading-[1.02] tracking-tightest text-marketing-ink lg:text-[46px]">
              Pay for one course, or study everything.
            </h2>
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-marketing-bark">
            No hidden fees. Tuition plans can be paid monthly, and studio students are billed per term.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) =>
          <div
            key={plan.name}
            className={`flex flex-col rounded-[3px] border p-7 lg:p-8 ${
            plan.featured ?
            'border-forest bg-marketing-forest text-marketing-cream lg:-mt-6 lg:mb-0 lg:pb-10 lg:pt-10' :
            'border-marketing-rule bg-transparent'}`
            }>
            
              <div className="flex items-center justify-between gap-3">
                <h3 className={`font-marketing-display text-[19px] font-medium ${plan.featured ? 'text-marketing-cream' : 'text-marketing-ink'}`}>
                  {plan.name}
                </h3>
                {plan.featured &&
              <span className="whitespace-nowrap rounded-full border border-cream/30 px-2.5 py-1 text-[11px] text-marketing-cream/80">
                    Most students
                  </span>
              }
              </div>

              <p className={`mt-6 flex items-baseline gap-1 ${plan.featured ? 'text-marketing-cream' : 'text-marketing-ink'}`}>
                <span className="font-marketing-display text-[38px] font-semibold tracking-tightest">{plan.price}</span>
                {plan.cadence &&
              <span className={`text-[14px] ${plan.featured ? 'text-marketing-cream/70' : 'text-marketing-stone'}`}>{plan.cadence}</span>
              }
              </p>
              <p className={`mt-2 text-[14px] ${plan.featured ? 'text-marketing-cream/75' : 'text-marketing-stone'}`}>{plan.summary}</p>

              <ul className={`mt-7 space-y-3 border-t pt-7 ${plan.featured ? 'border-cream/20' : 'border-marketing-rule'}`}>
                {plan.includes.map((item) =>
              <li key={item} className="flex gap-3 text-[15px] leading-snug">
                    <CheckIcon
                  className={`mt-0.5 h-4 w-4 flex-none ${plan.featured ? 'text-marketing-gold' : 'text-marketing-forest'}`}
                  aria-hidden="true" />
                
                    <span className={plan.featured ? 'text-marketing-cream/90' : 'text-marketing-bark'}>{item}</span>
                  </li>
              )}
              </ul>

              <div className="mt-auto pt-10">
                <Link
                href="/register"
                className={`flex w-full items-center justify-center rounded-[4px] px-5 py-3 text-[15px] font-medium transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                plan.featured ?
                'bg-marketing-cream text-marketing-ink hover:bg-marketing-parchment focus-visible:ring-cream focus-visible:ring-offset-forest' :
                'border border-marketing-ink text-marketing-ink hover:bg-marketing-ink hover:text-marketing-cream focus-visible:ring-forest focus-visible:ring-offset-cream'}`
                }>
                
                  {plan.cta}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}