import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      variant: {
        neutral: "bg-ink-50 text-ink-700 border-ink-200",
        gold: "bg-gold-50 text-gold-800 border-gold-200",
        success: "bg-success-100 text-success-500 border-success-500/20",
        warning: "bg-warning-100 text-warning-500 border-warning-500/20",
        danger: "bg-danger-100 text-danger-500 border-danger-500/20",
        info: "bg-info-100 text-info-500 border-info-500/20",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
