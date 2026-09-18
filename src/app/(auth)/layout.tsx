import { SiteHeader } from "@/components/marketing-new/SiteHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-marketing-sans text-marketing-ink bg-marketing-cream">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
