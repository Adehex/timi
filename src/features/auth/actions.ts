"use server";

import { randomBytes, createHash } from "crypto";
import { redirect } from "next/navigation";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUserSession, destroyCurrentSession } from "@/lib/auth/session";
import { homePathForRole } from "@/lib/auth/rbac";
import {
  createUserWithProfile,
  findUserByEmail,
  markEmailVerified,
  updateLastLogin,
  updatePasswordHash,
} from "@/lib/db/repositories/users";
import {
  createVerificationToken,
  consumeVerificationToken,
  createPasswordResetToken,
  consumePasswordResetToken,
  deleteAllSessionsForUser,
} from "@/lib/db/repositories/sessions";
import { sendEmail, verificationEmailTemplate, passwordResetEmailTemplate } from "@/lib/email";

export interface ActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function issueVerificationEmail(userId: string, email: string, firstName: string) {
  const rawToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await createVerificationToken(userId, hashToken(rawToken), expiresAt);
  const { subject, html } = verificationEmailTemplate(
    `${APP_URL}/verify-email?token=${rawToken}`,
    firstName
  );
  await sendEmail({ to: email, subject, html });
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return { error: "An account with this email already exists. Try logging in instead." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await createUserWithProfile({
    email: parsed.data.email,
    passwordHash,
    role: "STUDENT",
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
  });

  await issueVerificationEmail(user.id, user.email, parsed.data.firstName);
  await createUserSession(user.id);

  redirect("/onboarding");
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const user = await findUserByEmail(parsed.data.email);
  // Constant error message regardless of which check fails, to avoid leaking
  // whether an email is registered.
  const genericError = "Incorrect email or password.";
  if (!user) return { error: genericError };

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!validPassword) return { error: genericError };

  if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
    return { error: "This account has been suspended. Contact support for help." };
  }

  await updateLastLogin(user.id);
  await createUserSession(user.id);

  redirect(homePathForRole(user.role));
}

export async function logoutAction(): Promise<void> {
  await destroyCurrentSession();
  redirect("/login");
}

export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const user = await findUserByEmail(parsed.data.email);
  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await createPasswordResetToken(user.id, hashToken(rawToken), expiresAt);
    const { subject, html } = passwordResetEmailTemplate(
      `${APP_URL}/reset-password?token=${rawToken}`
    );
    await sendEmail({ to: user.email, subject, html });
  }

  // Always the same response — don't reveal whether the email exists.
  return {
    success: true,
    message: "If an account exists for that email, we've sent a reset link.",
  };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const consumed = await consumePasswordResetToken(hashToken(parsed.data.token));
  if (!consumed) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await updatePasswordHash(consumed.userId, passwordHash);
  // Invalidate every existing session — a password reset should log the
  // account out everywhere, including any device an attacker may hold.
  await deleteAllSessionsForUser(consumed.userId);

  return { success: true, message: "Password updated. You can now log in." };
}

export async function verifyEmailAction(token: string): Promise<ActionState> {
  const consumed = await consumeVerificationToken(hashToken(token));
  if (!consumed) {
    return { error: "This verification link is invalid or has expired." };
  }
  await markEmailVerified(consumed.userId);
  return { success: true, message: "Email verified — welcome to TLMI!" };
}
