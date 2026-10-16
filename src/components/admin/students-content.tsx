"use client";

import { MoreHorizontal, Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminButton, PageHeader, StatusPill } from "@/components/admin/admin-ui";
import { initials, students } from "@/components/admin/admin-data";
import { EnrollStudentModal } from "@/components/admin/EnrollStudentModal";

type Filter = "all" | "active" | "trial" | "paused" | "alumni";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "trial", label: "Trial" },
  { key: "paused", label: "Paused" },
  { key: "alumni", label: "Alumni" },
];

export function StudentsContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const rows = useMemo(() => students.filter((student) => {
    const normalized = query.trim().toLowerCase();
    const matchesFilter = filter === "all" || student.status === filter;
    const matchesQuery = !normalized || student.name.toLowerCase().includes(normalized) || student.instrument.toLowerCase().includes(normalized) || student.id.toLowerCase().includes(normalized);
    return matchesFilter && matchesQuery;
  }), [filter, query]);

  return (
    <>
      <div className="space-y-6">
        <PageHeader eyebrow="248 enrolled · 188 active" title="Students" subtitle="Track progress, tuition standing, and studio assignment for every student.">
          <AdminButton icon={<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}>Filters</AdminButton>
          <AdminButton variant="primary" icon={<UserPlus className="h-4 w-4" aria-hidden="true" />} onClick={() => setIsEnrollModalOpen(true)}>Enroll student</AdminButton>
        </PageHeader>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Student status">
              {filters.map((item) => (
                <button key={item.key} type="button" role="tab" aria-selected={filter === item.key} onClick={() => setFilter(item.key)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${filter === item.key ? "bg-ink text-canvas" : "text-ink-muted hover:bg-canvas hover:text-ink"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <label className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink-faint" aria-hidden="true" />
              <span className="sr-only">Search students</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search by name, ID, instrument" className="h-9 w-[260px] rounded-lg border border-line bg-canvas pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-brass focus:bg-surface focus:outline-none" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Instrument</th>
                  <th className="px-5 py-3 font-medium">Teacher</th>
                  <th className="px-5 py-3 font-medium">Progress</th>
                  <th className="px-5 py-3 font-medium">Tuition</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((student) => (
                  <tr key={student.id} className="hover:bg-canvas">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-canvas text-[12px] font-semibold text-ink-soft ring-1 ring-inset ring-line">{initials(student.name)}</span>
                        <span><span className="block text-[13.5px] font-medium text-ink">{student.name}</span><span className="block text-[12px] tabular text-ink-faint">{student.id}</span></span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="block text-[13px] text-ink">{student.instrument}</span><span className="block text-[12px] text-ink-muted">{student.level}</span></td>
                    <td className="px-5 py-3.5 text-[13px] text-ink-soft">{student.teacher}</td>
                    <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><span className="h-1.5 w-24 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-ink" style={{ width: `${student.progress}%` }} /></span><span className="tabular text-[12.5px] text-ink-soft">{student.progress}%</span></div></td>
                    <td className="px-5 py-3.5"><StatusPill tone={student.fees === "paid" ? "positive" : student.fees === "overdue" ? "warning" : "brass"}>{student.fees}</StatusPill></td>
                    <td className="px-5 py-3.5"><StatusPill tone={student.status === "active" ? "positive" : student.status === "trial" ? "brass" : "neutral"} dot>{student.status}</StatusPill></td>
                    <td className="px-5 py-3.5 text-right"><button type="button" className="rounded-md p-1.5 text-ink-muted hover:bg-line/60 hover:text-ink" aria-label={`Actions for ${student.name}`}><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="font-display text-lg text-ink">No students match that view</p>
              <p className="mt-1 text-[13px] text-ink-muted">Try a different status or clear your search.</p>
            </div>
          ) : (
            <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
              <p className="text-[12.5px] text-ink-muted">Showing <span className="tabular">{rows.length}</span> of <span className="tabular">248</span> students</p>
              <div className="flex items-center gap-2"><AdminButton variant="secondary" disabled className="opacity-50">Previous</AdminButton><AdminButton variant="secondary">Next</AdminButton></div>
            </div>
          )}
        </div>
      </div>
      <EnrollStudentModal open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen} />
    </>
  );
}
