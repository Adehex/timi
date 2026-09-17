import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-ink-200 bg-ink-25 px-6 py-14 text-center",
        className
      )}
    >
      {icon && <div className="text-ink-300">{icon}</div>}
      <div className="space-y-1">
        <p className="font-display text-base font-medium text-ink-800">{title}</p>
        {description && <p className="max-w-sm text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
