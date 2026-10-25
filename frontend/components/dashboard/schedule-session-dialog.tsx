"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Loader2, Target } from "lucide-react";
import { useBuddies } from "@/hooks/use-buddies";
import { useStudySessionMutations } from "@/hooks/use-study-sessions";
import { toast } from "sonner";

const scheduleSessionSchema = z.object({
  studyBuddyId: z.string().min(1, "Please select a StudyBuddy"),
  title: z.string().min(2, "Session title must be at least 2 characters"),
  date: z.string().min(1, "Please pick a date"),
  startTime: z.string().min(1, "Please pick a start time"),
  durationMinutes: z.number().min(5).max(360),
  targetResourceType: z.enum(["general", "chat", "quiz", "flashcard", "summary"]),
  notes: z.string().optional(),
});

type ScheduleSessionFormValues = z.infer<typeof scheduleSessionSchema>;

interface ScheduleSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBuddyId?: string;
}

const DURATION_PRESETS = [
  { label: "25m (Pomodoro)", value: 25 },
  { label: "45m", value: 45 },
  { label: "60m (1 hr)", value: 60 },
  { label: "90m (1.5 hr)", value: 90 },
  { label: "120m (2 hr)", value: 120 },
];

export function ScheduleSessionDialog({
  open,
  onOpenChange,
  defaultBuddyId,
}: ScheduleSessionDialogProps) {
  const { buddies } = useBuddies();
  const { createSession } = useStudySessionMutations();

  // Helper defaults: today's date and next hour
  const getTodayDateString = () => new Date().toISOString().split("T")[0];
  const getNextHourString = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ScheduleSessionFormValues>({
    resolver: zodResolver(scheduleSessionSchema),
    defaultValues: {
      studyBuddyId: defaultBuddyId || (buddies?.[0]?.id ?? ""),
      title: "",
      date: getTodayDateString(),
      startTime: getNextHourString(),
      durationMinutes: 60,
      targetResourceType: "general",
      notes: "",
    },
  });

  const selectedDuration = watch("durationMinutes");
  const selectedBuddyId = watch("studyBuddyId");

  // Keep buddy id updated if buddies load or default changes
  React.useEffect(() => {
    if (defaultBuddyId) {
      setValue("studyBuddyId", defaultBuddyId);
    } else if (buddies && buddies.length > 0 && !selectedBuddyId) {
      setValue("studyBuddyId", buddies[0].id);
    }
  }, [defaultBuddyId, buddies, setValue, selectedBuddyId]);

  // Suggest a nice title when buddy is selected if title is empty
  React.useEffect(() => {
    if (selectedBuddyId && buddies) {
      const buddy = buddies.find((b: any) => b.id === selectedBuddyId);
      if (buddy) {
        setValue("title", `Deep Focus: ${buddy.name} Review`, { shouldValidate: true });
      }
    }
  }, [selectedBuddyId, buddies, setValue]);

  const onSubmit = async (data: ScheduleSessionFormValues) => {
    try {
      // Calculate start and end ISO dates
      const startIso = new Date(`${data.date}T${data.startTime}:00`).toISOString();
      const endIso = new Date(
        new Date(startIso).getTime() + data.durationMinutes * 60 * 1000
      ).toISOString();

      await createSession.mutateAsync({
        studyBuddyId: data.studyBuddyId,
        title: data.title,
        scheduledStart: startIso,
        scheduledEnd: endIso,
        targetResourceType: data.targetResourceType,
        notes: data.notes || undefined,
      });

      toast.success("Study session scheduled!", {
        description: `Scheduled for ${data.date} at ${data.startTime} (${data.durationMinutes} mins).`,
      });

      onOpenChange(false);
      reset();
    } catch (error: any) {
      console.error("Failed to schedule session:", error);
      toast.error("Could not schedule session", {
        description: error?.message || "Please check your inputs and try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 text-[#105445] flex items-center justify-center mb-2 shadow-sm border border-emerald-100">
            <Calendar className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-center text-slate-900 tracking-tight">
            Schedule Study Session
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-500 font-medium">
            Block out focused deep work time with your AI companion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* 1. Select StudyBuddy */}
          <div className="space-y-1.5">
            <Label htmlFor="studyBuddyId" className="text-xs font-bold text-slate-700">
              Select StudyBuddy
            </Label>
            {buddies && buddies.length > 0 ? (
              <select
                id="studyBuddyId"
                {...register("studyBuddyId")}
                className="w-full h-11 px-3.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#105445] transition-all"
              >
                {buddies.map((buddy: any) => (
                  <option key={buddy.id} value={buddy.id}>
                    {buddy.name} ({buddy.subject || "General"})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                You have no StudyBuddies created yet. Please create a buddy first.
              </div>
            )}
            {errors.studyBuddyId && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.studyBuddyId.message}</p>
            )}
          </div>

          {/* 2. Session Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-bold text-slate-700">
              Session Title / Goal
            </Label>
            <Input
              id="title"
              placeholder="e.g. Concept Sprint: Cellular Respiration"
              className="rounded-xl border-slate-200 text-xs focus:ring-[#105445] h-10"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* 3. Date & Start Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                className="rounded-xl border-slate-200 text-xs focus:ring-[#105445] h-10"
                {...register("date")}
              />
              {errors.date && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Start Time</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                className="rounded-xl border-slate-200 text-xs focus:ring-[#105445] h-10"
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.startTime.message}</p>
              )}
            </div>
          </div>

          {/* 4. Duration Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Target Duration
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {DURATION_PRESETS.map((preset) => {
                const isSelected = selectedDuration === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setValue("durationMinutes", preset.value, { shouldValidate: true })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      isSelected
                        ? "bg-[#105445] text-white border-[#105445] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Target Focus Mode */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>Primary Focus Mode</span>
            </Label>
            <Controller
              control={control}
              name="targetResourceType"
              render={({ field }) => (
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: "general", label: "General" },
                    { id: "chat", label: "Chat" },
                    { id: "quiz", label: "Quiz" },
                    { id: "flashcard", label: "Cards" },
                    { id: "summary", label: "Notes" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => field.onChange(mode.id)}
                      className={`py-1 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                        field.value === mode.id
                          ? "bg-emerald-50 text-[#105445] border-emerald-300 font-bold"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* 6. Notes (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-bold text-slate-700">
              Preparation Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Key concepts to cover or questions to ask your buddy..."
              className="rounded-xl border-slate-200 text-xs focus:ring-[#105445] resize-none h-18"
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={createSession.isPending || !buddies?.length}
              className="w-full h-11 rounded-full bg-[#105445] hover:bg-[#0c4236] text-white text-xs font-bold shadow-md shadow-emerald-900/10"
            >
              {createSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Confirm & Schedule Session"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
