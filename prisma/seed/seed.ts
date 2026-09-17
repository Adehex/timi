/**
 * Seeds the TLMI database with realistic development data: instruments,
 * a full course with modules/lessons, assignments, achievements, songs,
 * a scheduled class, a teacher-student assignment, and enough activity
 * (enrollment, progress, feedback, an announcement) to make every
 * dashboard queried in the app render real, non-empty data.
 *
 * Run with: npx tsx prisma/seed/seed.ts
 */
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Clearing existing data...");
    await client.query(`TRUNCATE TABLE
      "audit_logs","announcements","notifications","certificates","student_achievements",
      "achievements","receipts","payments","subscriptions","payment_plans","attendance",
      "class_enrollments","classes","backing_tracks","song_chords","songs","scale_definitions",
      "chord_shapes","tuning_presets","practice_sessions","practice_exercises","feedback_comments",
      "feedback","assignment_submissions","assignments","lesson_progress","enrollments",
      "lesson_resources","lessons","course_modules","courses","student_profiles",
      "teacher_instruments","teacher_availability","teacher_profiles","password_reset_tokens",
      "verification_tokens","sessions","profiles","storage_assets","users","instruments"
      RESTART IDENTITY CASCADE`);

    console.log("Instruments...");
    const instruments: Record<string, string> = {};
    const instrumentSeed = [
      ["guitar", "Guitar", true, "Six-string acoustic and electric guitar, from first chords to lead technique."],
      ["keyboard", "Keyboard", false, "Piano and keyboard fundamentals — chords, scales, and sight-reading."],
      ["bass", "Bass", false, "Electric bass: groove, technique, and reading bass lines."],
      ["drums", "Drums", false, "Drum kit fundamentals: rudiments, grooves, and fills."],
      ["voice", "Voice", false, "Vocal technique, breath control, and performance."],
      ["theory", "Music Theory", false, "Notation, harmony, and ear training for any instrument."],
    ] as const;
    for (const [i, [slug, name, isActive, description]] of instrumentSeed.entries()) {
      const res = await client.query(
        `INSERT INTO "instruments" ("slug","name","description","isActive","sortOrder")
         VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [slug, name, description, isActive, i]
      );
      instruments[slug] = res.rows[0].id;
    }

    console.log("Users: super admin, admin, teachers, students...");
    async function createUser(
      email: string,
      role: string,
      firstName: string,
      lastName: string,
      password = "Password123"
    ) {
      const passwordHash = await hash(password);
      const res = await client.query(
        `INSERT INTO "users" ("email","passwordHash","role","status","emailVerifiedAt")
         VALUES ($1,$2,$3,'ACTIVE', now()) RETURNING id`,
        [email, passwordHash, role]
      );
      const userId = res.rows[0].id;
      await client.query(
        `INSERT INTO "profiles" ("userId","firstName","lastName") VALUES ($1,$2,$3)`,
        [userId, firstName, lastName]
      );
      return userId;
    }

    const superAdminId = await createUser("super.admin@tlmi.academy", "SUPER_ADMIN", "Adaeze", "Okonkwo");
    const adminId = await createUser("admin@tlmi.academy", "ADMIN", "Bola", "Fashina");
    const teacher1UserId = await createUser("emeka.teacher@tlmi.academy", "TEACHER", "Emeka", "Nwosu");
    const teacher2UserId = await createUser("grace.teacher@tlmi.academy", "TEACHER", "Grace", "Adeyemi");
    const student1UserId = await createUser("adekunle.student@tlmi.academy", "STUDENT", "Adekunle", "Balogun");
    const student2UserId = await createUser("chioma.student@tlmi.academy", "STUDENT", "Chioma", "Eze");
    const student3UserId = await createUser("tobi.student@tlmi.academy", "STUDENT", "Tobi", "Ogundele");
    void superAdminId;
    void adminId;

    const teacher1 = await client.query(
      `INSERT INTO "teacher_profiles" ("userId","headline","bio","yearsExperience","specialties")
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [
        teacher1UserId,
        "Fingerstyle & worship guitar instructor",
        "Emeka has taught guitar for over a decade, focusing on fingerstyle technique and leading worship teams.",
        11,
        ["Fingerstyle", "Worship Guitar", "Acoustic"],
      ]
    );
    const teacher1Id = teacher1.rows[0].id;

    const teacher2 = await client.query(
      `INSERT INTO "teacher_profiles" ("userId","headline","bio","yearsExperience","specialties")
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [
        teacher2UserId,
        "Lead guitar & music theory instructor",
        "Grace specializes in lead guitar technique, improvisation, and practical music theory for guitarists.",
        8,
        ["Lead Guitar", "Music Theory", "Blues"],
      ]
    );
    const teacher2Id = teacher2.rows[0].id;

    await client.query(
      `INSERT INTO "teacher_instruments" ("teacherId","instrumentId") VALUES ($1,$2),($3,$2)`,
      [teacher1Id, instruments.guitar, teacher2Id]
    );

    async function createStudentProfile(userId: string, assignedTeacherId: string | null) {
      const res = await client.query(
        `INSERT INTO "student_profiles" ("userId","assignedTeacherId") VALUES ($1,$2) RETURNING id`,
        [userId, assignedTeacherId]
      );
      return res.rows[0].id as string;
    }

    const student1 = await createStudentProfile(student1UserId, teacher1Id);
    const student2 = await createStudentProfile(student2UserId, teacher1Id);
    const student3 = await createStudentProfile(student3UserId, null); // not yet onboarded

    await client.query(
      `UPDATE "student_profiles" SET
         "primaryInstrumentId" = $1, "experienceLevel" = 'BEGINNER',
         "learningGoals" = $2, "preferredLearningStyle" = 'Visual + hands-on practice',
         "onboardingCompletedAt" = now() - interval '20 days',
         "currentPracticeStreak" = 6, "longestPracticeStreak" = 14,
         "lastPracticeDate" = now() - interval '1 day', "totalPracticeSeconds" = 32400
       WHERE "id" = $3`,
      [instruments.guitar, ["Learn chords", "Play songs", "Worship guitar"], student1]
    );
    await client.query(
      `UPDATE "student_profiles" SET
         "primaryInstrumentId" = $1, "experienceLevel" = 'BEGINNER',
         "learningGoals" = $2, "onboardingCompletedAt" = now() - interval '5 days',
         "currentPracticeStreak" = 2, "longestPracticeStreak" = 2,
         "lastPracticeDate" = now(), "totalPracticeSeconds" = 3600
       WHERE "id" = $3`,
      [instruments.guitar, ["General improvement", "Play songs"], student2]
    );

    console.log("Courses, modules, lessons...");
    const course = await client.query(
      `INSERT INTO "courses"
        ("slug","title","description","instrumentId","level","instructorId","durationMinutes",
         "priceMinor","currency","requirements","learningObjectives","status","publishedAt","createdById")
       VALUES ($1,$2,$3,$4,'BEGINNER',$5,240,0,'NGN',$6,$7,'PUBLISHED', now() - interval '30 days', $8)
       RETURNING id`,
      [
        "beginner-guitar-fundamentals",
        "Beginner Guitar Fundamentals",
        "Start from zero: how to hold the guitar, tune it, play your first chords, and strum your first song — no prior experience needed.",
        instruments.guitar,
        teacher1Id,
        [
          "An acoustic or electric guitar",
          "A guitar tuner (or use the in-app tuner)",
          "15–20 minutes a day for practice",
        ],
        [
          "Tune a guitar by ear and with a tuner",
          "Play open E minor, A minor, C, D, G, and E major chords",
          "Switch cleanly between chords in a 4-chord progression",
          "Strum a basic down-up pattern in time",
        ],
        teacher1UserId,
      ]
    );
    const courseId = course.rows[0].id;

    const course2 = await client.query(
      `INSERT INTO "courses"
        ("slug","title","description","instrumentId","level","instructorId","durationMinutes",
         "priceMinor","currency","requirements","learningObjectives","status","publishedAt","createdById")
       VALUES ($1,$2,$3,$4,'INTERMEDIATE',$5,360,1500000,'NGN',$6,$7,'PUBLISHED', now() - interval '10 days', $8)
       RETURNING id`,
      [
        "intermediate-guitar-lead-technique",
        "Intermediate Guitar: Lead Technique",
        "Move beyond chords into lead playing: the pentatonic scale, bending, hammer-ons, pull-offs, and your first solos.",
        instruments.guitar,
        teacher2Id,
        [
          "Completion of Beginner Guitar Fundamentals (or equivalent)",
          "Comfort with basic open chords",
        ],
        [
          "Play the minor pentatonic scale in two positions",
          "Execute hammer-ons, pull-offs, and string bends cleanly",
          "Improvise a 12-bar blues solo",
        ],
        teacher2UserId,
      ]
    );
    const course2Id = course2.rows[0].id;

    await client.query(
      `INSERT INTO "courses"
        ("slug","title","description","instrumentId","level","instructorId","durationMinutes",
         "priceMinor","currency","requirements","learningObjectives","status","createdById")
       VALUES ($1,$2,$3,$4,'ADVANCED',$5,480,2500000,'NGN',$6,$7,'DRAFT', $8)`,
      [
        "advanced-guitar-improvisation",
        "Advanced Guitar: Improvisation & Modes",
        "Modal improvisation, advanced chord voicings, and building your own solo vocabulary.",
        instruments.guitar,
        teacher2Id,
        ["Completion of Intermediate Guitar: Lead Technique"],
        ["Improvise using all seven modes of the major scale", "Voice extended jazz chords"],
        teacher2UserId,
      ]
    );

    // Modules + lessons for the beginner course
    const modulesSeed = [
      {
        title: "Getting Started",
        lessons: [
          {
            title: "Holding the Guitar & Posture",
            summary: "Correct sitting and standing posture for comfortable, injury-free practice.",
            textContent:
              "Sit with the guitar body resting on your right leg (or left, for left-handed players), neck angled slightly upward. Keep your fretting-hand wrist relaxed and your thumb behind the neck, not wrapped over the top.",
            practiceInstructions: "Practice picking up and holding the guitar in playing position for 2 minutes without playing a note — focus only on comfort and posture.",
            durationSeconds: 420,
          },
          {
            title: "Tuning Your Guitar (E A D G B E)",
            summary: "Standard tuning from the low E string to the high E string, by ear and with a tuner.",
            textContent:
              "Standard tuning, low to high: E2, A2, D3, G3, B3, E4. Use the in-app chromatic tuner (Practice Studio → Tuner) or tune the 5th fret of each string to match the open string above it.",
            practiceInstructions: "Tune your guitar from scratch twice using only the in-app tuner, without looking up the notes first.",
            durationSeconds: 360,
          },
          {
            title: "Your First Chord: E Minor",
            summary: "The easiest open chord on guitar — only two fingers needed.",
            textContent:
              "Place your middle finger on the 2nd fret of the A string and your ring finger on the 2nd fret of the D string. Strum all six strings.",
            practiceInstructions: "Strum E minor 20 times, resetting your fingers off the fretboard between each strum.",
            durationSeconds: 300,
          },
        ],
      },
      {
        title: "Open Chords",
        lessons: [
          {
            title: "A Minor and C Major",
            summary: "Two more essential open chords, and how to switch between them and E minor.",
            textContent:
              "A minor: index on D string 1st fret, middle on G string 2nd fret, ring on B string 2nd fret. C major shares two of those fingers, just shifted.",
            practiceInstructions: "Practice switching E minor → A minor → C major, 10 times each, at a slow, even tempo.",
            durationSeconds: 480,
          },
          {
            title: "G Major and D Major",
            summary: "Two brighter-sounding chords used in hundreds of popular songs.",
            textContent:
              "G major uses three fingers spread across the low E, A, and high E strings. D major is a compact triangle shape on the top three strings.",
            practiceInstructions: "Play the progression G – D – Em – C four times through with a metronome at 60 BPM.",
            durationSeconds: 480,
          },
        ],
      },
      {
        title: "Strumming & Your First Song",
        lessons: [
          {
            title: "Basic Down-Up Strumming Pattern",
            summary: "The foundational strumming pattern used across most beginner songs.",
            textContent:
              "Pattern: Down, Down-Up, Up-Down-Up. Keep your strumming arm moving continuously, even over strings you don't strike.",
            practiceInstructions: "Practice the pattern on a muted E minor chord for 3 minutes with the in-app metronome at 70 BPM.",
            durationSeconds: 420,
          },
          {
            title: "Putting It Together: Your First Full Song",
            summary: "Apply the G – D – Em – C progression and strumming pattern to a complete song.",
            textContent:
              "This lesson combines everything so far: chord changes, timing, and strumming, into one full song performance.",
            practiceInstructions: "Play through the full song three times without stopping, even if you miss a chord change.",
            durationSeconds: 600,
          },
        ],
      },
    ];

    let lessonForAssignment: string | null = null;
    for (const [mi, mod] of modulesSeed.entries()) {
      const modRes = await client.query(
        `INSERT INTO "course_modules" ("courseId","title","sortOrder") VALUES ($1,$2,$3) RETURNING id`,
        [courseId, mod.title, mi]
      );
      const moduleId = modRes.rows[0].id;
      for (const [li, lesson] of mod.lessons.entries()) {
        const lessonRes = await client.query(
          `INSERT INTO "lessons"
            ("moduleId","title","summary","textContent","practiceInstructions","durationSeconds","sortOrder","status")
           VALUES ($1,$2,$3,$4,$5,$6,$7,'PUBLISHED') RETURNING id`,
          [moduleId, lesson.title, lesson.summary, lesson.textContent, lesson.practiceInstructions, lesson.durationSeconds, li]
        );
        lessonForAssignment = lessonRes.rows[0].id;
      }
    }

    console.log("Assignments...");
    const assignment1 = await client.query(
      `INSERT INTO "assignments"
        ("lessonId","courseId","createdById","title","description","instructions","submissionType","maxAttempts","status","dueDate")
       VALUES ($1,$2,$3,$4,$5,$6,'VIDEO',3,'PUBLISHED', now() + interval '7 days') RETURNING id`,
      [
        lessonForAssignment,
        courseId,
        teacher1Id,
        "Record: G – D – Em – C progression",
        "Record yourself playing the G, D, E minor, C progression four times through, in time with a metronome.",
        "Use the in-app metronome at 60 BPM. Film your fretting hand clearly. Keep the recording under 2 minutes.",
      ]
    );
    const assignment1Id = assignment1.rows[0].id;

    await client.query(
      `INSERT INTO "assignments"
        ("courseId","createdById","title","description","instructions","submissionType","maxAttempts","status","dueDate")
       VALUES ($1,$2,$3,$4,$5,'TEXT',1,'PUBLISHED', now() + interval '3 days')`,
      [
        courseId,
        teacher1Id,
        "Practice Log: G Major Scale",
        "Log your practice of the G major scale this week.",
        "Write how many days you practiced, roughly how long each session was, and one thing that felt difficult.",
      ]
    );

    console.log("A submission + teacher feedback (so the dashboard has real feedback to show)...");
    const submission = await client.query(
      `INSERT INTO "assignment_submissions"
        ("assignmentId","studentId","attemptNumber","status","textResponse","submittedAt","reviewedAt")
       VALUES ($1,$2,1,'NEEDS_IMPROVEMENT','Recording attached.', now() - interval '2 days', now() - interval '1 day')
       RETURNING id`,
      [assignment1Id, student1]
    );
    const submissionId = submission.rows[0].id;

    const feedback = await client.query(
      `INSERT INTO "feedback" ("submissionId","teacherId","writtenFeedback","decision")
       VALUES ($1,$2,$3,'NEEDS_IMPROVEMENT') RETURNING id`,
      [
        submissionId,
        teacher1Id,
        "Good timing overall! Your G-to-D transition is clean, but there's a pause before Em each time — practice that one switch in isolation for a few minutes, then try the full recording again.",
      ]
    );
    const feedbackId = feedback.rows[0].id;
    await client.query(
      `INSERT INTO "feedback_comments" ("feedbackId","timestampSeconds","comment") VALUES
        ($1, 4, 'Slight delay switching to E minor here'),
        ($1, 12, 'Nice clean chord change — this is the target speed'),
        ($1, 20, 'Try landing your ring finger first on the C shape')`,
      [feedbackId]
    );

    console.log("A second, still-pending submission (so the teacher review queue isn't empty)...");
    const assignment2 = await client.query<{ id: string }>(
      `SELECT "id" FROM "assignments" WHERE "title" = 'Practice Log: G Major Scale'`
    );
    await client.query(
      `INSERT INTO "assignment_submissions"
        ("assignmentId","studentId","attemptNumber","status","textResponse","submittedAt")
       VALUES ($1,$2,1,'SUBMITTED','Practiced 5 days this week, about 15 minutes each day. The stretch to the 4th finger on the high string is still hard.', now() - interval '3 hours')`,
      [assignment2.rows[0].id, student2]
    );

    console.log("Enrollments...");
    await client.query(
      `INSERT INTO "enrollments" ("studentId","courseId","status","progressPercent","enrolledAt")
       VALUES ($1,$2,'ACTIVE',43,now() - interval '18 days')`,
      [student1, courseId]
    );
    await client.query(
      `INSERT INTO "enrollments" ("studentId","courseId","status","progressPercent","enrolledAt")
       VALUES ($1,$2,'ACTIVE',14,now() - interval '4 days')`,
      [student2, courseId]
    );

    // Mark the first module's lessons complete for student1 to back up the 43% progress figure meaningfully
    const firstModuleLessons = await client.query<{ id: string }>(
      `SELECT l."id" FROM "lessons" l JOIN "course_modules" cm ON cm."id" = l."moduleId"
       WHERE cm."courseId" = $1 ORDER BY cm."sortOrder", l."sortOrder" LIMIT 3`,
      [courseId]
    );
    for (const row of firstModuleLessons.rows) {
      await client.query(
        `INSERT INTO "lesson_progress" ("studentId","lessonId","status","watchPercent","startedAt","completedAt")
         VALUES ($1,$2,'COMPLETED',100, now() - interval '10 days', now() - interval '9 days')`,
        [student1, row.id]
      );
    }

    console.log("Practice sessions...");
    for (let i = 0; i < 6; i++) {
      await client.query(
        `INSERT INTO "practice_sessions" ("studentId","toolUsed","startedAt","endedAt","durationSeconds","notes")
         VALUES ($1,$2, now() - interval '${i} days' - interval '20 minutes', now() - interval '${i} days', 1200, $3)`,
        [student1, i % 2 === 0 ? "metronome" : "free_practice", "Worked on chord transitions"]
      );
    }

    console.log("A scheduled class...");
    const cls = await client.query(
      `INSERT INTO "classes"
        ("title","courseId","teacherId","format","startTime","endTime","meetingLink","capacity")
       VALUES ($1,$2,$3,'ONLINE', now() + interval '2 days', now() + interval '2 days' + interval '45 minutes', $4, 8)
       RETURNING id`,
      [
        "Beginner Guitar — Live Practice Session",
        courseId,
        teacher1Id,
        "https://meet.google.com/tlmi-beginner-guitar",
      ]
    );
    await client.query(`INSERT INTO "class_enrollments" ("classId","studentId") VALUES ($1,$2),($1,$3)`, [
      cls.rows[0].id,
      student1,
      student2,
    ]);

    console.log("Achievements...");
    const achievements = [
      ["FIRST_LESSON", "First Lesson", "Completed your first lesson.", { type: "lessons_completed", threshold: 1 }],
      ["FIRST_ASSIGNMENT", "First Assignment", "Submitted your first assignment.", { type: "assignments_submitted", threshold: 1 }],
      ["PRACTICE_STREAK_7", "7-Day Practice Streak", "Practiced 7 days in a row.", { type: "practice_streak", threshold: 7 }],
      ["PRACTICE_STREAK_30", "30-Day Practice Streak", "Practiced 30 days in a row.", { type: "practice_streak", threshold: 30 }],
      ["BEGINNER_GUITAR_COMPLETE", "Beginner Guitar Completed", "Completed Beginner Guitar Fundamentals.", { type: "course_completed", courseSlug: "beginner-guitar-fundamentals" }],
      ["PRACTICE_SESSIONS_100", "100 Practice Sessions", "Logged 100 practice sessions.", { type: "practice_sessions_count", threshold: 100 }],
    ] as const;
    const achievementIds: Record<string, string> = {};
    for (const [key, title, description, criteria] of achievements) {
      const res = await client.query(
        `INSERT INTO "achievements" ("key","title","description","criteria") VALUES ($1,$2,$3,$4) RETURNING id`,
        [key, title, description, criteria]
      );
      achievementIds[key] = res.rows[0].id;
    }
    await client.query(
      `INSERT INTO "student_achievements" ("studentId","achievementId","earnedAt") VALUES ($1,$2, now() - interval '9 days')`,
      [student1, achievementIds.FIRST_LESSON]
    );

    console.log("Announcement...");
    await client.query(
      `INSERT INTO "announcements" ("title","description","audience","createdById")
       VALUES ($1,$2,'ALL_STUDENTS',$3)`,
      [
        "New: Live weekend practice sessions",
        "Beginner Guitar students can now join a live online practice session every Saturday — see your Schedule tab.",
        adminId,
      ]
    );

    console.log("Payment plan (for future subscriptions)...");
    await client.query(
      `INSERT INTO "payment_plans" ("name","description","amountMinor","currency","billingInterval")
       VALUES ($1,$2,2500000,'NGN','MONTHLY')`,
      ["Monthly Tuition — All Access", "Unlimited access to all published courses and live classes."]
    );

    console.log("A successful payment + receipt + certificate (for the verify page demo)...");
    const payment = await client.query(
      `INSERT INTO "payments"
        ("studentId","purpose","provider","providerReference","idempotencyKey","amountMinor","currency","status","verifiedAt")
       VALUES ($1,'COURSE_PURCHASE','PAYSTACK','PSK_DEMO_REF_00123','idem_demo_00123',1500000,'NGN','SUCCESSFUL', now() - interval '9 days')
       RETURNING id`,
      [student1]
    );
    await client.query(
      `INSERT INTO "receipts" ("paymentId","receiptNumber") VALUES ($1,'TLMI-RCPT-000001')`,
      [payment.rows[0].id]
    );
    await client.query(
      `INSERT INTO "certificates" ("certificateNumber","studentId","courseId","verificationCode")
       VALUES ('TLMI-GTR-000184',$1,$2,'TLMI-GTR-000184')`,
      [student2, courseId]
    );

    console.log("Tuning presets, a few chord shapes and scale definitions...");
    const tunings = [
      ["Standard", ["E2", "A2", "D3", "G3", "B3", "E4"], true],
      ["Drop D", ["D2", "A2", "D3", "G3", "B3", "E4"], false],
      ["DADGAD", ["D2", "A2", "D3", "G3", "A3", "D4"], false],
      ["Open G", ["D2", "G2", "D3", "G3", "B3", "D4"], false],
      ["Open D", ["D2", "A2", "D3", "F#3", "A3", "D4"], false],
      ["Half Step Down", ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"], false],
    ] as const;
    for (const [name, notes, isDefault] of tunings) {
      await client.query(
        `INSERT INTO "tuning_presets" ("instrumentId","name","notes","isDefault") VALUES ($1,$2,$3,$4)`,
        [instruments.guitar, name, notes, isDefault]
      );
    }

    const chords = [
      ["E", "minor", "E Minor", { frets: [0, 2, 2, 0, 0, 0] }, ["E", "B", "E", "G", "B", "E"]],
      ["A", "minor", "A Minor", { frets: [-1, 0, 2, 2, 1, 0] }, ["A", "E", "A", "C", "E"]],
      ["C", "major", "C Major", { frets: [-1, 3, 2, 0, 1, 0] }, ["C", "E", "G", "C", "E"]],
      ["G", "major", "G Major", { frets: [3, 2, 0, 0, 0, 3] }, ["G", "B", "D", "G", "B", "G"]],
      ["D", "major", "D Major", { frets: [-1, -1, 0, 2, 3, 2] }, ["D", "A", "D", "F#"]],
    ] as const;
    const chordIds: Record<string, string> = {};
    for (const [root, quality, displayName, positions, notes] of chords) {
      const res = await client.query(
        `INSERT INTO "chord_shapes" ("instrumentId","rootNote","quality","displayName","positions","notes")
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [instruments.guitar, root, quality, displayName, positions, notes]
      );
      chordIds[`${root}${quality}`] = res.rows[0].id;
    }

    const scales = [
      ["Major", "1-2-3-4-5-6-7", "The foundation of Western harmony."],
      ["Minor Pentatonic", "1-b3-4-5-b7", "The most common scale in rock and blues lead guitar."],
      ["Blues", "1-b3-4-b5-5-b7", "Minor pentatonic plus the 'blue note' for extra tension."],
      ["Major Pentatonic", "1-2-3-5-6", "A bright five-note scale common in country and pop."],
      ["Harmonic Minor", "1-2-b3-4-5-b6-7", "A minor scale with a raised 7th, common in classical and metal."],
      ["Melodic Minor", "1-2-b3-4-5-6-7", "A minor scale with raised 6th and 7th when ascending."],
    ] as const;
    for (const [name, formula, description] of scales) {
      await client.query(
        `INSERT INTO "scale_definitions" ("instrumentId","name","formula","description")
         VALUES ($1,$2,$3,$4)`,
        [instruments.guitar, name, formula, description]
      );
    }

    console.log("Songs...");
    const song1 = await client.query(
      `INSERT INTO "songs"
        ("instrumentId","title","artist","genre","difficulty","musicalKey","bpm","strummingPattern")
       VALUES ($1,$2,$3,'Pop','BEGINNER','G',76,'D DU UDU') RETURNING id`,
      [instruments.guitar, "Wonderwall", "Oasis"]
    );
    await client.query(
      `INSERT INTO "song_chords" ("songId","chordId","sortOrder") VALUES
        ($1,$2,0), ($1,$3,1), ($1,$4,2), ($1,$5,3)`,
      [song1.rows[0].id, chordIds["Gmajor"], chordIds["Dmajor"], chordIds["Eminor"], chordIds["Cmajor"]]
    );

    await client.query(
      `INSERT INTO "songs"
        ("instrumentId","title","artist","genre","difficulty","musicalKey","bpm","strummingPattern")
       VALUES ($1,$2,$3,'Worship','BEGINNER','G',70,'D DU UDU')`,
      [instruments.guitar, "10,000 Reasons", "Matt Redman"]
    );

    await client.query("COMMIT");
    console.log("\n✅ Seed complete.\n");
    console.log("Login credentials (password for all: Password123):");
    console.log("  Super admin:  super.admin@tlmi.academy");
    console.log("  Admin:        admin@tlmi.academy");
    console.log("  Teacher:      emeka.teacher@tlmi.academy");
    console.log("  Teacher:      grace.teacher@tlmi.academy");
    console.log("  Student (onboarded, enrolled):     adekunle.student@tlmi.academy");
    console.log("  Student (onboarded, enrolled):     chioma.student@tlmi.academy");
    console.log("  Student (NOT onboarded yet):       tobi.student@tlmi.academy");
    console.log("\nCertificate verification demo: TLMI-GTR-000184\n");
    void student3;
    void course2Id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
