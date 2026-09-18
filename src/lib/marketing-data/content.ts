export const firstMonth: string[] = [
'Enroll in Beginner Guitar Fundamentals',
'Practice 15–20 minutes daily with the built-in metronome & tuner',
'Submit your first performance video by week 3',
'Get timestamped feedback from your teacher'];


export interface Instrument {
  name: string;
  status: 'live' | 'next';
}

export const instruments: Instrument[] = [
{ name: 'Guitar', status: 'live' },
{ name: 'Keyboard', status: 'next' },
{ name: 'Bass', status: 'next' },
{ name: 'Drums', status: 'next' },
{ name: 'Voice', status: 'next' },
{ name: 'Music theory', status: 'next' }];


export interface CourseLevel {
  level: string;
  title: string;
  detail: string;
  modules: string;
}

export const courseLevels: CourseLevel[] = [
{
  level: 'Beginner',
  title: 'Guitar Fundamentals',
  detail: 'Posture, tuning, open chords, and your first full song.',
  modules: '3 modules'
},
{
  level: 'Intermediate',
  title: 'Rhythm & Chord Craft',
  detail: 'Barre chords, strumming patterns, and playing in time.',
  modules: '5 modules'
},
{
  level: 'Advanced',
  title: 'Lead & Improvisation',
  detail: 'Scales across the fretboard, phrasing, and soloing.',
  modules: 'Many more modules'
}];


export interface Step {
  title: string;
  detail: string;
}

export const steps: Step[] = [
{
  title: 'Register & set your goals',
  detail: 'Tell us your instrument, experience level, and what you want to play.'
},
{
  title: 'Enroll in a structured course',
  detail: 'Beginner to advanced, built around modules and lessons — not random videos.'
},
{
  title: 'Practice with real tools',
  detail: 'Tuner, metronome, fretboard, chord & scale libraries, and backing tracks.'
},
{
  title: 'Submit performances & get feedback',
  detail: 'Upload a video, get timestamped notes from a real teacher, and resubmit.'
},
{
  title: 'Earn your certificate',
  detail: 'Complete the course requirements and receive a verifiable certificate.'
}];


export interface Feature {
  title: string;
  detail: string;
  icon: 'progression' | 'tools' | 'progress' | 'certificate' | 'classes';
}

export const features: Feature[] = [
{
  title: 'Structured progression',
  detail: "Every lesson sits inside a module, course, and level, so you always know what's next.",
  icon: 'progression'
},
{
  title: 'Built-in practice tools',
  detail: 'Tuner, metronome, fretboard visualizer, chord & scale libraries, and backing tracks.',
  icon: 'tools'
},
{
  title: 'Progress you can see',
  detail: 'Practice streaks, completion percentage, and assignment history in one dashboard.',
  icon: 'progress'
},
{
  title: 'Certificates that verify',
  detail: 'Every certificate has a public verification page, so it means something to show someone.',
  icon: 'certificate'
},
{
  title: 'Live & online classes',
  detail: 'Join scheduled studio or online classes alongside your self-paced coursework.',
  icon: 'classes'
}];


export interface Plan {
  name: string;
  price: string;
  cadence?: string;
  summary: string;
  includes: string[];
  cta: string;
  featured?: boolean;
}

export const plans: Plan[] = [
{
  name: 'Single course',
  price: 'From ₦15,000',
  summary: 'One course, yours to keep.',
  includes: ['Lifetime access to the course', 'Assignment feedback', 'Certificate on completion'],
  cta: 'Choose a course'
},
{
  name: 'Monthly tuition',
  price: '₦25,000',
  cadence: '/month',
  summary: 'Everything we publish, while you study.',
  includes: ['All published courses', 'Priority teacher feedback', 'Live class access'],
  cta: 'Start monthly tuition',
  featured: true
},
{
  name: 'Physical + online',
  price: 'Custom',
  summary: 'Hybrid study at our studio.',
  includes: ['In-person classes at our studio', 'Hybrid schedule', 'Dedicated teacher'],
  cta: 'Talk to us'
}];


export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
{
  question: 'Do I need to already know how to play?',
  answer:
  'No. Courses start at complete-beginner level and build up. During onboarding we ask about your experience so your first course fits where you are starting from.'
},
{
  question: 'Will a real teacher actually watch my videos?',
  answer:
  'Yes. Assignments that require a performance video are reviewed by your assigned teacher, who leaves timestamped comments and an overall decision — pass, needs improvement, or resubmit.'
},
{
  question: 'Can I learn on my phone?',
  answer:
  'Yes. The student experience is mobile-first: lessons, practice tools, and assignment submission all work in a phone browser.'
},
{
  question: 'What if I only have a keyboard, not a guitar?',
  answer:
  'Guitar is our starting instrument. Keyboard, bass, drums, voice, and music theory are built into the same platform architecture and are on our roadmap.'
}];