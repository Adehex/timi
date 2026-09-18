"use client";

import React, { useState, useEffect } from 'react';
import { LoadingSequence } from './LoadingSequence';

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  // Prevent scrolling while the splash screen is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('is-splashing');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('is-splashing');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('is-splashing');
    };
  }, [showSplash]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-25">
      <LoadingSequence loop={false} hideReplay={true} onComplete={() => setShowSplash(false)} />
    </div>
  );
}
