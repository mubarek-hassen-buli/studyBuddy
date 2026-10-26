"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Dices,
  ChevronUp,
  ChevronRight,
  ArrowRight,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useQuizzes, QuizAttemptRecord } from "@/hooks/use-quizzes";

interface QuizzesSidebarProps {
  onGenerateQuizClick?: () => void;
  onCreateFlashcardsClick?: () => void;
  onRandomQuizClick?: () => void;
  onSelectAttempt?: (quizId: string) => void;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  } catch {
    return "Recently";
  }
}

export function QuizzesSidebar({
  onGenerateQuizClick,
  onCreateFlashcardsClick,
  onRandomQuizClick,
  onSelectAttempt,
}: QuizzesSidebarProps) {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = React.useState(true);
  const { overview } = useQuizzes();

  const recentAttempts = overview.recentAttempts || [];

  return (
    <aside className="w-full lg:w-80 space-y-4 font-sans">
      {/* 1. Quick Actions Card */}
      <div className="bg-white border border-[#E5EAE7] rounded-2xl p-4 shadow-2xs">
        <div
          onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
          className="flex items-center justify-between cursor-pointer select-none mb-2"
        >
          <h2 className="text-xs sm:text-sm font-bold text-[#11231B]">Quick Actions</h2>
          <ChevronUp
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isQuickActionsOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>

        {isQuickActionsOpen && (
          <div className="space-y-2 pt-1">
            {/* Action 1: Generate Quiz */}
            <button
              onClick={onGenerateQuizClick}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F4F8F5] transition-all text-left group"
            >
              <div className="h-9 w-9 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-[#1B4B38]" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-[#11231B] leading-tight">
                  Generate Quiz
                </span>
                <span className="text-[11px] text-slate-400">
                  From your materials or topic
                </span>
              </div>
            </button>

            {/* Action 2: Create Flashcards */}
            <Link
              href="/dashboard/flashcards"
              onClick={onCreateFlashcardsClick}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F4F8F5] transition-all text-left group"
            >
              <div className="h-9 w-9 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4 text-[#1B4B38]" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-[#11231B] leading-tight">
                  Practice Flashcards
                </span>
                <span className="text-[11px] text-slate-400">
                  Review spaced repetition decks
                </span>
              </div>
            </Link>

            {/* Action 3: Take a Random Quiz */}
            <button
              onClick={onRandomQuizClick}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F4F8F5] transition-all text-left group"
            >
              <div className="h-9 w-9 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Dices className="w-4 h-4 text-[#1B4B38]" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-[#11231B] leading-tight">
                  Random Quiz Challenge
                </span>
                <span className="text-[11px] text-slate-400">
                  Quick test your knowledge
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 2. Recent Quizzes Card */}
      <div className="bg-white border border-[#E5EAE7] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-[#11231B]">Recent Quizzes</h2>
          <span className="text-[11px] font-bold text-emerald-800">
            {overview.quizzesTaken} Total
          </span>
        </div>

        {recentAttempts.length > 0 ? (
          <div className="space-y-2">
            {recentAttempts.map((attempt: QuizAttemptRecord) => (
              <div
                key={attempt.id}
                onClick={() => onSelectAttempt?.(attempt.quizId)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F8F5] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-[#E8F5EE] text-[#1B4B38] flex items-center justify-center shrink-0 font-bold text-xs">
                    {attempt.percentage}%
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#11231B] truncate leading-tight">
                      {attempt.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {attempt.score}/{attempt.totalQuestions} correct · {formatRelativeTime(attempt.completedAt)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-400">
              No recent attempts yet.
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Complete a quiz to track your mastery scores here!
            </p>
          </div>
        )}
      </div>

      {/* 3. Bottom Motivational Card (Dark Green) */}
      <div className="relative overflow-hidden bg-[#0D382B] rounded-3xl p-5 text-white shadow-md">
        <div className="flex items-start gap-4">
          {/* Classical Philosopher Character Avatar with specs */}
          <div className="relative w-20 h-24 shrink-0 -ml-1">
            <Image
              src="/images/folio.png"
              alt="Folio character"
              fill
              className="object-contain object-bottom drop-shadow"
            />
          </div>

          <div className="flex flex-col justify-between flex-1">
            <p className="font-handwriting text-lg sm:text-xl text-emerald-100 font-bold leading-snug">
              &ldquo;Mistakes aren&apos;t failures, they&apos;re feedback.&rdquo;
            </p>
            <p className="font-handwriting text-xs text-emerald-300 text-right mt-1">
              — Folio
            </p>

            <button
              onClick={onRandomQuizClick}
              className="mt-4 self-start inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-[#0D382B] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95"
            >
              <span>Try Another Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
