"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { AnimatePresence, motion } from 'framer-motion';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { faqs } from '@/lib/marketing-data/content';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full border-t border-marketing-rule bg-marketing-cream py-20 lg:py-28">
      <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-4">
          <p className="text-[13px] text-marketing-stone">FAQ</p>
          <h2 className="mt-4 font-marketing-display text-4xl font-semibold leading-[1.02] tracking-tightest text-marketing-ink lg:text-[46px]">
            Questions before you start.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-marketing-bark">
            Still unsure?{' '}
            <Link href="#contact" className="text-marketing-forest underline decoration-rule underline-offset-4 hover:decoration-forest">
              Message the admissions team
            </Link>{' '}
            and a teacher will reply.
          </p>
        </div>

        <div className="lg:col-span-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-t border-marketing-rule first:border-t-0">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-forest">
                    
                    <span className="font-marketing-display text-[20px] font-medium leading-snug text-marketing-ink lg:text-[22px]">
                      {faq.question}
                    </span>
                    <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-marketing-rule text-marketing-ink">
                      {isOpen ?
                      <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

                      <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      }
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen &&
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden">
                    
                      <p className="max-w-2xl pb-7 pr-10 text-[15px] leading-relaxed text-marketing-bark">{faq.answer}</p>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>);

          })}
        </div>
      </div>
    </section>);

}