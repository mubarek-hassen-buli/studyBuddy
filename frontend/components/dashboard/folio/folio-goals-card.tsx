"use client";

import * as React from "react";
import { Target, Check, ArrowRight, Layers, MessageSquare, BookOpen } from "lucide-react";
import Link from "next/link";

interface GoalItem {
  id: string;
  title: string;
  current: number;
  target: number;
  isCompleted: boolean;
  icon: any;
  href: string;
}

export function FolioGoalsCard() {
  const [goals, setGoals] = React.useState<GoalItem[]>([
    {
      id: "1",
      title: "Study 2 chapters",
      current: 1,
      target: 2,
      isCompleted: false,
      icon: BookOpen,
      href: "/dashboard/documents",
    },
    {
      id: "2",
      title: "Complete 1 quiz",
      current: 1,
      target: 1,
      isCompleted: true,
      icon: Target,
      href: "/dashboard/buddies",
    },
    {
      id: "3",
      title: "Review flashcards",
      current: 0,
      target: 1,
      isCompleted: false,
      icon: Layers,
      href: "/dashboard/buddies",
    },
    {
      id: "4",
      title: "Ask Folio 3 questions",
      current: 1,
      target: 3,
      isCompleted: false,
      icon: MessageSquare,
      href: "/dashboard/buddies",
    },
  ]);

  const completedCount = goals.filter((g) => g.isCompleted || g.current >= g.target).length;

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
          {completedCount}/{goals.length} completed
        </span>
      </div>

      {/* Goal List */}
      <div className="space-y-3 my-auto">
        {goals.map((goal) => {
          const isDone = goal.isCompleted || goal.current >= goal.target;
          const progressPct = Math.min(100, Math.round((goal.current / goal.target) * 100));

          return (
            <div
              key={goal.id}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Left Status Icon */}
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    isDone
                      ? "bg-[#0D382B] text-white"
                      : "bg-[#112B22]/10 text-[#0D382B]"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <goal.icon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Title & Progress Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {goal.title}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0 ml-2">
                      {goal.current}/{goal.target}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? "bg-[#0D382B]" : "bg-emerald-500"
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button: Checkmark or Arrow */}
              {isDone ? (
                <div className="h-6 w-6 rounded-full bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              ) : (
                <Link
                  href={goal.href}
                  className="h-6 w-6 rounded-full bg-slate-100 hover:bg-[#0D382B] hover:text-white text-slate-500 flex items-center justify-center shrink-0 transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
