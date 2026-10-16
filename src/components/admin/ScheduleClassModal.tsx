"use client";

import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { FieldError } from "@/components/shared/field-error";
import { scheduleClassAction, getTeachersForDropdown, getCoursesForDropdown } from "@/features/admin/actions";

interface ScheduleClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleClassModal({ open, onOpenChange }: ScheduleClassModalProps) {
  const [state, formAction, isPending] = useActionState(scheduleClassAction, {});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [teachers, setTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      setSuccessMessage(null);
      setIsLoadingData(true);
      Promise.all([
        getTeachersForDropdown().catch(() => []),
        getCoursesForDropdown().catch(() => []),
      ]).then(([t, c]) => {
        setTeachers(t);
        setCourses(c);
        setIsLoadingData(false);
      });
    }
  }, [open]);

  useEffect(() => {
    if (state.success && state.message) {
      setSuccessMessage(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Class</DialogTitle>
        </DialogHeader>

        {successMessage ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-ink">Success</h3>
            <p className="text-[13px] text-ink-soft mb-6">{successMessage}</p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4 pt-4">
            {state.error && <Alert variant="danger">{state.error}</Alert>}

            <div className="space-y-2">
              <Label htmlFor="title">Class Title</Label>
              <Input id="title" name="title" required placeholder="e.g. Beginner Guitar Group" />
              <FieldError messages={state.fieldErrors?.title} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacherId">Teacher</Label>
                <select 
                  id="teacherId" 
                  name="teacherId" 
                  required 
                  className="flex h-9 w-full rounded-md border border-line bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoadingData}
                >
                  <option value="">Select teacher...</option>
                  {teachers.map(t => (
                    <option key={t.teacherId} value={t.teacherId}>{t.firstName} {t.lastName}</option>
                  ))}
                </select>
                <FieldError messages={state.fieldErrors?.teacherId} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <select 
                  id="format" 
                  name="format" 
                  required 
                  className="flex h-9 w-full rounded-md border border-line bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="PHYSICAL">Physical</option>
                  <option value="ONLINE">Online</option>
                </select>
                <FieldError messages={state.fieldErrors?.format} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">Course (Optional)</Label>
              <select 
                id="courseId" 
                name="courseId" 
                className="flex h-9 w-full rounded-md border border-line bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingData}
              >
                <option value="">None</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <FieldError messages={state.fieldErrors?.courseId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
              <FieldError messages={state.fieldErrors?.date} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" name="startTime" type="time" required />
                <FieldError messages={state.fieldErrors?.startTime} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" name="endTime" type="time" required />
                <FieldError messages={state.fieldErrors?.endTime} />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isLoadingData}>
                {isPending ? "Scheduling..." : "Schedule Class"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
