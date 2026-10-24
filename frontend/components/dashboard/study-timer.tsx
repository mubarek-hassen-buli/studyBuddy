"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";

export function StudyTimer() {
  const [seconds, setSeconds] = React.useState(5048); // Initialized to ~01:24:08 like Donezo!
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleToggle = () => {
    setIsRunning((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Study session timer started! Focus mode on.");
      } else {
        toast.info("Study session paused.");
      }
      return next;
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    toast.info("Timer reset.");
  };

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
          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          {isRunning ? "FOCUS ACTIVE" : "PAUSED"}
        </div>
      </div>

      {/* Digital Clock Display */}
      <div className="my-auto py-2 z-10 text-center">
        <div className="font-mono text-4xl sm:text-5xl font-black tracking-wider text-white drop-shadow-md">
          {formatTime(seconds)}
        </div>
        <p className="text-[11px] text-emerald-200/70 font-medium mt-1">
          Deep work study session duration
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 z-10">
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

        <button
          onClick={handleReset}
          className="h-10 w-10 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white active:scale-95 transition-all flex items-center justify-center shadow-md"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
