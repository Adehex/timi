"use client";

import { useTransition } from "react";
import { markLessonCompleteAction } from "@/features/lessons/actions";
import { Button } from "@/components/ui/button";

export function LessonCompleteButton({ lessonId, courseSlug }: { lessonId: string; courseSlug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => markLessonCompleteAction(lessonId, courseSlug))}
    >
      {isPending ? "Saving…" : "Mark complete"}
    </Button>
  );
}
