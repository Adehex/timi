/**
 * Exercises the actual repository + auth functions used by the Next.js app
 * (not a separate mock) directly against the live database, as a stand-in
 * for a full browser-driven login: Next.js 16 Server Actions submit via a
 * wire protocol (Next-Action headers + RSC action references) that isn't
 * practical to replicate with raw curl, so this calls the same underlying
 * functions the /login route calls.
 *
 * Run with: npx tsx scripts/verify-core-flows.ts
 */
import "dotenv/config";
import { findUserByEmail } from "../src/lib/db/repositories/users";
import { verifyPassword } from "../src/lib/auth/password";
import { getStudentProfileByUserId } from "../src/lib/db/repositories/students";
import { getStudentDashboardData } from "../src/lib/db/repositories/dashboard";
import { listAssignedStudents, listPendingSubmissionsForTeacher, getTeacherProfileByUserId } from "../src/lib/db/repositories/teacher";
import { getAdminOverviewStats } from "../src/lib/db/repositories/admin";
import { verifyCertificate } from "../src/lib/db/repositories/certificates";
import { getPool } from "../src/lib/db/client";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

async function main() {
  console.log("1. Login flow (findUserByEmail + verifyPassword)...");
  const user = await findUserByEmail("adekunle.student@tlmi.academy");
  assert(user, "seeded student user should exist");
  assert(user.role === "STUDENT", "role should be STUDENT");
  const passwordOk = await verifyPassword("Password123", user.passwordHash);
  assert(passwordOk, "correct password should verify");
  const wrongPasswordOk = await verifyPassword("wrong-password", user.passwordHash);
  assert(!wrongPasswordOk, "incorrect password must NOT verify");
  console.log("   ✓ user found, correct password verifies, wrong password rejected");

  console.log("2. Student dashboard data (same function the /dashboard page calls)...");
  const studentProfile = await getStudentProfileByUserId(user.id);
  assert(studentProfile, "student profile should exist");
  const dashboard = await getStudentDashboardData(studentProfile.id);
  assert(dashboard.activeEnrollment?.courseTitle === "Beginner Guitar Fundamentals", "active enrollment should be the seeded course");
  assert(dashboard.activeEnrollment.progressPercent === 43, "progress percent should match seed");
  assert(dashboard.practiceStreak === 6, "practice streak should match seed");
  assert(dashboard.recentFeedback.length > 0, "should have at least one piece of feedback");
  assert(dashboard.upcomingClass !== null, "should have an upcoming class");
  console.log(`   ✓ active course: "${dashboard.activeEnrollment.courseTitle}" at ${dashboard.activeEnrollment.progressPercent}%`);
  console.log(`   ✓ practice streak: ${dashboard.practiceStreak} days`);
  console.log(`   ✓ upcoming class: "${dashboard.upcomingClass?.title}"`);
  console.log(`   ✓ recent feedback: ${dashboard.recentFeedback.length} item(s), decision="${dashboard.recentFeedback[0].decision}"`);

  console.log("3. Teacher RBAC scoping (should only see own students/submissions)...");
  const teacherUser = await findUserByEmail("emeka.teacher@tlmi.academy");
  assert(teacherUser, "seeded teacher should exist");
  const teacherProfile = await getTeacherProfileByUserId(teacherUser.id);
  assert(teacherProfile, "teacher profile should exist");
  const assignedStudents = await listAssignedStudents(teacherProfile.id);
  const pendingSubmissions = await listPendingSubmissionsForTeacher(teacherProfile.id);
  assert(assignedStudents.length === 2, "this teacher should have exactly 2 assigned students per seed");
  assert(pendingSubmissions.length >= 1, "should see the pending review from seed");
  console.log(`   ✓ teacher sees ${assignedStudents.length} assigned students (not the full roster)`);
  console.log(`   ✓ teacher sees ${pendingSubmissions.length} pending submission(s) tied to their own assignments`);

  const otherTeacherUser = await findUserByEmail("grace.teacher@tlmi.academy");
  const otherTeacherProfile = await getTeacherProfileByUserId(otherTeacherUser!.id);
  const otherAssigned = await listAssignedStudents(otherTeacherProfile!.id);
  assert(otherAssigned.length === 0, "the other teacher should see zero assigned students (authorization boundary holds)");
  console.log("   ✓ a different teacher sees 0 students — cross-teacher data leak did not occur");

  console.log("4. Admin overview stats (real aggregate SQL, not fixtures)...");
  const stats = await getAdminOverviewStats();
  assert(stats.totalStudents === 3, "should count all 3 seeded students");
  assert(stats.totalTeachers === 2, "should count both seeded teachers");
  assert(stats.totalRevenueMinor === 1500000, "should sum the one successful seeded payment");
  console.log(`   ✓ totalStudents=${stats.totalStudents} totalTeachers=${stats.totalTeachers} revenue=${stats.totalRevenueMinor / 100} NGN`);

  console.log("5. Public certificate verification (no private data exposed)...");
  const cert = await verifyCertificate("TLMI-GTR-000184");
  assert(cert, "seeded certificate should verify");
  assert(cert.studentDisplayName.includes("."), "should show a privacy-preserving display name, e.g. 'Chioma E.'");
  assert(!("email" in cert), "verification result must not include email or other private fields");
  console.log(`   ✓ certificate verified: ${cert.certificateNumber} — "${cert.studentDisplayName}" — ${cert.courseTitle}`);

  const notFound = await verifyCertificate("TLMI-FAKE-000000");
  assert(notFound === null, "a bogus certificate number must not verify");
  console.log("   ✓ a fabricated certificate number correctly fails verification");

  console.log("\n✅ All core flow assertions passed against the live database.\n");
}

main()
  .catch((err) => {
    console.error("\n❌ VERIFICATION FAILED:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getPool().end();
  });
