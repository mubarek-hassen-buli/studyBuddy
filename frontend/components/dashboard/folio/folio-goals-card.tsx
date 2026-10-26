"use client";

import * as React from "react";
import { Target, Check, Layers, MessageSquare, BookOpen } from "lucide-react";
import Link from "next/link";
import { useDashboardGoals, DashboardGoal } from "@/hooks/use-dashboard-goals";

const GOAL_ICONS: Record<string, { icon: typeof BookOpen; href: string }> = {
  study_time: { icon: BookOpen, href: "/dashboard/documents" },
  quizzes: { icon: Target, href: "/dashboard/quizzes" },
  flashcards: { icon: Layers, href: "/dashboard/flashcards" },
  chat_questions: { icon: MessageSquare, href: "/dashboard/chat" },
};

export function FolioGoalsCard() {
  const { goalsData, isLoading } = useDashboardGoals();

  const { goals, completedGoalsCount, totalGoalsCount } = goalsData;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xs border border-[#E5EAE7] flex flex-col justify-between h-full min-h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#11231B] tracking-tight">Today&apos;s Goals</h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          {completedGoalsCount}/{totalGoalsCount} completed
        </span>
      </div>

      {/* Goal List */}
      <div className="space-y-3 my-auto">
        {goals.map((goal: DashboardGoal) => {
          const config = GOAL_ICONS[goal.id] || { icon: Target, href: "/dashboard" };
          const IconComponent = config.icon;
          const isDone = goal.completed;

          return (
            <Link
              key={goal.id}
              href={config.href}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Left Status Icon */}
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? "bg-[#0D382B] text-white shadow-xs"
                      : "bg-[#112B22]/10 text-[#0D382B] group-hover:bg-[#112B22]/20"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <IconComponent className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Title & Progress Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isDone ? "text-slate-500 line-through" : "text-[#11231B]"
                      }`}
                    >
                      {goal.title}
                    </p>
                    <span className="text-[11px] font-bold text-slate-500 shrink-0">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? "bg-[#0D382B]" : "bg-emerald-500"
                      }`}
                      style={{ width: `${goal.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Encouragement Note */}
      <div className="pt-2 text-center">
        {completedGoalsCount === totalGoalsCount ? (
          <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-full inline-block">
            🌟 All goals accomplished for today! Outstanding work!
          </p>
        ) : (
          <p className="text-[11px] font-medium text-slate-400">
            Keep completing tasks to fill your daily rings.
          </p>
        )}
      </div>
    </div>
  );
}
