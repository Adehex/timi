"use client";
import React from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { firstMonth } from '@/lib/marketing-data/content';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 }
};

const transition = { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const };

export function Hero() {
  return (
    <section id="top" className="w-full bg-marketing-cream">
      <div className="mx-auto max-w-shell px-6 pb-16 pt-14 lg:px-10 lg:pb-24 lg:pt-20">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-12">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.06 }} className="lg:col-span-7">
            <motion.p variants={fadeUp} transition={transition} className="flex items-center gap-3 text-[13px] text-marketing-stone">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              Guitar enrollment opening — registration is live
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={transition}
              className="mt-6 font-marketing-display text-[44px] font-semibold leading-[0.96] tracking-tightest text-marketing-ink sm:text-6xl lg:text-[76px]">
              
              Learn music. Build skill.
              <br className="hidden sm:block" /> Find your{' '}
              <span className="italic font-normal text-marketing-forest">sound</span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={transition}
              className="mt-7 max-w-xl text-[17px] leading-relaxed text-marketing-bark">
              
              A digital music academy with structured courses, real teacher feedback on the performances you submit,
              built-in practice tools, and certificates anyone can verify.
            </motion.p>

            <motion.div variants={fadeUp} transition={transition} className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="rounded-[4px] bg-marketing-forest px-6 py-3.5 text-[15px] font-medium text-marketing-cream transition-colors duration-150 ease-out hover:bg-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
                
                Register free
              </Link>
              <Link
                href="#how-it-works"
                className="group flex items-center gap-2 rounded-[4px] border border-marketing-rule px-6 py-3.5 text-[15px] font-medium text-marketing-ink transition-colors duration-150 ease-out hover:border-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest">
                
                See how it works
                <ArrowRightIcon
                  className="h-4 w-4 text-marketing-stone transition-transform duration-200 ease-out-expo group-hover:translate-x-1"
                  aria-hidden="true" />
                
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} transition={transition} className="mt-14 border-t border-marketing-rule pt-8">
              <h2 className="font-marketing-display text-[19px] font-medium text-marketing-ink">What a first month looks like</h2>
              <ol className="mt-5 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
                {firstMonth.map((item, index) =>
                <li key={item} className="flex gap-3">
                    <span className="mt-[3px] font-marketing-display text-[13px] text-marketing-gold" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[15px] leading-snug text-marketing-bark">{item}</span>
                  </li>
                )}
              </ol>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
            className="relative lg:col-span-5 lg:pt-4">
            
            <div className="absolute -right-10 -top-8 hidden h-64 w-64 bg-marketing-parchment lg:block" aria-hidden="true" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-marketing-parchment">
              <img
                src="/f6450118-8933-4a22-a69f-69be79f49b32.jpg"
                alt="A student practising in a sunlit rehearsal room at the institute"
                className="h-full w-full object-cover" />
              
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-marketing-stone">
              Guitar is where we start. Keyboard, bass, drums, voice, and theory slot into the same platform.
            </p>
          </motion.div>
        </div>
      </div>
    </section>);

}