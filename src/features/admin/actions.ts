"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { createUserWithProfile, findUserByEmail } from "@/lib/db/repositories/users";
import { requireRole } from "@/lib/auth/rbac";

export interface ActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
}

const enrollStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export async function enrollStudentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // Ensure only admins can trigger this action
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const parsed = enrollStudentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return { error: "A user with this email already exists." };
  }

  // Generate a temporary password (e.g. random 8 chars)
  const tempPassword = Math.random().toString(36).slice(-8);
  const passwordHash = await hashPassword(tempPassword);

  try {
    await createUserWithProfile({
      email: parsed.data.email,
      passwordHash,
      role: "STUDENT",
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    });
    
    revalidatePath("/admin/students");
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Student enrolled successfully. Temporary password: ${tempPassword}` };
  } catch (error: any) {
    console.error("Failed to enroll student:", error);
    return { error: "Failed to enroll student due to an unexpected error." };
  }
}

const scheduleClassSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  courseId: z.string().optional(),
  format: z.enum(["PHYSICAL", "ONLINE"]),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export async function scheduleClassAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const parsed = scheduleClassSchema.safeParse({
    title: formData.get("title"),
    teacherId: formData.get("teacherId"),
    courseId: formData.get("courseId"),
    format: formData.get("format"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Parse dates
  const startDateTime = new Date(`${parsed.data.date}T${parsed.data.startTime}`);
  const endDateTime = new Date(`${parsed.data.date}T${parsed.data.endTime}`);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    return { error: "Invalid date or time." };
  }

  try {
    const { query } = await import("@/lib/db/client");
    await query(
      `INSERT INTO "classes" ("title", "teacherId", "courseId", "format", "startTime", "endTime", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, now())`,
      [
        parsed.data.title, 
        parsed.data.teacherId, 
        parsed.data.courseId || null, 
        parsed.data.format, 
        startDateTime, 
        endDateTime
      ]
    );

    revalidatePath("/admin/dashboard");
    return { success: true, message: "Class scheduled successfully." };
  } catch (error: any) {
    console.error("Failed to schedule class:", error);
    return { error: "Failed to schedule class due to an unexpected error." };
  }
}

export async function getTeachersForDropdown() {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const { query } = await import("@/lib/db/client");
  const result = await query(`
    SELECT t.id as "teacherId", p."firstName", p."lastName" 
    FROM "teacher_profiles" t
    JOIN "profiles" p ON p."userId" = t."userId"
  `);
  return result;
}

export async function getCoursesForDropdown() {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const { query } = await import("@/lib/db/client");
  const result = await query(`SELECT id, title FROM "courses" ORDER BY title ASC`);
  return result;
}
