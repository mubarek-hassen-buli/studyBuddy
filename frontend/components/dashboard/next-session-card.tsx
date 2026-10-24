"use client";

import * as React from "react";
import { Calendar, Play, Clock, Sparkles } from "lucide-react";
import { useBuddies } from "@/hooks/use-buddies";
import { useAppStore } from "@/store/app-store";
import Link from "next/link";

export function NextSessionCard() {
  const { buddies } = useBuddies();
  const { setCreateModalOpen } = useAppStore();

  const primaryBuddy = buddies && buddies.length > 0 ? buddies[0] : null;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
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
          <span className="text-[11px] font-bold text-[#105445] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Today
          </span>
        </div>

        <h4 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug mb-1">
          {primaryBuddy
            ? `Review Session: ${primaryBuddy.name}`
            : "Adaptive Quiz & Concept Sprint"}
        </h4>
        <p className="text-xs text-slate-500 font-medium mb-3">
          {primaryBuddy?.subject || "Neuroscience & Cognitive Science"}
        </p>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Time: 02.00 pm - 04.00 pm</span>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100">
        {primaryBuddy ? (
          <Link
            href={`/dashboard/buddies/${primaryBuddy.id}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#105445] hover:bg-[#0c4236] text-white py-2.5 px-6 text-xs font-bold shadow-sm hover:shadow transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Study Session</span>
          </Link>
        ) : (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#105445] hover:bg-[#0c4236] text-white py-2.5 px-6 text-xs font-bold shadow-sm hover:shadow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Session Buddy</span>
          </button>
        )}
      </div>
    </div>
  );
}
