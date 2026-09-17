-- THE LIGHT MUSIC INSTITUTE — Initial schema migration
-- Mirrors prisma/schema.prisma exactly. In any environment where
-- binaries.prisma.sh is reachable, `npx prisma migrate dev` generates and
-- applies this automatically; it is hand-authored here only because this
-- sandbox's network allowlist blocks Prisma's engine-binary CDN.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================= ENUMS =======================================

CREATE TYPE "Role" AS ENUM ('STUDENT','TEACHER','ADMIN','SUPER_ADMIN','CONTENT_MANAGER');
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE','SUSPENDED','DEACTIVATED','PENDING_VERIFICATION');
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER','INTERMEDIATE','ADVANCED');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT','PUBLISHED','ARCHIVED');
CREATE TYPE "LessonContentType" AS ENUM ('VIDEO','AUDIO','TEXT','PDF','IMAGE','CHORD_SHEET','TAB');
CREATE TYPE "LessonProgressStatus" AS ENUM ('NOT_STARTED','IN_PROGRESS','COMPLETED');
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE','COMPLETED','CANCELLED','EXPIRED','PENDING_PAYMENT');
CREATE TYPE "SubmissionType" AS ENUM ('VIDEO','AUDIO','TEXT','FILE');
CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_STARTED','SUBMITTED','UNDER_REVIEW','PASSED','NEEDS_IMPROVEMENT','RESUBMISSION_REQUIRED');
CREATE TYPE "ClassFormat" AS ENUM ('PHYSICAL','ONLINE');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT','ABSENT','LATE','EXCUSED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','SUCCESSFUL','FAILED','REFUNDED','CANCELLED');
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK','FLUTTERWAVE');
CREATE TYPE "PaymentPurpose" AS ENUM ('COURSE_PURCHASE','SUBSCRIPTION','TUITION');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE','PAST_DUE','CANCELLED','EXPIRED');
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY','QUARTERLY','YEARLY');
CREATE TYPE "NotificationType" AS ENUM ('NEW_LESSON','ASSIGNMENT_CREATED','ASSIGNMENT_DUE','TEACHER_FEEDBACK','CLASS_REMINDER','PAYMENT_REMINDER','PAYMENT_SUCCESS','COURSE_COMPLETION','CERTIFICATE_READY','ANNOUNCEMENT');
CREATE TYPE "AnnouncementAudience" AS ENUM ('ALL_STUDENTS','SPECIFIC_COURSE','SPECIFIC_LEVEL','SPECIFIC_TEACHER','SPECIFIC_STUDENT');
CREATE TYPE "StorageAssetType" AS ENUM ('PROFILE_PICTURE','LESSON_VIDEO','LESSON_PDF','COURSE_RESOURCE','ASSIGNMENT_SUBMISSION','FEEDBACK_VIDEO','CERTIFICATE','AUDIO_FILE','BACKING_TRACK','ANNOUNCEMENT_IMAGE');
CREATE TYPE "UploadStatus" AS ENUM ('PENDING','UPLOADED','FAILED','DELETED');

-- ============================= CORE IDENTITY ================================

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'STUDENT',
  "status" "AccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
  "emailVerifiedAt" TIMESTAMP(3),
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_status_idx" ON "users"("status");

CREATE TABLE "storage_assets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" "StorageAssetType" NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 's3',
  "bucket" TEXT NOT NULL,
  "objectKey" TEXT NOT NULL UNIQUE,
  "originalFilename" TEXT,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "status" "UploadStatus" NOT NULL DEFAULT 'PENDING',
  "ownerId" UUID NOT NULL REFERENCES "users"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "storage_assets_ownerId_idx" ON "storage_assets"("ownerId");
CREATE INDEX "storage_assets_type_idx" ON "storage_assets"("type");

CREATE TABLE "profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "displayName" TEXT,
  "phone" TEXT,
  "dateOfBirth" TIMESTAMP(3),
  "gender" TEXT,
  "country" TEXT,
  "city" TEXT,
  "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos',
  "avatarAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "bio" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "sessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

CREATE TABLE "verification_tokens" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "verification_tokens_userId_idx" ON "verification_tokens"("userId");

CREATE TABLE "password_reset_tokens" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- ============================= CURRICULUM ==================================

CREATE TABLE "instruments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "iconKey" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "payment_plans" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "amountMinor" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "billingInterval" "BillingInterval" NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "achievements" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "iconKey" TEXT,
  "criteria" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "teacher_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "headline" TEXT,
  "bio" TEXT,
  "yearsExperience" INTEGER,
  "specialties" TEXT[] NOT NULL DEFAULT '{}',
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "teacher_availability" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "teacherId" UUID NOT NULL REFERENCES "teacher_profiles"("id") ON DELETE CASCADE,
  "dayOfWeek" INTEGER NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "teacher_availability_teacherId_idx" ON "teacher_availability"("teacherId");

CREATE TABLE "teacher_instruments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "teacherId" UUID NOT NULL REFERENCES "teacher_profiles"("id") ON DELETE CASCADE,
  "instrumentId" UUID NOT NULL REFERENCES "instruments"("id") ON DELETE CASCADE,
  UNIQUE ("teacherId","instrumentId")
);

CREATE TABLE "student_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "primaryInstrumentId" UUID REFERENCES "instruments"("id"),
  "experienceLevel" "SkillLevel",
  "learningGoals" TEXT[] NOT NULL DEFAULT '{}',
  "preferredLearningStyle" TEXT,
  "onboardingCompletedAt" TIMESTAMP(3),
  "currentPracticeStreak" INTEGER NOT NULL DEFAULT 0,
  "longestPracticeStreak" INTEGER NOT NULL DEFAULT 0,
  "lastPracticeDate" TIMESTAMP(3),
  "totalPracticeSeconds" INTEGER NOT NULL DEFAULT 0,
  "assignedTeacherId" UUID REFERENCES "teacher_profiles"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "student_profiles_assignedTeacherId_idx" ON "student_profiles"("assignedTeacherId");

CREATE TABLE "courses" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "thumbnailAssetId" UUID REFERENCES "storage_assets"("id"),
  "instrumentId" UUID NOT NULL REFERENCES "instruments"("id"),
  "level" "SkillLevel" NOT NULL,
  "instructorId" UUID REFERENCES "teacher_profiles"("id"),
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "priceMinor" INTEGER NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "requirements" TEXT[] NOT NULL DEFAULT '{}',
  "learningObjectives" TEXT[] NOT NULL DEFAULT '{}',
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdById" UUID REFERENCES "users"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "courses_instrumentId_level_status_idx" ON "courses"("instrumentId","level","status");

CREATE TABLE "course_modules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "courseId" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "course_modules_courseId_sortOrder_idx" ON "course_modules"("courseId","sortOrder");

CREATE TABLE "lessons" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "moduleId" UUID NOT NULL REFERENCES "course_modules"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "textContent" TEXT,
  "practiceInstructions" TEXT,
  "teacherNotes" TEXT,
  "videoAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "audioAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "durationSeconds" INTEGER,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "lessons_moduleId_sortOrder_idx" ON "lessons"("moduleId","sortOrder");

CREATE TABLE "lesson_resources" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lessonId" UUID NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "type" "LessonContentType" NOT NULL,
  "assetId" UUID NOT NULL UNIQUE REFERENCES "storage_assets"("id"),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "lesson_resources_lessonId_idx" ON "lesson_resources"("lessonId");

-- ============================= PAYMENTS ====================================

CREATE TABLE "subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id"),
  "planId" UUID NOT NULL REFERENCES "payment_plans"("id"),
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "provider" "PaymentProvider" NOT NULL,
  "providerSubscriptionId" TEXT UNIQUE,
  "startDate" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "nextBillingDate" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "subscriptions_studentId_status_idx" ON "subscriptions"("studentId","status");

CREATE TABLE "payments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id"),
  "purpose" "PaymentPurpose" NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "providerReference" TEXT NOT NULL UNIQUE,
  "idempotencyKey" TEXT NOT NULL UNIQUE,
  "amountMinor" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "metadata" JSONB,
  "verifiedAt" TIMESTAMP(3),
  "subscriptionId" UUID REFERENCES "subscriptions"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "payments_studentId_status_idx" ON "payments"("studentId","status");

CREATE TABLE "enrollments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id") ON DELETE CASCADE,
  "courseId" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "completedAt" TIMESTAMP(3),
  "progressPercent" INTEGER NOT NULL DEFAULT 0,
  "paymentId" UUID UNIQUE REFERENCES "payments"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  UNIQUE ("studentId","courseId")
);
CREATE INDEX "enrollments_courseId_status_idx" ON "enrollments"("courseId","status");

-- ============================= PROGRESS & ASSESSMENT =======================

CREATE TABLE "lesson_progress" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id") ON DELETE CASCADE,
  "lessonId" UUID NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
  "status" "LessonProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "watchPercent" INTEGER NOT NULL DEFAULT 0,
  "lastPositionSeconds" INTEGER NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  UNIQUE ("studentId","lessonId")
);
CREATE INDEX "lesson_progress_lessonId_idx" ON "lesson_progress"("lessonId");

CREATE TABLE "assignments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lessonId" UUID REFERENCES "lessons"("id"),
  "courseId" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "createdById" UUID NOT NULL REFERENCES "teacher_profiles"("id"),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "instructions" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3),
  "submissionType" "SubmissionType" NOT NULL,
  "maxAttempts" INTEGER NOT NULL DEFAULT 1,
  "gradingCriteria" TEXT,
  "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "assignments_courseId_idx" ON "assignments"("courseId");
CREATE INDEX "assignments_lessonId_idx" ON "assignments"("lessonId");

CREATE TABLE "assignment_submissions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "assignmentId" UUID NOT NULL REFERENCES "assignments"("id") ON DELETE CASCADE,
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id") ON DELETE CASCADE,
  "attemptNumber" INTEGER NOT NULL DEFAULT 1,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "textResponse" TEXT,
  "assetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "score" INTEGER,
  "submittedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "assignment_submissions_assignmentId_studentId_idx" ON "assignment_submissions"("assignmentId","studentId");

CREATE TABLE "feedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "submissionId" UUID NOT NULL REFERENCES "assignment_submissions"("id") ON DELETE CASCADE,
  "teacherId" UUID NOT NULL REFERENCES "teacher_profiles"("id"),
  "writtenFeedback" TEXT,
  "feedbackVideoAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "score" INTEGER,
  "decision" "SubmissionStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "feedback_submissionId_idx" ON "feedback"("submissionId");

CREATE TABLE "feedback_comments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "feedbackId" UUID NOT NULL REFERENCES "feedback"("id") ON DELETE CASCADE,
  "timestampSeconds" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "feedback_comments_feedbackId_idx" ON "feedback_comments"("feedbackId");

-- ============================= PRACTICE & TOOLS ============================

CREATE TABLE "practice_exercises" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "instrumentId" UUID NOT NULL REFERENCES "instruments"("id"),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "difficulty" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "practice_exercises_instrumentId_idx" ON "practice_exercises"("instrumentId");

CREATE TABLE "practice_sessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id") ON DELETE CASCADE,
  "exerciseId" UUID REFERENCES "practice_exercises"("id"),
  "courseId" UUID,
  "toolUsed" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL,
  "endedAt" TIMESTAMP(3) NOT NULL,
  "durationSeconds" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "practice_sessions_studentId_startedAt_idx" ON "practice_sessions"("studentId","startedAt");

CREATE TABLE "tuning_presets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "instrumentId" UUID NOT NULL REFERENCES "instruments"("id"),
  "name" TEXT NOT NULL,
  "notes" TEXT[] NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("instrumentId","name")
);

CREATE TABLE "chord_shapes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "instrumentId" UUID NOT NULL REFERENCES "instruments"("id"),
  "rootNote" TEXT NOT NULL,
  "quality" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "positions" JSONB NOT NULL,
  "notes" TEXT[] NOT NULL,
  "audioAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  UNIQUE ("instrumentId","rootNote","quality")
);
CREATE INDEX "chord_shapes_instrumentId_idx" ON "chord_shapes"("instrumentId");

CREATE TABLE "scale_definitions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "instrumentId" UUID NOT NULL REFERENCES "instruments"("id"),
  "name" TEXT NOT NULL,
  "formula" TEXT NOT NULL,
  "description" TEXT,
  "practicePattern" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  UNIQUE ("instrumentId","name")
);

-- ============================= SONGS =======================================

CREATE TABLE "songs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "instrumentId" UUID NOT NULL REFERENCES "instruments"("id"),
  "title" TEXT NOT NULL,
  "artist" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "difficulty" "SkillLevel" NOT NULL,
  "musicalKey" TEXT NOT NULL,
  "bpm" INTEGER,
  "strummingPattern" TEXT,
  "guitarPart" TEXT,
  "numberSystem" TEXT,
  "tutorialAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "songs_instrumentId_genre_difficulty_idx" ON "songs"("instrumentId","genre","difficulty");

CREATE TABLE "song_chords" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "songId" UUID NOT NULL REFERENCES "songs"("id") ON DELETE CASCADE,
  "chordId" UUID NOT NULL REFERENCES "chord_shapes"("id"),
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX "song_chords_songId_idx" ON "song_chords"("songId");

CREATE TABLE "backing_tracks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "songId" UUID NOT NULL REFERENCES "songs"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "bpm" INTEGER,
  "assetId" UUID NOT NULL UNIQUE REFERENCES "storage_assets"("id"),
  "sections" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- ============================= SCHEDULING ==================================

CREATE TABLE "classes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "courseId" UUID REFERENCES "courses"("id"),
  "teacherId" UUID NOT NULL REFERENCES "teacher_profiles"("id"),
  "format" "ClassFormat" NOT NULL,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "location" TEXT,
  "meetingLink" TEXT,
  "capacity" INTEGER NOT NULL DEFAULT 10,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "classes_teacherId_startTime_idx" ON "classes"("teacherId","startTime");

CREATE TABLE "class_enrollments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "classId" UUID NOT NULL REFERENCES "classes"("id") ON DELETE CASCADE,
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  UNIQUE ("classId","studentId")
);

CREATE TABLE "attendance" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "classId" UUID NOT NULL REFERENCES "classes"("id") ON DELETE CASCADE,
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id") ON DELETE CASCADE,
  "status" "AttendanceStatus" NOT NULL,
  "markedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  UNIQUE ("classId","studentId")
);

-- ============================= RECEIPTS / GAMIFICATION =====================

CREATE TABLE "receipts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "paymentId" UUID NOT NULL UNIQUE REFERENCES "payments"("id"),
  "receiptNumber" TEXT NOT NULL UNIQUE,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "pdfAssetId" UUID UNIQUE REFERENCES "storage_assets"("id")
);

CREATE TABLE "student_achievements" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id") ON DELETE CASCADE,
  "achievementId" UUID NOT NULL REFERENCES "achievements"("id"),
  "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  UNIQUE ("studentId","achievementId")
);

CREATE TABLE "certificates" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "certificateNumber" TEXT NOT NULL UNIQUE,
  "studentId" UUID NOT NULL REFERENCES "student_profiles"("id"),
  "courseId" UUID NOT NULL REFERENCES "courses"("id"),
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "pdfAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "verificationCode" TEXT NOT NULL UNIQUE
);
CREATE INDEX "certificates_studentId_idx" ON "certificates"("studentId");

-- ============================= NOTIFICATIONS / ANNOUNCEMENTS ===============

CREATE TABLE "notifications" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "link" TEXT,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "notifications_userId_readAt_idx" ON "notifications"("userId","readAt");

CREATE TABLE "announcements" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageAssetId" UUID UNIQUE REFERENCES "storage_assets"("id"),
  "audience" "AnnouncementAudience" NOT NULL DEFAULT 'ALL_STUDENTS',
  "courseId" UUID REFERENCES "courses"("id"),
  "targetLevel" "SkillLevel",
  "targetTeacherId" UUID,
  "targetStudentId" UUID,
  "publishAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "expiresAt" TIMESTAMP(3),
  "createdById" UUID NOT NULL REFERENCES "users"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "announcements_audience_publishAt_idx" ON "announcements"("audience","publishAt");

-- ============================= AUDIT LOG ===================================

CREATE TABLE "audit_logs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "actorId" UUID REFERENCES "users"("id"),
  "action" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "audit_logs_actorId_createdAt_idx" ON "audit_logs"("actorId","createdAt");
CREATE INDEX "audit_logs_resourceType_resourceId_idx" ON "audit_logs"("resourceType","resourceId");
