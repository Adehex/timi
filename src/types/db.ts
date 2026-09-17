// Hand-maintained types mirroring prisma/schema.prisma. Kept in sync manually
// while the repository layer uses `pg`; once `prisma generate` can run, these
// can be replaced by importing `Prisma.*` types directly from `@prisma/client`.

export type Role = "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN" | "CONTENT_MANAGER";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED" | "PENDING_VERIFICATION";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED" | "PENDING_PAYMENT";
export type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type SubmissionType = "VIDEO" | "AUDIO" | "TEXT" | "FILE";
export type SubmissionStatus =
  | "NOT_STARTED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "PASSED"
  | "NEEDS_IMPROVEMENT"
  | "RESUBMISSION_REQUIRED";
export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED" | "CANCELLED";
export type PaymentProvider = "PAYSTACK" | "FLUTTERWAVE";
export type NotificationType =
  | "NEW_LESSON"
  | "ASSIGNMENT_CREATED"
  | "ASSIGNMENT_DUE"
  | "TEACHER_FEEDBACK"
  | "CLASS_REMINDER"
  | "PAYMENT_REMINDER"
  | "PAYMENT_SUCCESS"
  | "COURSE_COMPLETION"
  | "CERTIFICATE_READY"
  | "ANNOUNCEMENT";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: AccountStatus;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  timezone: string;
  avatarAssetId: string | null;
  bio: string | null;
}

export interface StudentProfile {
  id: string;
  userId: string;
  primaryInstrumentId: string | null;
  experienceLevel: SkillLevel | null;
  learningGoals: string[];
  preferredLearningStyle: string | null;
  onboardingCompletedAt: Date | null;
  currentPracticeStreak: number;
  longestPracticeStreak: number;
  lastPracticeDate: Date | null;
  totalPracticeSeconds: number;
  assignedTeacherId: string | null;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  headline: string | null;
  bio: string | null;
  yearsExperience: number | null;
  specialties: string[];
  isAvailable: boolean;
}

export interface Instrument {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconKey: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  instrumentId: string;
  level: SkillLevel;
  instructorId: string | null;
  durationMinutes: number;
  priceMinor: number;
  currency: string;
  requirements: string[];
  learningObjectives: string[];
  status: ContentStatus;
  publishedAt: Date | null;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  sortOrder: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  summary: string | null;
  textContent: string | null;
  practiceInstructions: string | null;
  durationSeconds: number | null;
  sortOrder: number;
  status: ContentStatus;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt: Date | null;
  progressPercent: number;
}

export interface Assignment {
  id: string;
  lessonId: string | null;
  courseId: string;
  createdById: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: Date | null;
  submissionType: SubmissionType;
  maxAttempts: number;
  status: ContentStatus;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  iconKey: string | null;
  criteria: Record<string, unknown>;
}
