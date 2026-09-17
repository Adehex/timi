"use client";

import React, { useEffect, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform
} from 'framer-motion';
import { RotateCcwIcon } from 'lucide-react';

type Phase = 'bars' | 'converge' | 'reveal' | 'out';

interface LoadingSequenceProps {
  loop?: boolean;
  onComplete?: () => void;
  hideReplay?: boolean;
}

const BAR_PEAKS = [0.34, 0.6, 0.92, 0.5, 1, 0.68, 0.88, 0.44, 0.3];
const CENTER = (BAR_PEAKS.length - 1) / 2;
const BAR_WIDTH = 3;
const BAR_GAP = 11;
const STEP = BAR_WIDTH + BAR_GAP;
const RULE_WIDTH = 276;
const RULE_SCALE_Y = 0.032;

const ENTER = [0.22, 1, 0.36, 1] as const;
const MOVE = [0.25, 1, 0.5, 1] as const;

const LINES: string[][] = [
  ['The', 'Light', 'Music'],
  ['Institute']
];

export function LoadingSequence({ loop = true, onComplete, hideReplay }: LoadingSequenceProps) {
  const reducedMotion = useReducedMotion();
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<Phase>(reducedMotion ? 'reveal' : 'bars');
  const progress = useMotionValue(reducedMotion ? 100 : 0);
  const percent = useTransform(progress, (value) => `${Math.round(value)}%`);
  const fillScaleX = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    if (reducedMotion) {
      setPhase('reveal');
      progress.set(100);
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    setPhase('bars');
    progress.set(0);

    timers.push(setTimeout(() => setPhase('converge'), 1400));
    timers.push(setTimeout(() => setPhase('reveal'), 1740));
    
    if (onComplete) {
      timers.push(setTimeout(() => setPhase('out'), 3500));
      timers.push(setTimeout(onComplete, 3840));
    } else if (loop) {
      timers.push(setTimeout(() => setPhase('out'), 3500));
      timers.push(setTimeout(() => setCycle((c) => c + 1), 3840));
    }

    return () => timers.forEach(clearTimeout);
  }, [cycle, loop, onComplete, reducedMotion, progress]);

  useEffect(() => {
    if (reducedMotion || phase !== 'reveal') return;
    const controls = animate(progress, 100, { duration: 1.4, ease: MOVE });
    return () => controls.stop();
  }, [phase, reducedMotion, progress]);

  const revealed = phase === 'reveal' || phase === 'out';

  return (
    <motion.div
      className="flex w-full max-w-[420px] flex-col items-center"
      animate={{ opacity: phase === 'out' ? 0 : 1 }}
      transition={{ duration: 0.3, ease: ENTER }}>
      
      {/* Sound bars that collapse into the progress rule */}
      <div
        className="relative flex h-28 w-full items-center justify-center"
        aria-hidden="true">
        
        <div
          className="flex h-24 items-center"
          style={{ gap: `${BAR_GAP}px` }}>
          
          {BAR_PEAKS.map((peak, i) => {
            const isCenter = i === CENTER;
            const settled = {
              scaleY: RULE_SCALE_Y,
              x: -(i - CENTER) * STEP,
              scaleX: revealed && isCenter ? RULE_WIDTH / BAR_WIDTH : 1,
              opacity: isCenter ? revealed ? 0.22 : 1 : 0
            };

            return (
              <motion.span
                key={i}
                className="block h-24 rounded-[1.5px] bg-gold-500"
                style={{ width: BAR_WIDTH, transformOrigin: 'center' }}
                initial={{ scaleY: 0.05, opacity: reducedMotion ? 0 : 1 }}
                animate={
                  phase === 'bars' ?
                  {
                    scaleY: [
                      0.05,
                      peak,
                      peak * 0.42,
                      peak * 0.95,
                      peak * 0.55
                    ],
                    scaleX: 1,
                    x: 0,
                    opacity: 1
                  } :
                  settled
                }
                transition={
                  phase === 'bars' ?
                  {
                    duration: 1.45,
                    delay: i * 0.045,
                    ease: 'easeInOut',
                    times: [0, 0.22, 0.48, 0.74, 1]
                  } :
                  {
                    duration: phase === 'converge' ? 0.34 : 0.52,
                    ease: phase === 'converge' ? MOVE : ENTER
                  }
                } 
              />
            );
          })}
        </div>

        {/* Progress fill sitting exactly on the collapsed rule */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[3px] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          style={{ width: RULE_WIDTH }}>
          
          <motion.div
            className="h-full w-full origin-left bg-gold-500"
            style={{ scaleX: fillScaleX }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ duration: 0.2, ease: ENTER }} 
          />
          
        </div>
      </div>

      {/* Wordmark */}
      <h1 className="mt-7 text-center font-display text-[44px] font-medium leading-[1.05] tracking-[0.01em] text-ink-900">
        {LINES.map((line, lineIndex) =>
          <span key={lineIndex} className="flex justify-center gap-[0.28em]">
            {line.map((word, wordIndex) => {
              const order = lineIndex * 3 + wordIndex;
              return (
                <span key={word} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: '115%' }}
                    animate={{ y: revealed ? '0%' : '115%' }}
                    transition={{
                      duration: 0.62,
                      delay: revealed ? order * 0.06 : 0,
                      ease: ENTER
                    }}>
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        )}
      </h1>

      {/* Status */}
      <motion.div
        className="mt-5 flex items-baseline gap-3 font-sans text-[11px] uppercase tracking-[0.22em] text-ink-500"
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 6 }}
        transition={{ duration: 0.4, delay: revealed ? 0.26 : 0, ease: ENTER }}>
        
        <span role="status">Tuning the room</span>
        <span className="h-[1px] w-6 self-center bg-ink-900/20" />
        <motion.span className="text-ink-900/70 tabular-nums">
          {percent}
        </motion.span>
      </motion.div>

      {!hideReplay && (
        <button
          type="button"
          onClick={() => setCycle((c) => c + 1)}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-ink-900/10 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.18em] text-ink-500 transition-colors duration-200 hover:border-ink-900/25 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500/60">
          
          <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Replay
        </button>
      )}
    </motion.div>
  );
}
