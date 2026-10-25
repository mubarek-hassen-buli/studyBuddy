"use client";

import * as React from "react";
import { Calendar, Play, Clock, Sparkles, Plus, CheckCircle2, ArrowRight } from "lucide-react";
import { useUpcomingSession, useStudySessionMutations } from "@/hooks/use-study-sessions";
import { useStudyTimerStore } from "@/store/study-timer-store";
import { useBuddies } from "@/hooks/use-buddies";
import { useAppStore } from "@/store/app-store";
import { ScheduleSessionDialog } from "./schedule-session-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NextSessionCard() {
  const router = useRouter();
  const { data, isLoading } = useUpcomingSession();
  const { startSession } = useStudySessionMutations();
  const { startTimer, isRunning, activeSessionId } = useStudyTimerStore();
  const { buddies } = useBuddies();
  const { setCreateModalOpen } = useAppStore();

  const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false);

  const session = data?.session;
  const isSessionActive = data?.isActive || (session && isRunning && activeSessionId === session.id);

  // Helper date formatter
  const formatSessionTime = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const now = new Date();

      const isToday =
        start.getDate() === now.getDate() &&
        start.getMonth() === now.getMonth() &&
        start.getFullYear() === now.getFullYear();

      const isTomorrow =
        new Date(now.getTime() + 86400000).getDate() === start.getDate() &&
        start.getMonth() === now.getMonth();

      let dayLabel = "Today";
      if (!isToday) {
        if (isTomorrow) {
          dayLabel = "Tomorrow";
        } else {
          dayLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      }

      const formatTime = (d: Date) =>
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

      const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

      return {
        dayLabel,
        timeRange: `${formatTime(start)} - ${formatTime(end)}`,
        durationText: `${durationMinutes}m`,
      };
    } catch {
      return {
        dayLabel: "Today",
        timeRange: "Scheduled Session",
        durationText: "60m",
      };
    }
  };

  const handleStartSession = async () => {
    if (!session) return;

    try {
      // Mark session as in-progress on the server
      await startSession.mutateAsync(session.id);

      // Start the persistent client study timer
      startTimer({
        sessionId: session.id,
        sessionTitle: session.title,
        buddyId: session.studyBuddyId,
        buddyName: session.studyBuddy?.name,
      });

      toast.success("Study session started!", {
        description: `Deep work mode active for ${session.title}. Time tracker is running.`,
      });

      // Route to study interface
      let modeParam = "chat";
      if (session.targetResourceType === "quiz") modeParam = "quiz";
      else if (session.targetResourceType === "flashcard") modeParam = "flashcards";
      else if (session.targetResourceType === "summary") modeParam = "summarize";

      router.push(`/dashboard/study/${session.studyBuddyId}?mode=${modeParam}`);
    } catch (error) {
      console.error("Failed to start session:", error);
      // Fallback: start client timer anyway so user is not blocked
      startTimer({
        sessionId: session.id,
        sessionTitle: session.title,
        buddyId: session.studyBuddyId,
        buddyName: session.studyBuddy?.name,
      });
      router.push(`/dashboard/study/${session.studyBuddyId}?mode=chat`);
    }
  };

  const handleContinueSession = () => {
    if (!session) return;
    let modeParam = "chat";
    if (session.targetResourceType === "quiz") modeParam = "quiz";
    else if (session.targetResourceType === "flashcard") modeParam = "flashcards";
    else if (session.targetResourceType === "summary") modeParam = "summarize";
    router.push(`/dashboard/study/${session.studyBuddyId}?mode=${modeParam}`);
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between animate-pulse min-h-[220px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-24 bg-slate-100 rounded-lg" />
            <div className="h-5 w-14 bg-slate-100 rounded-full" />
          </div>
          <div className="h-5 w-3/4 bg-slate-100 rounded-lg mb-2" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-lg mb-4" />
          <div className="h-9 w-full bg-slate-50 rounded-xl" />
        </div>
        <div className="h-10 w-full bg-slate-100 rounded-full mt-4" />
      </div>
    );
  }

  // Session Scheduled or Active State
  if (session) {
    const formatted = formatSessionTime(session.scheduledStart, session.scheduledEnd);
    const buddyName = session.studyBuddy?.name || "AI StudyBuddy";
    const buddySubject = session.studyBuddy?.subject || "All Subjects";

    return (
      <>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-[#105445]">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                  Reminders
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isSessionActive ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Now
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#105445] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {formatted.dayLabel}
                  </span>
                )}

                <button
                  onClick={() => setScheduleModalOpen(true)}
                  title="Schedule another session"
                  className="h-6 w-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug mb-1 line-clamp-1">
              {session.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">
              {buddyName} • {buddySubject}
            </p>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatted.timeRange}</span>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-slate-500 border border-slate-200 font-bold">
                {formatted.durationText}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            {isSessionActive ? (
              <button
                onClick={handleContinueSession}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-6 text-xs font-bold shadow-sm hover:shadow transition-all"
              >
                <span>Continue Study Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleStartSession}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#105445] hover:bg-[#0c4236] text-white py-2.5 px-6 text-xs font-bold shadow-sm hover:shadow transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Study Session</span>
              </button>
            )}
          </div>
        </div>

        <ScheduleSessionDialog
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
        />
      </>
    );
  }

  // Empty State (No session scheduled yet)
  return (
    <>
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[220px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                Reminders
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
              No sessions
            </span>
          </div>

          <h4 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug mb-1">
            Plan Your Next Review
          </h4>
          <p className="text-xs text-slate-500 font-medium mb-3">
            Schedule dedicated study appointments to maintain focus and build your daily streak.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ready for your next learning sprint</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100">
          {buddies && buddies.length > 0 ? (
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#105445] hover:bg-[#0c4236] text-white py-2.5 px-6 text-xs font-bold shadow-sm hover:shadow transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Study Session</span>
            </button>
          ) : (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#105445] hover:bg-[#0c4236] text-white py-2.5 px-6 text-xs font-bold shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create StudyBuddy First</span>
            </button>
          )}
        </div>
      </div>

      <ScheduleSessionDialog
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
      />
    </>
  );
}
