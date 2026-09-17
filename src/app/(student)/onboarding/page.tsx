import { requireRole } from "@/lib/auth/rbac";
import { listActiveInstruments } from "@/lib/db/repositories/courses";
import { OnboardingForm } from "@/features/auth/onboarding-form";

const GOALS = [
  "Learn chords",
  "Play songs",
  "Lead guitar",
  "Rhythm guitar",
  "Worship guitar",
  "Music theory",
  "Performance",
  "General improvement",
];

export default async function OnboardingPage() {
  await requireRole(["STUDENT"]);
  const instruments = await listActiveInstruments();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Let&apos;s personalize your journey</h1>
      <p className="mt-2 text-ink-500">This takes less than a minute and helps us recommend the right course.</p>
      <OnboardingForm instruments={instruments} goals={GOALS} />
    </div>
  );
}
