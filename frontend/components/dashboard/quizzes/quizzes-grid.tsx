"use client";

import * as React from "react";
import {
  FileText,
  Code2,
  FlaskConical,
  BookOpen,
  Sigma,
  PenTool,
  Atom,
  MessageSquare,
  Play,
  Plus,
  LayoutGrid,
  List,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useQuizzes, UserQuiz } from "@/hooks/use-quizzes";

interface QuizzesGridProps {
  onStartQuiz: (quiz: UserQuiz) => void;
  onCreateQuizClick: () => void;
}

function getQuizIcon(topic: string, title: string): React.ElementType {
  const text = `${topic} ${title}`.toLowerCase();
  if (text.includes("code") || text.includes("python") || text.includes("program") || text.includes("cs")) {
    return Code2;
  }
  if (text.includes("chem") || text.includes("lab") || text.includes("reaction")) {
    return FlaskConical;
  }
  if (text.includes("math") || text.includes("calc") || text.includes("algebra") || text.includes("geometry")) {
    return Sigma;
  }
  if (text.includes("phys") || text.includes("mechanic") || text.includes("quantum")) {
    return Atom;
  }
  if (text.includes("write") || text.includes("essay") || text.includes("english") || text.includes("lit")) {
    return PenTool;
  }
  if (text.includes("language") || text.includes("vocab") || text.includes("french") || text.includes("spanish")) {
    return MessageSquare;
  }
  if (text.includes("bio") || text.includes("cell") || text.includes("gene") || text.includes("plant")) {
    return FileText;
  }
  return BookOpen;
}

export function QuizzesGrid({ onStartQuiz, onCreateQuizClick }: QuizzesGridProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "completed" | "unattempted">("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState<"Most Recent" | "Highest Score" | "Alphabetical" | "Question Count">("Most Recent");
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  const { quizzes, isLoading } = useQuizzes();

  // Filter quizzes
  const filteredQuizzes = React.useMemo(() => {
    let list = [...quizzes];

    if (activeTab === "completed") {
      list = list.filter((q) => q.bestScore !== null);
    } else if (activeTab === "unattempted") {
      list = list.filter((q) => q.bestScore === null);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "Highest Score") {
        return (b.bestScore || 0) - (a.bestScore || 0);
      }
      if (sortBy === "Alphabetical") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "Question Count") {
        return b.questionCount - a.questionCount;
      }
      // Most Recent default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [quizzes, activeTab, sortBy]);

  return (
    <div className="space-y-4 font-sans">
      {/* Filter Tabs & Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Left: Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
              activeTab === "all"
                ? "bg-[#0D382B] text-white shadow-xs"
                : "bg-white border border-[#E0E5E1] text-[#4A5D53] hover:bg-[#F2F5F2]"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Quizzes ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
              activeTab === "completed"
                ? "bg-[#0D382B] text-white shadow-xs"
                : "bg-white border border-[#E0E5E1] text-[#4A5D53] hover:bg-[#F2F5F2]"
            }`}
          >
            <span>Completed</span>
          </button>

          <button
            onClick={() => setActiveTab("unattempted")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
              activeTab === "unattempted"
                ? "bg-[#0D382B] text-white shadow-xs"
                : "bg-white border border-[#E0E5E1] text-[#4A5D53] hover:bg-[#F2F5F2]"
            }`}
          >
            <span>Unattempted</span>
          </button>
        </div>

        {/* Right: Sort Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="inline-flex items-center gap-1.5 bg-white border border-[#E0E5E1] hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium shadow-2xs transition-all"
            >
              <span className="text-slate-400">Sort by:</span>
              <span className="font-semibold text-slate-800">{sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 font-sans text-xs">
                {(["Most Recent", "Highest Score", "Alphabetical", "Question Count"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 ${
                      sortBy === opt ? "font-bold text-emerald-800 bg-emerald-50/50" : "text-slate-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white border border-[#E0E5E1] rounded-xl p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-[#E8F3EC] text-[#0D382B]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-[#E8F3EC] text-[#0D382B]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-[#E5EAE7] animate-pulse space-y-3">
              <div className="h-10 w-10 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Quizzes List or Empty State */}
      {!isLoading && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
              : "flex flex-col gap-2.5"
          }
        >
          {filteredQuizzes.map((quiz) => {
            const Icon = getQuizIcon(quiz.topic, quiz.title);
            const duration = Math.max(2, Math.round(quiz.questionCount * 1.5));
            const progress = quiz.bestScore !== null ? quiz.bestScore : 0;

            return (
              <div
                key={quiz.id}
                className="group bg-white border border-[#E7EBE7] hover:border-[#BED6C6] hover:shadow-sm rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top Row: Icon + Title */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-[#1B4B38]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-[#11231B] leading-tight group-hover:text-emerald-900 transition-colors line-clamp-1">
                          {quiz.title}
                        </h3>
                        {quiz.studyBuddyName && (
                          <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
                            {quiz.studyBuddyName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags row: category pill + questions + duration */}
                  <div className="flex items-center flex-wrap gap-2 mt-3 text-[11px] text-slate-400 font-medium">
                    <span className="bg-[#EEF5F1] text-[#2C6248] px-2 py-0.5 rounded-md font-semibold text-[10px]">
                      {quiz.topic}
                    </span>
                    <span>{quiz.questionCount} questions</span>
                    <span>·</span>
                    <span>~ {duration} min</span>
                  </div>
                </div>

                {/* Bottom Row: Start Quiz button & Radial progress */}
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F2F5F3]">
                  <button
                    onClick={() => onStartQuiz(quiz)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#B8D8C4] bg-white hover:bg-[#E8F3EC] text-[#0D382B] text-xs font-bold transition-all shadow-2xs active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{quiz.bestScore !== null ? "Retake Quiz" : "Start Quiz"}</span>
                  </button>

                  {/* Progress indicator dial */}
                  <div className="relative flex items-center justify-center w-7 h-7">
                    <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-600 transition-all duration-300"
                        strokeDasharray={`${progress}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[8px] font-bold text-slate-500">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create Your Own Quiz Slot */}
          <div
            onClick={onCreateQuizClick}
            className="group cursor-pointer bg-[#FAFCF9] border-2 border-dashed border-[#CFDDCF] hover:border-emerald-600 rounded-2xl p-4 transition-all duration-200 flex flex-col items-center justify-between text-center min-h-[155px]"
          >
            <div className="flex flex-col items-center pt-2">
              <div className="h-10 w-10 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 text-[#1B4B38]" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#11231B] leading-tight">
                Create Your Own Quiz
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Generate tailored multiple-choice challenges with Folio AI.
              </p>
            </div>

            <button className="w-full mt-3 py-1.5 px-3 rounded-xl border border-[#B8D8C4] bg-white group-hover:bg-[#E8F3EC] text-[#0D382B] text-xs font-bold transition-all shadow-2xs">
              Create Quiz
            </button>
          </div>
        </div>
      )}

      {/* Empty State Banner if 0 quizzes exist */}
      {!isLoading && quizzes.length === 0 && (
        <div className="rounded-3xl bg-white border border-[#E5EAE7] p-8 text-center shadow-2xs space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src="/images/folio.png"
              alt="Folio character"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              No Quizzes Created Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Test your recall and master new subjects. Let Folio AI craft tailored quizzes from your study materials or any topic of interest.
            </p>
          </div>
          <button
            onClick={onCreateQuizClick}
            className="inline-flex items-center gap-2 bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Your First Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
}
