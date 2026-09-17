import React from 'react';
import {
  AwardIcon,
  GaugeIcon,
  LayersIcon,
  SlidersHorizontalIcon,
  UsersIcon,
  MessageSquareIcon } from
'lucide-react';
import { features, type Feature } from '@/lib/marketing-data/content';

const iconFor: Record<Feature['icon'], React.ComponentType<{className?: string;}>> = {
  progression: LayersIcon,
  tools: SlidersHorizontalIcon,
  progress: GaugeIcon,
  certificate: AwardIcon,
  classes: UsersIcon
};

const feedbackNotes = [
{ time: '0:14', note: 'Fret hand is flattening on the B string — curl the knuckle.' },
{ time: '0:41', note: 'Good timing through the chorus. Keep that strum width.' },
{ time: '1:08', note: 'Slow the change to F to 60bpm and resubmit this bar.' }];


export function Features() {
  return (
    <section className="w-full border-t border-marketing-rule bg-marketing-cream py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-[13px] text-marketing-stone">Why it works</p>
            <h2 className="mt-4 max-w-lg font-marketing-display text-4xl font-semibold leading-[1.02] tracking-tightest text-marketing-ink lg:text-[46px]">
              A real teacher watches you play.
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-marketing-bark">
              Record a performance from your phone, submit it with your assignment, and get specific, timestamped notes
              back — plus a clear decision: pass, needs improvement, or resubmit.
            </p>

            <div className="mt-10 overflow-hidden rounded-[2px] border border-marketing-rule">
              <img
                src="/0d16ab28-f893-4bab-aed9-b1f8b9220d3d.jpg"
                alt="A student recording a guitar performance video at home"
                className="h-56 w-full object-cover sm:h-72" />
              
              <div className="border-t border-marketing-rule bg-marketing-parchment/60 p-6 lg:p-7">
                <div className="flex items-center gap-2 text-[13px] text-marketing-stone">
                  <MessageSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Assignment 3 — Chord changes, reviewed by Mr. Adeyemi
                </div>
                <ul className="mt-5 space-y-3.5">
                  {feedbackNotes.map((item) =>
                  <li key={item.time} className="flex gap-4">
                      <span className="w-10 flex-none font-marketing-display text-[14px] text-marketing-gold">{item.time}</span>
                      <span className="text-[15px] leading-snug text-marketing-ink">{item.note}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <ul className="lg:col-span-5 lg:pt-16">
            {features.map((feature) => {
              const Icon = iconFor[feature.icon];
              return (
                <li key={feature.title} className="flex gap-4 border-t border-marketing-rule py-6 first:border-t-0 first:pt-0">
                  <Icon className="mt-1 h-4 w-4 flex-none text-marketing-forest" aria-hidden="true" />
                  <div>
                    <h3 className="font-marketing-display text-[18px] font-medium text-marketing-ink">{feature.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-marketing-bark">{feature.detail}</p>
                  </div>
                </li>);

            })}
          </ul>
        </div>
      </div>
    </section>);

}