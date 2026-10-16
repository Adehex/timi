import { NextResponse } from "next/server";
import { query } from "@/lib/db/client";
import { requireRole } from "@/lib/auth/rbac";

export async function GET() {
  try {
    // Only admins can export
    await requireRole(["ADMIN", "SUPER_ADMIN"]);

    // Fetch student profiles with user email
    interface StudentExportRow {
      firstName: string;
      lastName: string;
      email: string;
      status: string;
      createdAt: string | Date;
    }

    const students = await query<StudentExportRow>(`
      SELECT 
        p."firstName",
        p."lastName",
        u.email,
        u.status,
        u."createdAt"
      FROM "student_profiles" sp
      JOIN "profiles" p ON p."userId" = sp."userId"
      JOIN "users" u ON u.id = sp."userId"
      ORDER BY p."lastName" ASC, p."firstName" ASC
    `);

    // Generate CSV string
    const headers = ["First Name", "Last Name", "Email", "Status", "Joined At"];
    const rows = students.map((row: StudentExportRow) => [
      row.firstName,
      row.lastName,
      row.email,
      row.status,
      new Date(row.createdAt).toISOString().split("T")[0]
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: (string | number)[]) => row.map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="students.csv"',
      },
    });
  } catch (error: any) {
    console.error("Failed to export students:", error);
    // If not authorized, requireRole might throw or redirect, but let's handle generic errors
    return new NextResponse("Failed to export students", { status: 500 });
  }
}
