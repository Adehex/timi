import { query } from "@/lib/db/client";

async function main() {
  const rows = await query(
    `SELECT u.email, u.role, u.status, p."firstName", p."lastName", u."createdAt"
     FROM "users" u
     LEFT JOIN "profiles" p ON p."userId" = u.id
     ORDER BY u.role, u."createdAt"`
  );

  if (rows.length === 0) {
    console.log("No users found in the database.");
    return;
  }

  console.log("\n=== ALL USERS ===\n");
  for (const row of rows) {
    console.log(`Role:    ${row.role}`);
    console.log(`Name:    ${row.firstName ?? "-"} ${row.lastName ?? "-"}`);
    console.log(`Email:   ${row.email}`);
    console.log(`Status:  ${row.status}`);
    console.log(`Joined:  ${new Date(row.createdAt).toISOString().split("T")[0]}`);
    console.log("---");
  }
}

main().catch(console.error);
