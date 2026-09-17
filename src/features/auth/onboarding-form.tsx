"use client";

import { useActionState, useState } from "react";
import { completeOnboardingAction } from "@/features/auth/onboarding-actions";
import type { ActionState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils/cn";
import type { Instrument } from "@/types/db";

const LEVELS = [
  { value: "BEGINNER", label: "Complete beginner" },
  { value: "INTERMEDIATE", label: "Some experience" },
  { value: "ADVANCED", label: "Advanced" },
];

const initialState: ActionState = {};

export function OnboardingForm({ instruments, goals }: { instruments: Instrument[]; goals: string[] }) {
  const [state, formAction, isPending] = useActionState(completeOnboardingAction, initialState);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  return (
    <form action={formAction} className="mt-8 space-y-8">
      {state.error && <Alert variant="danger">{state.error}</Alert>}

      <fieldset>
        <Label>Which instrument?</Label>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {instruments.map((instrument, i) => (
            <label
              key={instrument.id}
              className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-control)] border border-ink-200 p-3 text-sm has-[:checked]:border-gold-400 has-[:checked]:bg-gold-50"
            >
              <input
                type="radio"
                name="primaryInstrumentSlug"
                value={instrument.slug}
                defaultChecked={i === 0}
                disabled={!instrument.isActive}
                className="accent-gold-500"
                required
              />
              {instrument.name}
              {!instrument.isActive && <span className="text-xs text-ink-400">(soon)</span>}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <Label>Your experience level</Label>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {LEVELS.map((level, i) => (
            <label
              key={level.value}
              className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-control)] border border-ink-200 p-3 text-sm has-[:checked]:border-gold-400 has-[:checked]:bg-gold-50"
            >
              <input
                type="radio"
                name="experienceLevel"
                value={level.value}
                defaultChecked={i === 0}
                className="accent-gold-500"
                required
              />
              {level.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <Label>What do you want to achieve? (choose any)</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                selectedGoals.includes(goal)
                  ? "border-gold-400 bg-gold-50 text-gold-800"
                  : "border-ink-200 text-ink-600 hover:bg-ink-50"
              )}
            >
              {goal}
            </button>
          ))}
        </div>
        {selectedGoals.map((goal) => (
          <input key={goal} type="hidden" name="learningGoals" value={goal} />
        ))}
        {state.fieldErrors?.learningGoals && (
          <p className="mt-2 text-xs text-danger-500">{state.fieldErrors.learningGoals[0]}</p>
        )}
      </fieldset>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Saving…" : "Continue to courses"}
      </Button>
    </form>
  );
}
