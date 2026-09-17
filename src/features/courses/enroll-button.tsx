"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourseAction } from "@/features/courses/actions";
import { Button } from "@/components/ui/button";

export function EnrollButton({ courseId, isFree }: { courseId: string; isFree: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await enrollInCourseAction(courseId);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div>
      <Button variant="gold" size="sm" className="w-full" onClick={handleClick} disabled={isPending}>
        {isPending ? "Enrolling…" : isFree ? "Enroll for free" : "Enroll & Pay"}
      </Button>
      {error && <p className="mt-2 text-xs text-danger-500">{error}</p>}
    </div>
  );
}
