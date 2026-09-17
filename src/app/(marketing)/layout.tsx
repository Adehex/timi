import { SiteHeader } from "@/components/marketing-new/SiteHeader";
import { SiteFooter } from "@/components/marketing-new/SiteFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-marketing-sans text-marketing-ink bg-marketing-cream">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
