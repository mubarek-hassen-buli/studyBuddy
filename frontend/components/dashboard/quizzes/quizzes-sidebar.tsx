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
  Code2,
  FlaskConical,
  BookOpen,
} from "lucide-react";

interface QuizzesSidebarProps {
  onGenerateQuizClick?: () => void;
  onCreateFlashcardsClick?: () => void;
  onRandomQuizClick?: () => void;
}

export function QuizzesSidebar({
  onGenerateQuizClick,
  onCreateFlashcardsClick,
  onRandomQuizClick,
}: QuizzesSidebarProps) {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = React.useState(true);

  const recentQuizzes = [
    {
      id: "rq-1",
      title: "Cell Biology Basics",
      subtitle: "12 questions · 78%",
      icon: FileText,
    },
    {
      id: "rq-2",
      title: "Python Fundamentals",
      subtitle: "15 questions · 90%",
      icon: Code2,
    },
    {
      id: "rq-3",
      title: "Organic Chemistry",
      subtitle: "10 questions · 60%",
      icon: FlaskConical,
    },
    {
      id: "rq-4",
      title: "World History: Modern Era",
      subtitle: "14 questions · 85%",
      icon: BookOpen,
    },
  ];

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
                  From your materials
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
                  Create Flashcards
                </span>
                <span className="text-[11px] text-slate-400">
                  From your notes
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
                  Take a Random Quiz
                </span>
                <span className="text-[11px] text-slate-400">
                  Challenge yourself now
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
          <button className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5">
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {recentQuizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F8F5] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-[#E8F5EE] text-[#1B4B38] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#11231B] truncate leading-tight">
                      {quiz.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {quiz.subtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 shrink-0" />
              </div>
            );
          })}
        </div>
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
