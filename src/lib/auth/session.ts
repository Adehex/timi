import "server-only";
import { cookies, headers } from "next/headers";
import { randomBytes, createHash } from "crypto";
import {
  createSession,
  deleteSessionByTokenHash,
  findValidSessionByTokenHash,
} from "@/lib/db/repositories/sessions";
import { findUserById } from "@/lib/db/repositories/users";
import type { User } from "@/types/db";

const COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME || "tlmi_session";
const SESSION_TTL_DAYS = Number(process.env.AUTH_SESSION_TTL_DAYS || 30);

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Issues a new session for `userId` and sets the session cookie on the response. */
export async function createUserSession(userId: string): Promise<void> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  const headerList = await headers();
  await createSession({
    userId,
    tokenHash,
    expiresAt,
    ipAddress: headerList.get("x-forwarded-for"),
    userAgent: headerList.get("user-agent"),
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(COOKIE_NAME)?.value;
  if (rawToken) {
    await deleteSessionByTokenHash(hashToken(rawToken));
  }
  cookieStore.delete(COOKIE_NAME);
}

/** Returns the authenticated user for the current request, or null. Never throws. */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const session = await findValidSessionByTokenHash(hashToken(rawToken));
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user || user.status === "SUSPENDED" || user.status === "DEACTIVATED") return null;

  return user;
}
