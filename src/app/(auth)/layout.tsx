import { MarketingHeader } from "@/components/layout/marketing-nav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="surface-spotlight flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
