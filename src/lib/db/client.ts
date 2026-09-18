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
  var __tlmiPool5: Pool | undefined;
}

let _pool: Pool | undefined;

export function getPool() {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("WARNING: DATABASE_URL is not set. Database queries will return empty results.");
      return {
        connect: async () => ({ query: async () => ({ rows: [] }), release: () => {} }),
        query: async () => ({ rows: [] }),
        end: async () => {},
      } as unknown as Pool;
    }
    let cleanConnectionString = connectionString;
    try {
      const url = new URL(connectionString);
      url.searchParams.delete("sslmode");
      url.searchParams.delete("ssl");
      cleanConnectionString = url.toString();
    } catch {
      // ignore
    }

    _pool = globalThis.__tlmiPool5 ?? new Pool({
      connectionString: cleanConnectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      ssl: { rejectUnauthorized: false },
    });
    if (process.env.NODE_ENV !== "production") {
      globalThis.__tlmiPool5 = _pool;
    }
  }
  return _pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!process.env.DATABASE_URL) {
    console.warn(`[DB Mock] Skipping query: ${text.slice(0, 50)}...`);
    return [];
  }
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
  if (!process.env.DATABASE_URL) {
    console.warn(`[DB Mock] Skipping transaction.`);
    // We have to return a dummy value of type T, but since T is unknown, this might crash if the caller expects an object.
    // However, withTransaction is usually used for mutations (not during static build), so we can just throw here safely.
    throw new Error("Cannot run transactions without DATABASE_URL");
  }
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
