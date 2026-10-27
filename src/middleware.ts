import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME || "tlmi_session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/learning",
  "/practice",
  "/assignments",
  "/songs",
  "/schedule",
  "/progress",
  "/certificates",
  "/payments",
  "/notifications",
  "/profile",
  "/onboarding",
  "/teacher",
  "/admin",
];

/**
 * This only redirects unauthenticated visitors away from obviously-protected
 * paths for a fast UX (no DB round-trip on the Edge runtime). It is not the
 * authorization boundary — every protected layout also calls
 * `requireRole`/`requireUser` server-side (see src/lib/auth/rbac.ts), which
 * is the real, tamper-proof check.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the admin login page to be publicly accessible
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasSessionCookie = request.cookies.has(COOKIE_NAME);
  if (!hasSessionCookie) {
    const redirectTarget = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    const loginUrl = new URL(redirectTarget, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learning/:path*",
    "/practice/:path*",
    "/assignments/:path*",
    "/songs/:path*",
    "/schedule/:path*",
    "/progress/:path*",
    "/certificates/:path*",
    "/payments/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/onboarding",
    "/teacher/:path*",
    "/admin/:path*",
  ],
};
