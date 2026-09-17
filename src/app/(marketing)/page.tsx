import Link from "next/link";
import { CheckCircle2, Guitar, Piano, Mic2, Drumstick, BookOpenText, Music4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { listActiveInstruments, listPublishedCourses } from "@/lib/db/repositories/courses";
import { formatMoney, formatDuration } from "@/lib/utils/format";

const instrumentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  guitar: Guitar,
  keyboard: Piano,
  bass: Music4,
  drums: Drumstick,
  voice: Mic2,
  theory: BookOpenText,
};

const steps = [
  {
    title: "Register & set your goals",
    description: "Tell us your instrument, experience level, and what you want to play.",
  },
  {
    title: "Enroll in a structured course",
    description: "Beginner to advanced, built around modules and lessons — not random videos.",
  },
  {
    title: "Practice with real tools",
    description: "Tuner, metronome, fretboard, chord & scale libraries, and backing tracks.",
  },
  {
    title: "Submit performances & get feedback",
    description: "Upload a video, get timestamped notes from a real teacher, and resubmit.",
  },
  {
    title: "Earn your certificate",
    description: "Complete the course requirements and receive a verifiable certificate.",
  },
];

const faqs = [
  {
    q: "Do I need to already know how to play?",
    a: "No. Courses start at complete-beginner level and build up. During onboarding we ask about your experience so your first course fits where you're starting from.",
  },
  {
    q: "Will a real teacher actually watch my videos?",
    a: "Yes. Assignments that require a performance video are reviewed by your assigned teacher, who leaves timestamped comments and an overall decision — pass, needs improvement, or resubmit.",
  },
  {
    q: "Can I learn on my phone?",
    a: "Yes, the student experience is mobile-first: lessons, practice tools, and assignment submission all work on a phone browser.",
  },
  {
    q: "What if I only have a keyboard, not a guitar?",
    a: "Guitar is our starting instrument; keyboard, bass, drums, voice, and music theory are built into the same platform architecture and are on our roadmap.",
  },
];

export default async function LandingPage() {
  const [instruments, courses] = await Promise.all([
    listActiveInstruments(),
    listPublishedCourses(6),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="surface-spotlight border-b border-ink-100">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div>
            <Badge variant="gold">Now enrolling — Guitar</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
              Learn Music. Build Skill. Find Your Sound.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink-600">
              A premium digital music academy: structured courses, real teacher feedback on your
              performances, practice tools, and certificates that mean something.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href="/register">Start Learning</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
          <div className="surface-card p-6">
            <p className="text-sm font-medium text-ink-500">What a first month looks like</p>
            <ul className="mt-4 space-y-3">
              {[
                "Enroll in Beginner Guitar Fundamentals",
                "Practice 15–20 minutes daily with the built-in metronome & tuner",
                "Submit your first performance video by week 3",
                "Get timestamped feedback from your teacher",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Instruments */}
      <section id="instruments" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink-900">One academy, every instrument</h2>
        <p className="mt-2 max-w-2xl text-ink-500">
          Guitar is where we start. The platform is built so keyboard, bass, drums, voice, and
          music theory slot in without a rebuild.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {instruments.map((instrument) => {
            const Icon = instrumentIcons[instrument.slug] ?? Music4;
            const isLive = instrument.slug === "guitar";
            return (
              <div
                key={instrument.id}
                className="surface-card flex flex-col items-center gap-2 px-4 py-6 text-center"
              >
                <Icon className="size-6 text-gold-600" />
                <p className="text-sm font-medium text-ink-800">{instrument.name}</p>
                <Badge variant={isLive ? "success" : "neutral"} className="text-[10px]">
                  {isLive ? "Available now" : "Coming soon"}
                </Badge>
              </div>
            );
          })}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="border-t border-ink-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink-900">Guitar courses</h2>
              <p className="mt-2 text-ink-500">Structured, level-based, and taught by real instructors.</p>
            </div>
            <Button asChild variant="link" className="hidden sm:inline-flex">
              <Link href="/courses">View all courses →</Link>
            </Button>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="Courses launching soon"
              description="Our first Guitar courses are being finalized by our instructors — check back shortly, or register now to be notified the moment enrollment opens."
              action={
                <Button asChild variant="gold" size="sm">
                  <Link href="/register">Notify me</Link>
                </Button>
              }
            />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="gold">{course.level}</Badge>
                      <span className="text-sm font-semibold text-ink-900">
                        {formatMoney(course.priceMinor, course.currency)}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{course.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-500">{course.description}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-ink-400">
                      <span>{course.moduleCount} modules</span>
                      <span>{course.lessonCount} lessons</span>
                      <span>{formatDuration(course.durationMinutes)}</span>
                    </div>
                    {course.instructorName && (
                      <p className="mt-3 text-xs text-ink-500">Taught by {course.instructorName}</p>
                    )}
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                      <Link href={`/courses/${course.slug}`}>View course</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink-900">How TLMI works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-5">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex size-8 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-gold-300">
                {i + 1}
              </div>
              <p className="mt-3 text-sm font-semibold text-ink-900">{step.title}</p>
              <p className="mt-1 text-sm text-ink-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why TLMI */}
      <section className="border-y border-ink-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Why TLMI, not just YouTube</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Real teacher feedback",
                body: "Submit a performance video and get timestamped, specific notes — not just view counts.",
              },
              {
                title: "Structured progression",
                body: "Every lesson sits inside a module, course, and level, so you always know what's next.",
              },
              {
                title: "Built-in practice tools",
                body: "Tuner, metronome, fretboard visualizer, chord & scale libraries, and backing tracks — no extra apps.",
              },
              {
                title: "Progress you can see",
                body: "Practice streaks, completion percentage, and assignment history, all in one dashboard.",
              },
              {
                title: "Certificates that verify",
                body: "Every certificate has a public verification page, so it means something to show someone.",
              },
              {
                title: "Live & online classes",
                body: "Join scheduled physical or online classes alongside your self-paced coursework.",
              },
            ].map((item) => (
              <div key={item.title} className="surface-card p-5">
                <p className="font-semibold text-ink-900">{item.title}</p>
                <p className="mt-1.5 text-sm text-ink-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink-900">Simple pricing</h2>
        <p className="mt-2 text-ink-500">Pay per course, or ask about monthly tuition plans.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <PricingCard
            title="Single course"
            price="From ₦15,000"
            features={["Lifetime access to the course", "Assignment feedback", "Certificate on completion"]}
          />
          <PricingCard
            title="Monthly tuition"
            price="₦25,000/mo"
            featured
            features={["All published courses", "Priority teacher feedback", "Live class access"]}
          />
          <PricingCard
            title="Physical + online"
            price="Custom"
            features={["In-person classes at our studio", "Hybrid schedule", "Dedicated teacher"]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-ink-100 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-ink-100">
            {faqs.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-ink-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="surface-spotlight">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink-900">Ready to find your sound?</h2>
          <p className="mt-3 text-ink-600">Join TLMI and start your first lesson today.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/register">Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingCard({
  title,
  price,
  features,
  featured,
}: {
  title: string;
  price: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "border-2 border-gold-400" : undefined}>
      <CardContent className="p-6">
        {featured && (
          <Badge variant="gold" className="mb-3">
            Most popular
          </Badge>
        )}
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{price}</p>
        <ul className="mt-4 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-600">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-500" />
              {f}
            </li>
          ))}
        </ul>
        <Button asChild variant={featured ? "gold" : "outline"} className="mt-6 w-full">
          <Link href="/register">Get started</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
