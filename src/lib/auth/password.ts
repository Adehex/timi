import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Server-side password strength check (defense in depth — the Zod schema
 * enforces the same rule on submitted values, but this guards any call site
 * that constructs a password outside a form, e.g. an admin "create user" flow).
 */
export function isPasswordStrongEnough(plainPassword: string): boolean {
  return (
    plainPassword.length >= 8 &&
    /[a-z]/.test(plainPassword) &&
    /[A-Z]/.test(plainPassword) &&
    /[0-9]/.test(plainPassword)
  );
}
