export type AdminTone = "neutral" | "positive" | "warning" | "brass";

export const enrollmentSeries = [
  { month: "Oct", enrollments: 18, revenue: 2140000 },
  { month: "Nov", enrollments: 24, revenue: 2480000 },
  { month: "Dec", enrollments: 15, revenue: 1960000 },
  { month: "Jan", enrollments: 41, revenue: 3620000 },
  { month: "Feb", enrollments: 33, revenue: 3280000 },
  { month: "Mar", enrollments: 29, revenue: 3040000 },
  { month: "Apr", enrollments: 36, revenue: 3540000 },
  { month: "May", enrollments: 44, revenue: 4120000 },
  { month: "Jun", enrollments: 38, revenue: 3860000 },
  { month: "Jul", enrollments: 47, revenue: 4310000 },
  { month: "Aug", enrollments: 52, revenue: 4680000 },
  { month: "Sep", enrollments: 46, revenue: 4240000 },
];

export const attentionItems = [
  { id: "a1", label: "Assignments awaiting review", detail: "Oldest submitted 4 days ago · Piano Grade 3", count: 7, tone: "warning" as const, action: "Review queue" },
  { id: "a2", label: "Overdue tuition", detail: "₦612,000 across 5 students", count: 5, tone: "warning" as const, action: "Send reminders" },
  { id: "a3", label: "Courses in draft", detail: "Vocal Technique II is 90% complete", count: 2, tone: "brass" as const, action: "Finish setup" },
  { id: "a4", label: "Trial students to convert", detail: "Trials ending within 7 days", count: 9, tone: "neutral" as const, action: "View trials" },
];

export const todaySchedule = [
  { id: "s1", time: "08:30", title: "Piano Foundations · Grade 2", teacher: "Mrs. Adeyemi", room: "Studio A", seats: "12 / 12", state: "done" as const },
  { id: "s2", time: "10:00", title: "Ear Training & Solfège", teacher: "Mr. Okonkwo", room: "Studio C", seats: "9 / 14", state: "done" as const },
  { id: "s3", time: "12:15", title: "Guitar Ensemble Rehearsal", teacher: "Mr. Bello", room: "Hall", seats: "18 / 20", state: "live" as const },
  { id: "s4", time: "14:30", title: "Vocal Technique I", teacher: "Ms. Chukwu", room: "Studio B", seats: "11 / 12", state: "upcoming" as const },
  { id: "s5", time: "16:00", title: "Drum Rudiments · Intermediate", teacher: "Mr. Danladi", room: "Booth 2", seats: "6 / 8", state: "upcoming" as const },
];

export const recentRegistrations = [
  { id: "r1", name: "Temi Ogundipe", instrument: "Piano", plan: "Termly · Grade 1", when: "32m ago" },
  { id: "r2", name: "Kelechi Nwosu", instrument: "Saxophone", plan: "Monthly · Beginner", when: "2h ago" },
  { id: "r3", name: "Aisha Bello", instrument: "Voice", plan: "Diploma · Year 1", when: "5h ago" },
  { id: "r4", name: "Daniel Effiong", instrument: "Guitar", plan: "Trial week", when: "Yesterday" },
  { id: "r5", name: "Zainab Yusuf", instrument: "Violin", plan: "Termly · Grade 2", when: "Yesterday" },
];

export const students = [
  { id: "TLMI-0241", name: "Temi Ogundipe", instrument: "Piano", level: "Beginner", teacher: "Mrs. Adeyemi", progress: 18, status: "active", fees: "paid" },
  { id: "TLMI-0238", name: "Kelechi Nwosu", instrument: "Saxophone", level: "Beginner", teacher: "Mr. Okonkwo", progress: 34, status: "trial", fees: "due" },
  { id: "TLMI-0219", name: "Aisha Bello", instrument: "Voice", level: "Diploma", teacher: "Ms. Chukwu", progress: 62, status: "active", fees: "paid" },
  { id: "TLMI-0207", name: "Daniel Effiong", instrument: "Guitar", level: "Intermediate", teacher: "Mr. Bello", progress: 71, status: "active", fees: "overdue" },
  { id: "TLMI-0193", name: "Zainab Yusuf", instrument: "Violin", level: "Intermediate", teacher: "Mrs. Adeyemi", progress: 55, status: "paused", fees: "due" },
  { id: "TLMI-0181", name: "Chinedu Obi", instrument: "Drums", level: "Advanced", teacher: "Mr. Danladi", progress: 88, status: "active", fees: "paid" },
  { id: "TLMI-0164", name: "Halima Sadiq", instrument: "Piano", level: "Advanced", teacher: "Mrs. Adeyemi", progress: 93, status: "active", fees: "paid" },
  { id: "TLMI-0152", name: "Segun Ajayi", instrument: "Voice", level: "Intermediate", teacher: "Ms. Chukwu", progress: 46, status: "trial", fees: "due" },
  { id: "TLMI-0140", name: "Ngozi Eze", instrument: "Cello", level: "Beginner", teacher: "Mr. Okonkwo", progress: 27, status: "active", fees: "paid" },
  { id: "TLMI-0118", name: "Bola Martins", instrument: "Guitar", level: "Diploma", teacher: "Mr. Bello", progress: 100, status: "alumni", fees: "paid" },
] as const;

export const teachers = [
  { id: "t1", name: "Mrs. Folake Adeyemi", instruments: ["Piano", "Theory"], students: 42, capacity: 48, rating: 4.9, nextClass: "Today · 08:30", since: "2019" },
  { id: "t2", name: "Mr. Emeka Okonkwo", instruments: ["Saxophone", "Ear Training"], students: 28, capacity: 40, rating: 4.7, nextClass: "Today · 10:00", since: "2021" },
  { id: "t3", name: "Mr. Idris Bello", instruments: ["Guitar", "Ensemble"], students: 36, capacity: 36, rating: 4.8, nextClass: "Today · 12:15", since: "2020" },
  { id: "t4", name: "Ms. Amara Chukwu", instruments: ["Voice", "Performance"], students: 31, capacity: 44, rating: 4.6, nextClass: "Today · 14:30", since: "2022" },
  { id: "t5", name: "Mr. Sani Danladi", instruments: ["Drums", "Percussion"], students: 19, capacity: 32, rating: 4.5, nextClass: "Today · 16:00", since: "2023" },
  { id: "t6", name: "Mrs. Grace Uduak", instruments: ["Violin", "Cello"], students: 24, capacity: 36, rating: 4.9, nextClass: "Tomorrow · 09:00", since: "2018" },
];

export const courses = [
  { id: "c1", title: "Piano Foundations", track: "Keys", level: "Beginner", lead: "Mrs. Adeyemi", enrolled: 64, seats: 72, price: 85000, completion: 74, published: true },
  { id: "c2", title: "Ear Training & Solfège", track: "Musicianship", level: "Beginner", lead: "Mr. Okonkwo", enrolled: 51, seats: 60, price: 65000, completion: 68, published: true },
  { id: "c3", title: "Guitar Ensemble", track: "Strings", level: "Intermediate", lead: "Mr. Bello", enrolled: 38, seats: 40, price: 92000, completion: 81, published: true },
  { id: "c4", title: "Vocal Technique II", track: "Voice", level: "Intermediate", lead: "Ms. Chukwu", enrolled: 0, seats: 30, price: 98000, completion: 0, published: false },
  { id: "c5", title: "Drum Rudiments", track: "Percussion", level: "Intermediate", lead: "Mr. Danladi", enrolled: 22, seats: 32, price: 78000, completion: 59, published: true },
  { id: "c6", title: "Performance Diploma", track: "Diploma", level: "Diploma", lead: "Ms. Chukwu", enrolled: 17, seats: 24, price: 340000, completion: 44, published: true },
  { id: "c7", title: "Jazz Improvisation", track: "Musicianship", level: "Advanced", lead: "Mr. Okonkwo", enrolled: 0, seats: 20, price: 120000, completion: 0, published: false },
];

export function initials(name: string): string {
  return name.replace(/^(Mrs\.|Mr\.|Ms\.|Dr\.)\s*/i, "").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}
