import { queryOne } from "@/lib/db/client";
import type { Profile } from "@/types/db";

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  return queryOne<Profile>(`SELECT * FROM "profiles" WHERE "userId" = $1`, [userId]);
}
