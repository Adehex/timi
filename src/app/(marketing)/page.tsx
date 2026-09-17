import { Hero } from "@/components/marketing-new/Hero";
import { Courses } from "@/components/marketing-new/Courses";
import { HowItWorks } from "@/components/marketing-new/HowItWorks";
import { Features } from "@/components/marketing-new/Features";
import { Pricing } from "@/components/marketing-new/Pricing";
import { Faq } from "@/components/marketing-new/Faq";
import { ClosingCta } from "@/components/marketing-new/ClosingCta";

export const dynamic = "force-dynamic";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <Courses />
      <HowItWorks />
      <Features />
      <Pricing />
      <Faq />
      <ClosingCta />
    </>
  );
}
