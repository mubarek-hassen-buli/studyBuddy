"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, Clock, Check, Loader2, BookOpen, X } from "lucide-react";
import { useStudyTimerStore } from "@/store/study-timer-store";
import { useStudySessionMutations } from "@/hooks/use-study-sessions";
import { useBuddies } from "@/hooks/use-buddies";
import { toast } from "sonner";

export function StudyTimer() {
  const {
    seconds,
    isRunning,
    activeSessionId,
    activeSessionTitle,
    activeBuddyId,
    activeBuddyName,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    clearSession,
    setSessionDetails,
  } = useStudyTimerStore();

  const { completeSession, quickLogSession } = useStudySessionMutations();
  const { buddies } = useBuddies();
  const [isLogging, setIsLogging] = React.useState(false);

  // Synchronize tick interval with wall clock
  React.useEffect(() => {
    // Initial sync
    tick();

    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleToggle = () => {
    if (isRunning) {
      pauseTimer();
      toast.info("Study session paused.");
    } else {
      if (seconds > 0) {
        resumeTimer();
      } else {
        startTimer();
      }
      toast.success("Focus timer running! Happy studying.");
    }
  };

  const handleReset = () => {
    resetTimer();
    toast.info("Timer reset.");
  };

  const handleCompleteSession = async () => {
    if (seconds < 10) {
      toast.info("Study session too short to record (< 10 seconds).");
      resetTimer();
      return;
    }

    setIsLogging(true);
    try {
      if (activeSessionId) {
        await completeSession.mutateAsync({
          id: activeSessionId,
          actualDurationSeconds: seconds,
        });
      } else {
        await quickLogSession.mutateAsync({
          durationSeconds: seconds,
          studyBuddyId: activeBuddyId || undefined,
          title: activeSessionTitle || (activeBuddyName ? `Deep Work: ${activeBuddyName}` : "Quick Study Session"),
        });
      }

      const minutesLogged = Math.max(1, Math.round(seconds / 60));
      toast.success("🎉 Great work! Study session logged.", {
        description: `Recorded ${minutesLogged} minute${minutesLogged > 1 ? "s" : ""} to your daily learning streak.`,
      });

      resetTimer();
      clearSession();
    } catch (error: any) {
      console.error("Failed to log session:", error);
      toast.error("Could not save session", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsLogging(false);
    }
  };

  const handleBuddySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      clearSession();
      return;
    }
    const found = buddies?.find((b: any) => b.id === selectedId);
    if (found) {
      setSessionDetails({
        buddyId: found.id,
        buddyName: found.name,
      });
      toast.info(`Timer linked to ${found.name}`);
    }
  };

  // Determine status badge
  let statusBadge = {
    label: "READY",
    dotClass: "bg-slate-300",
  };
  if (isRunning) {
    statusBadge = {
      label: "FOCUS ACTIVE",
      dotClass: "bg-emerald-400 animate-pulse",
    };
  } else if (seconds > 0) {
    statusBadge = {
      label: "PAUSED",
      dotClass: "bg-amber-400",
    };
  }

  const activeFocusLabel = activeSessionTitle || activeBuddyName;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07241E] via-[#0D3B31] to-[#105445] p-6 text-white shadow-sm flex flex-col justify-between min-h-[220px]">
      {/* Background ambient lighting pattern */}
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-300" />
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-200">
            Time Tracker
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-100 backdrop-blur-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotClass}`} />
          {statusBadge.label}
        </div>
      </div>

      {/* Buddy / Session Context Tag or Selector */}
      <div className="z-10 mt-2 mb-1">
        {activeFocusLabel ? (
          <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-200 font-medium">
            <BookOpen className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[160px] sm:max-w-[200px]">
              {activeFocusLabel}
            </span>
            <button
              onClick={() => clearSession()}
              className="text-emerald-400 hover:text-white transition-colors ml-0.5"
              title="Clear attached buddy/session"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : buddies && buddies.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <select
              value={activeBuddyId || ""}
              onChange={handleBuddySelect}
              className="bg-emerald-950/40 text-[11px] font-semibold text-emerald-200 border border-emerald-500/20 rounded-full px-2.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all max-w-[200px] truncate"
            >
              <option value="" className="bg-[#07241E] text-slate-300">
                + Link a StudyBuddy
              </option>
              {buddies.map((b: any) => (
                <option key={b.id} value={b.id} className="bg-[#07241E] text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {/* Digital Clock Display */}
      <div className="my-auto py-2 z-10 text-center">
        <div className="font-mono text-4xl sm:text-5xl font-black tracking-wider text-white drop-shadow-md">
          {formatTime(seconds)}
        </div>
        <p className="text-[11px] text-emerald-200/70 font-medium mt-1">
          {isRunning ? "Deep work session in progress" : seconds > 0 ? "Session paused" : "Ready to start focus sprint"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 z-10">
        {/* Play/Pause Button */}
        <button
          onClick={handleToggle}
          className="h-12 w-12 rounded-full bg-white text-[#105445] hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center shadow-lg hover:shadow-xl font-bold"
          title={isRunning ? "Pause Session" : "Start Session"}
        >
          {isRunning ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Complete & Log Session Button (Appears when timer has run) */}
        {seconds > 0 && (
          <button
            onClick={handleCompleteSession}
            disabled={isLogging}
            className="h-10 px-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07241E] font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
            title="Complete & Log Session to Dashboard"
          >
            {isLogging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4 stroke-[3]" />
            )}
            <span>Log Time</span>
          </button>
        )}

        {/* Reset Button */}
        {seconds > 0 && (
          <button
            onClick={handleReset}
            className="h-9 w-9 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white active:scale-95 transition-all flex items-center justify-center shadow-md"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
