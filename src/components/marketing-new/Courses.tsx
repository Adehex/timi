"use client";
import React, { useState } from 'react';
import { CheckIcon, LockIcon } from 'lucide-react';
import { courseLevels, instruments } from '@/lib/marketing-data/content';

export function Courses() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="courses" className="w-full border-t border-marketing-rule bg-marketing-cream py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] text-marketing-stone">Guitar courses</p>
            <h2 className="mt-4 max-w-xl font-marketing-display text-4xl font-semibold leading-[1.02] tracking-tightest text-marketing-ink lg:text-[46px]">
              Level-based, and taught by real instructors.
            </h2>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:max-w-sm sm:justify-end">
            {instruments.map((instrument) =>
            <li
              key={instrument.name}
              className={`flex items-center gap-1.5 text-[14px] ${
              instrument.status === 'live' ? 'text-marketing-ink' : 'text-marketing-stone'}`
              }>
              
                <span
                className={`h-1.5 w-1.5 rounded-full ${instrument.status === 'live' ? 'bg-gold' : 'bg-marketing-rule'}`}
                aria-hidden="true" />
              
                {instrument.name}
                {instrument.status === 'next' && <span className="sr-only"> (coming soon)</span>}
              </li>
            )}
          </ul>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <ul className="lg:col-span-7">
            {courseLevels.map((course) =>
            <li
              key={course.title}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-marketing-rule py-6 first:border-t-0">
              
                <span className="w-16 flex-none font-marketing-display text-[14px] text-marketing-gold">{course.level}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-marketing-display text-[22px] font-medium text-marketing-ink lg:text-2xl">{course.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-marketing-bark">{course.detail}</p>
                  <p className="mt-2 text-[13px] text-marketing-stone">{course.modules}</p>
                </div>
                <span className="flex items-center gap-1.5 self-start rounded-full border border-marketing-rule px-2.5 py-1 text-[12px] text-marketing-stone">
                  <LockIcon className="h-3 w-3" aria-hidden="true" />
                  Opens soon
                </span>
              </li>
            )}
          </ul>

          <div className="lg:col-span-5">
            <div className="border border-marketing-rule bg-marketing-parchment/70 p-7 lg:p-8">
              <h3 className="font-marketing-display text-[22px] font-medium leading-snug text-marketing-ink">
                Courses are being finalized by our instructors.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-marketing-bark">
                Register now and we&apos;ll email you the moment enrollment opens — registered students get first access
                to the beginner cohort.
              </p>

              {submitted ?
              <p className="mt-7 flex items-start gap-2.5 border-t border-marketing-rule pt-6 text-[15px] text-marketing-forest">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                  You&apos;re on the list. We&apos;ll be in touch at {email}.
                </p> :

              <form onSubmit={handleSubmit} className="mt-7 border-t border-marketing-rule pt-6">
                  <label htmlFor="notify-email" className="block text-[13px] text-marketing-stone">
                    Email address
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                    id="notify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 rounded-[4px] border border-marketing-rule bg-marketing-cream px-3.5 py-3 text-[15px] text-marketing-ink placeholder:text-marketing-stone/70 focus:border-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/30" />
                  
                    <button
                    type="submit"
                    className="whitespace-nowrap rounded-[4px] bg-marketing-forest px-5 py-3 text-[15px] font-medium text-marketing-cream transition-colors duration-150 ease-out hover:bg-marketing-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-parchment">
                    
                      Notify me
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </section>);

}