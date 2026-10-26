"use client";

import * as React from "react";
import { Clock, Layers, Check, FileText, Target, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRecentActivity, ActivityFeedItem } from "@/hooks/use-recent-activity";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getActivityConfig(item: ActivityFeedItem) {
  switch (item.type) {
    case "quiz":
      return {
        icon: Target,
        iconBg: "bg-[#0D382B] text-white",
        href: "/dashboard/quizzes",
      };
    case "flashcard":
      return {
        icon: Layers,
        iconBg: "bg-emerald-50 text-emerald-800",
        href: "/dashboard/flashcards",
      };
    case "document":
      return {
        icon: FileText,
        iconBg: "bg-amber-50 text-amber-800",
        href: "/dashboard/documents",
      };
    case "session":
    default:
      return {
        icon: Check,
        iconBg: "bg-slate-100 text-slate-700",
        href: "/dashboard/documents",
      };
  }
}

export function FolioRecentActivity() {
  const { activities, isLoading } = useRecentActivity();

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xs border border-[#E5EAE7] flex flex-col justify-between h-full min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#11231B] tracking-tight">Recent Activity</h4>
        </div>
        <Link
          href="/dashboard/documents"
          className="text-[11px] font-bold text-slate-500 hover:text-[#0D382B] flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity List or Empty State */}
      <div className="space-y-3 my-auto">
        {activities.length > 0 ? (
          activities.slice(0, 3).map((item) => {
            const config = getActivityConfig(item);
            const Icon = config.icon;

            return (
              <Link
                key={item.id}
                href={config.href}
                className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-slate-50/80 transition-colors group"
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.iconBg}`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-[#0D382B] truncate transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                    {item.description} • {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="py-4 text-center">
            <div className="h-8 w-8 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center mb-1.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-700">No activity yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Start a quiz, review flashcards, or upload a note to begin!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
