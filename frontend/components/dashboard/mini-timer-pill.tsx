"use client";

import * as React from "react";
import { Play, Pause, Check, Loader2, Clock } from "lucide-react";
import { useStudyTimerStore } from "@/store/study-timer-store";
import { useStudySessionMutations } from "@/hooks/use-study-sessions";
import { toast } from "sonner";

export function MiniTimerPill() {
  const {
    seconds,
    isRunning,
    activeSessionId,
    activeSessionTitle,
    activeBuddyId,
    activeBuddyName,
    pauseTimer,
    resumeTimer,
    resetTimer,
    clearSession,
    tick,
  } = useStudyTimerStore();

  const { completeSession, quickLogSession } = useStudySessionMutations();
  const [isLogging, setIsLogging] = React.useState(false);

  // Synchronize wall-clock ticks
  React.useEffect(() => {
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

  if (seconds === 0 && !isRunning) {
    return null;
  }

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRunning) {
      pauseTimer();
      toast.info("Timer paused");
    } else {
      resumeTimer();
      toast.success("Timer resumed");
    }
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (seconds < 10) {
      toast.info("Study session too short (< 10 seconds).");
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

      const mins = Math.max(1, Math.round(seconds / 60));
      toast.success(`🎉 Great job! Logged ${mins} study minute${mins > 1 ? "s" : ""}.`);
      resetTimer();
      clearSession();
    } catch (err: any) {
      toast.error("Failed to save session", { description: err?.message });
    } finally {
      setIsLogging(false);
    }
  };

  const focusLabel = activeSessionTitle || activeBuddyName || "Study Session";

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 shadow-2xs backdrop-blur-sm transition-all animate-in fade-in">
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            isRunning ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
          }`}
        />
        <Clock className="w-3.5 h-3.5 text-[#105445] hidden xs:inline" />
        <span className="font-mono text-xs font-black tracking-wider text-[#105445]">
          {formatTime(seconds)}
        </span>
      </div>

      <span className="text-[11px] font-bold text-slate-600 truncate max-w-[100px] sm:max-w-[140px] hidden sm:inline">
        • {focusLabel}
      </span>

      <div className="flex items-center gap-1 ml-1 border-l border-emerald-200 pl-2">
        <button
          onClick={handleToggle}
          title={isRunning ? "Pause" : "Resume"}
          className="h-6 w-6 rounded-full bg-white hover:bg-emerald-100 flex items-center justify-center text-[#105445] transition-colors border border-emerald-200 shadow-2xs"
        >
          {isRunning ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={handleComplete}
          disabled={isLogging}
          title="Finish & Save Study Time"
          className="h-6 px-2 rounded-full bg-[#105445] hover:bg-[#0c4236] flex items-center gap-1 text-white text-[10px] font-bold transition-colors shadow-2xs"
        >
          {isLogging ? (
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
          ) : (
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          )}
          <span className="hidden md:inline">Save</span>
        </button>
      </div>
    </div>
  );
}
