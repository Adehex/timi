import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const alertVariants = cva("flex gap-3 rounded-[var(--radius-control)] border p-4 text-sm", {
  variants: {
    variant: {
      info: "border-info-500/20 bg-info-100 text-info-500",
      success: "border-success-500/20 bg-success-100 text-success-500",
      warning: "border-warning-500/20 bg-warning-100 text-warning-500",
      danger: "border-danger-500/20 bg-danger-100 text-danger-500",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="text-ink-800">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className="mt-0.5 text-ink-600">{children}</div>}
      </div>
    </div>
  );
}
