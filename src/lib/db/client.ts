import { Pool, type QueryResultRow } from "pg";

/**
 * Database access layer.
 *
 * The canonical schema lives in `prisma/schema.prisma` and is applied via
 * `prisma/migrations/*` — that remains the source of truth for structure,
 * and `npx prisma generate && npx prisma migrate deploy` works normally in
 * any environment with unrestricted network access to Prisma's engine CDN.
 *
 * Query execution in application code goes through this thin `pg` pool and
 * the typed repositories in `src/lib/db/repositories/*` instead of
 * `@prisma/client` directly, so the app runs the same way regardless of
 * whether the deploy target can reach that CDN. Swapping the repositories'
 * internals to `PrismaClient` calls later is a mechanical, low-risk change
 * because callers only depend on the repository function signatures below,
 * never on `pg` types directly.
 */

declare global {
  var __tlmiPool: Pool | undefined;
}

let _pool: Pool | undefined;

export function getPool() {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");
    }
    _pool = globalThis.__tlmiPool ?? new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
    if (process.env.NODE_ENV !== "production") {
      globalThis.__tlmiPool = _pool;
    }
  }
  return _pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/** Run several statements atomically. Throws (and rolls back) if `fn` throws. */
export async function withTransaction<T>(fn: (client: import("pg").PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
