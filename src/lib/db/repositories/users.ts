import { query, queryOne, withTransaction } from "@/lib/db/client";
import type { Role, User } from "@/types/db";

export async function findUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(`SELECT * FROM "users" WHERE "email" = $1 AND "deletedAt" IS NULL`, [
    email.toLowerCase().trim(),
  ]);
}

export async function findUserById(id: string): Promise<User | null> {
  return queryOne<User>(`SELECT * FROM "users" WHERE "id" = $1 AND "deletedAt" IS NULL`, [id]);
}

interface CreateUserWithProfileInput {
  email: string;
  passwordHash: string;
  role: Role;
  firstName: string;
  lastName: string;
}

/** Creates the user + profile rows atomically so we never end up with an orphaned account. */
export async function createUserWithProfile(input: CreateUserWithProfileInput): Promise<User> {
  return withTransaction(async (client) => {
    const userResult = await client.query<User>(
      `INSERT INTO "users" ("email", "passwordHash", "role")
       VALUES ($1, $2, $3)
       RETURNING *`,
      [input.email.toLowerCase().trim(), input.passwordHash, input.role]
    );
    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO "profiles" ("userId", "firstName", "lastName")
       VALUES ($1, $2, $3)`,
      [user.id, input.firstName.trim(), input.lastName.trim()]
    );

    if (input.role === "STUDENT") {
      await client.query(`INSERT INTO "student_profiles" ("userId") VALUES ($1)`, [user.id]);
    }
    if (input.role === "TEACHER") {
      await client.query(`INSERT INTO "teacher_profiles" ("userId") VALUES ($1)`, [user.id]);
    }

    return user;
  });
}

export async function markEmailVerified(userId: string): Promise<void> {
  await query(
    `UPDATE "users" SET "emailVerifiedAt" = now(), "status" = 'ACTIVE', "updatedAt" = now() WHERE "id" = $1`,
    [userId]
  );
}

export async function updateLastLogin(userId: string): Promise<void> {
  await query(`UPDATE "users" SET "lastLoginAt" = now() WHERE "id" = $1`, [userId]);
}

export async function updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
  await query(`UPDATE "users" SET "passwordHash" = $1, "updatedAt" = now() WHERE "id" = $2`, [
    passwordHash,
    userId,
  ]);
}
