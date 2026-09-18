import type { Metadata } from "next";
import "./globals.css";

// Headings/body use a system font stack (see globals.css --font-display /
// --font-sans) rather than next/font/google: this sandbox's network
// allowlist can't reach Google Fonts at build time. Swap in next/font/google
// with e.g. "Fraunces" (display) + "Inter" (body) once deployed somewhere
// with normal network access — the CSS variables are already wired up.

export const metadata: Metadata = {
  title: {
    default: "TLMI Learning | Skills that keep the presses running.",
    template: "%s | TLMI Learning",
  },
  description:
    "TLMI is a premium digital academy offering structured courses, live feedback from industry experts, and certification for the tag and label manufacturing industry.",
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
