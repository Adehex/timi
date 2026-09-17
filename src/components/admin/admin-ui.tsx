import type { ReactNode } from "react";

export function AdminButton({ children, variant = "secondary", icon, className = "", ...props }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost"; icon?: ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: "bg-ink text-canvas hover:bg-ink-soft",
    secondary: "bg-surface text-ink ring-1 ring-inset ring-line-strong hover:bg-canvas",
    ghost: "text-ink-soft hover:bg-canvas",
  };
  return <button type="button" className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors duration-150 ${styles[variant]} ${className}`} {...props}>{icon}{children}</button>;
}

export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return <header className="flex flex-wrap items-end justify-between gap-5"><div>{eyebrow && <p className="text-[13px] font-medium text-brass-deep">{eyebrow}</p>}<h1 className="mt-1 font-display text-[32px] leading-tight text-ink">{title}</h1>{subtitle && <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{subtitle}</p>}</div>{children && <div className="flex flex-wrap items-center gap-2">{children}</div>}</header>;
}

export function Panel({ title, description, action, children, className = "", bodyClassName = "p-5" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return <section className={`flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card ${className}`}><header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4"><div><h2 className="font-display text-lg leading-tight text-ink">{title}</h2>{description && <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>}</div>{action}</header><div className={`flex-1 ${bodyClassName}`}>{children}</div></section>;
}

const tones = { neutral: "bg-canvas text-ink-soft ring-line-strong", positive: "bg-moss-soft text-moss ring-moss/20", warning: "bg-clay-soft text-clay ring-clay/20", brass: "bg-brass-soft text-brass-deep ring-brass/25" };
export function StatusPill({ children, tone = "neutral", dot = false }: { children: ReactNode; tone?: keyof typeof tones; dot?: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ring-1 ring-inset ${tones[tone]}`}>{dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}{children}</span>;
}
