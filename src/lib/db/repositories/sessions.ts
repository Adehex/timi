import { query, queryOne } from "@/lib/db/client";

interface SessionRow {
  id: string;
  userId: string;
  sessionToken: string;
  expiresAt: Date;
}

export async function createSession(params: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<SessionRow> {
  const row = await queryOne<SessionRow>(
    `INSERT INTO "sessions" ("userId", "sessionToken", "expiresAt", "ipAddress", "userAgent")
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [params.userId, params.tokenHash, params.expiresAt, params.ipAddress ?? null, params.userAgent ?? null]
  );
  if (!row) throw new Error("Failed to create session");
  return row;
}

export async function findValidSessionByTokenHash(tokenHash: string): Promise<SessionRow | null> {
  return queryOne<SessionRow>(
    `SELECT * FROM "sessions" WHERE "sessionToken" = $1 AND "expiresAt" > now()`,
    [tokenHash]
  );
}

export async function deleteSessionByTokenHash(tokenHash: string): Promise<void> {
  await query(`DELETE FROM "sessions" WHERE "sessionToken" = $1`, [tokenHash]);
}

export async function deleteAllSessionsForUser(userId: string): Promise<void> {
  await query(`DELETE FROM "sessions" WHERE "userId" = $1`, [userId]);
}

// --- Email verification tokens -------------------------------------------

export async function createVerificationToken(userId: string, tokenHash: string, expiresAt: Date) {
  await query(
    `INSERT INTO "verification_tokens" ("userId", "tokenHash", "expiresAt") VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
}

export async function consumeVerificationToken(tokenHash: string): Promise<{ userId: string } | null> {
  const row = await queryOne<{ userId: string; usedAt: Date | null; expiresAt: Date }>(
    `SELECT "userId", "usedAt", "expiresAt" FROM "verification_tokens" WHERE "tokenHash" = $1`,
    [tokenHash]
  );
  if (!row || row.usedAt || row.expiresAt < new Date()) return null;
  await query(`UPDATE "verification_tokens" SET "usedAt" = now() WHERE "tokenHash" = $1`, [tokenHash]);
  return { userId: row.userId };
}

// --- Password reset tokens -------------------------------------------------

export async function createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
  await query(
    `INSERT INTO "password_reset_tokens" ("userId", "tokenHash", "expiresAt") VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
}

export async function consumePasswordResetToken(tokenHash: string): Promise<{ userId: string } | null> {
  const row = await queryOne<{ userId: string; usedAt: Date | null; expiresAt: Date }>(
    `SELECT "userId", "usedAt", "expiresAt" FROM "password_reset_tokens" WHERE "tokenHash" = $1`,
    [tokenHash]
  );
  if (!row || row.usedAt || row.expiresAt < new Date()) return null;
  await query(`UPDATE "password_reset_tokens" SET "usedAt" = now() WHERE "tokenHash" = $1`, [tokenHash]);
  return { userId: row.userId };
}
