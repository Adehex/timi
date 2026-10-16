"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarPlus, ChevronRight, Download, UserPlus } from "lucide-react";
import { AdminButton, PageHeader, Panel } from "@/components/admin/admin-ui";
import { attentionItems, enrollmentSeries, recentRegistrations, todaySchedule, initials } from "@/components/admin/admin-data";
import { EnrollStudentModal } from "@/components/admin/EnrollStudentModal";
import { ScheduleClassModal } from "@/components/admin/ScheduleClassModal";
type DashboardStats = {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalCourses: number;
  publishedCourses: number;
  totalRevenueMinor: number;
  pendingAssignments: number;
  upcomingClasses: number;
  newRegistrationsThisWeek: number;
};

function money(amountMinor: number, compact = false) {
  const amount = amountMinor / 100;
  if (compact && amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(2)}m`;
  if (compact && amount >= 1_000) return `₦${Math.round(amount / 1_000)}k`;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

function Delta({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return <span className={`inline-flex items-center gap-1 text-[12px] font-medium tabular ${positive ? "text-moss" : "text-clay"}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{Math.abs(value).toFixed(1)}% <span className="font-normal text-ink-faint">vs last month</span></span>;
}

function HeadlineMetrics({ stats }: { stats: DashboardStats }) {
  const activePercent = stats.totalStudents ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0;
  const headlines = [
    { label: "Active students", value: String(stats.activeStudents), meta: `of ${stats.totalStudents} enrolled · ${Math.max(stats.totalStudents - stats.activeStudents, 0)} paused or alumni`, delta: 6.2 },
    { label: "Revenue all-time", value: money(stats.totalRevenueMinor, true), meta: "Successful payments recorded in the academy", delta: -9.4 },
    { label: "Course completion", value: `${Math.max(0, Math.min(100, activePercent))}%`, meta: `Across ${stats.publishedCourses} published courses`, delta: 3.1 },
  ];
  const secondary = [
    { label: "Teachers", value: stats.totalTeachers },
    { label: "Published courses", value: `${stats.publishedCourses} / ${stats.totalCourses}` },
    { label: "Pending reviews", value: stats.pendingAssignments },
    { label: "Upcoming classes", value: stats.upcomingClasses },
    { label: "New sign-ups (7d)", value: stats.newRegistrationsThisWeek },
  ];
  return <div className="space-y-4"><div className="grid grid-cols-1 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">{headlines.map((item) => <div key={item.label} className="flex min-h-[188px] flex-col p-5 lg:p-6"><p className="text-[12.5px] font-medium text-ink-muted">{item.label}</p><p className="mt-2.5 font-display text-[40px] leading-none tabular text-ink">{item.value}</p><p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">{item.meta}</p><div className="mt-auto pt-4"><Delta value={item.delta} /></div></div>)}</div><dl className="flex flex-wrap items-center gap-x-8 gap-y-3 px-1">{secondary.map((item) => <div key={item.label} className="flex items-baseline gap-2"><dd className="font-display text-[19px] leading-none tabular text-ink">{item.value}</dd><dt className="text-[12.5px] text-ink-muted">{item.label}</dt></div>)}</dl></div>;
}

function EnrollmentChart() {
  return <Panel title="Enrollment & revenue" description="Monthly new enrollments against collected tuition" className="h-full" bodyClassName="px-2 pb-4 pt-5" action={<div className="flex items-center rounded-lg border border-line p-0.5"><button className="rounded-md bg-ink px-2.5 py-1 text-[12px] font-medium text-canvas" type="button">12M</button><button className="rounded-md px-2.5 py-1 text-[12px] font-medium text-ink-muted" type="button">All</button></div>}><div className="mb-3 flex items-center gap-5 px-4"><span className="flex items-center gap-2 text-[12px] text-ink-muted"><span className="h-2.5 w-2.5 rounded-sm bg-ink" /> Enrollments</span><span className="flex items-center gap-2 text-[12px] text-ink-muted"><span className="h-[3px] w-4 rounded-full bg-brass" /> Revenue</span></div><div className="relative h-[268px] px-4 pb-6"><div className="absolute inset-x-4 top-2 bottom-6 flex flex-col justify-between">{[0, 1, 2, 3].map((line) => <span key={line} className="border-t border-line" />)}</div><div className="absolute inset-x-4 bottom-6 top-4 flex items-end justify-between gap-2">{enrollmentSeries.map((point) => <div key={point.month} className="flex h-full flex-1 items-end justify-center"><span className="w-full max-w-[18px] rounded-t bg-ink" style={{ height: `${Math.max(12, (point.enrollments / 55) * 100)}%` }} /></div>)}</div><svg viewBox="0 0 600 220" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-4 bottom-6 top-4 h-[calc(100%-28px)] w-[calc(100%-32px)] overflow-visible"><polyline fill="none" stroke="#A9814F" strokeWidth="2.5" points={enrollmentSeries.map((point, index) => `${(index / (enrollmentSeries.length - 1)) * 600},${220 - (point.revenue / 5000000) * 190}`).join(" ")} /></svg><div className="absolute inset-x-4 bottom-0 flex justify-between text-[11px] text-ink-muted">{enrollmentSeries.map((point) => <span key={point.month}>{point.month}</span>)}</div></div></Panel>;
}

function AttentionQueue() {
  return <Panel title="Needs attention" description="4 open items" className="h-full" bodyClassName="p-0"><ul className="divide-y divide-line">{attentionItems.map((item) => <li key={item.id}><button type="button" className="group flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-canvas"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.tone === "warning" ? "bg-clay" : item.tone === "brass" ? "bg-brass" : "bg-ink-faint"}`} /><span className="min-w-0 flex-1"><span className="flex items-baseline gap-2"><span className="text-[13.5px] font-medium text-ink">{item.label}</span><span className="tabular text-[13.5px] font-semibold text-ink">{item.count}</span></span><span className="mt-0.5 block truncate text-[12.5px] text-ink-muted">{item.detail}</span><span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-brass-deep">{item.action}<ChevronRight className="h-3.5 w-3.5" /></span></span></button></li>)}</ul></Panel>;
}

function ScheduleTimeline() {
  return <Panel title="Today's classes" description="Friday, 11 September · Studio timetable" className="h-full" action={<AdminButton variant="ghost">Full timetable</AdminButton>}><ol className="relative"><span className="absolute bottom-2 left-[52px] top-2 w-px bg-line" />{todaySchedule.map((item) => { const isLive = item.state === "live"; const isDone = item.state === "done"; return <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0"><span className={`w-[44px] shrink-0 pt-0.5 text-right text-[12.5px] tabular ${isDone ? "text-ink-faint" : "text-ink-soft"}`}>{item.time}</span><span className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-surface ${isLive ? "bg-brass" : isDone ? "bg-line-strong" : "bg-ink"}`} /><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className={`text-[13.5px] font-medium ${isDone ? "text-ink-muted" : "text-ink"}`}>{item.title}</span>{isLive && <span className="rounded-full bg-brass-soft px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-brass-deep">In session</span>}</span><span className="mt-0.5 block text-[12.5px] text-ink-muted">{item.teacher} · {item.room} · {item.seats} seats</span></span></li>; })}</ol></Panel>;
}

function RegistrationsList() {
  return <Panel title="Recent registrations" description="18 new students in the last 7 days" className="h-full" bodyClassName="p-0" action={<AdminButton variant="ghost">View all</AdminButton>}><ul className="divide-y divide-line">{recentRegistrations.map((person) => <li key={person.id} className="flex items-center gap-3 px-5 py-3.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-[12px] font-semibold text-ink-soft ring-1 ring-inset ring-line">{initials(person.name)}</span><span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium text-ink">{person.name}</span><span className="block truncate text-[12.5px] text-ink-muted">{person.instrument} · {person.plan}</span></span><span className="shrink-0 text-[12px] text-ink-faint">{person.when}</span></li>)}</ul></Panel>;
}

export function DashboardContent({ stats }: { stats: DashboardStats }) {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  return (
    <>
      <div className="space-y-6">
        <PageHeader eyebrow="Term 1 · 2026/27" title="Academy overview" subtitle="Enrollment health, tuition collected, and everything waiting on you today.">
          <AdminButton icon={<Download className="h-4 w-4" aria-hidden="true" />} onClick={() => window.location.href = '/api/admin/export/students'}>Export</AdminButton>
          <AdminButton icon={<CalendarPlus className="h-4 w-4" aria-hidden="true" />} onClick={() => setIsScheduleModalOpen(true)}>Schedule class</AdminButton>
          <AdminButton variant="primary" icon={<UserPlus className="h-4 w-4" aria-hidden="true" />} onClick={() => setIsEnrollModalOpen(true)}>Enroll student</AdminButton>
        </PageHeader>
        <HeadlineMetrics stats={stats} />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2"><EnrollmentChart /></div>
          <AttentionQueue />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3"><ScheduleTimeline /></div>
          <div className="lg:col-span-2"><RegistrationsList /></div>
        </div>
      </div>
      <EnrollStudentModal open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen} />
      <ScheduleClassModal open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen} />
    </>
  );
}
