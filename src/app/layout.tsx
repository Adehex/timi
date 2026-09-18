import type { Metadata } from "next";
import "./globals.css";

// Headings/body use a system font stack (see globals.css --font-display /
// --font-sans) rather than next/font/google: this sandbox's network
// allowlist can't reach Google Fonts at build time. Swap in next/font/google
// with e.g. "Fraunces" (display) + "Inter" (body) once deployed somewhere
// with normal network access — the CSS variables are already wired up.

export const metadata: Metadata = {
  title: {
    default: "The Light Music Institute | Learn Music. Build Skill. Find Your Sound.",
    template: "%s | The Light Music Institute",
  },
  description:
    "TLMI is a premium digital music academy offering structured guitar courses, live feedback from real teachers, practice tools, and certification — built to grow into keyboard, bass, drums, voice, and theory.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

import { SplashScreen } from "@/components/ui/SplashScreen";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
