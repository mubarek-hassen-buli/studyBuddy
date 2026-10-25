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
  MoreHorizontal,
  Plus,
  LayoutGrid,
  List,
  ChevronDown,
  Heart,
  Tag,
  User,
  CheckCircle2,
} from "lucide-react";

export interface QuizItem {
  id: string;
  title: string;
  category: string;
  questionCount: number;
  durationMinutes: number;
  progressPercent: number;
  icon: React.ElementType;
}

const DEFAULT_QUIZZES: QuizItem[] = [
  {
    id: "quiz-1",
    title: "Cell Biology Basics",
    category: "Biology",
    questionCount: 12,
    durationMinutes: 8,
    progressPercent: 0,
    icon: FileText,
  },
  {
    id: "quiz-2",
    title: "Python Fundamentals",
    category: "Computer Science",
    questionCount: 15,
    durationMinutes: 10,
    progressPercent: 0,
    icon: Code2,
  },
  {
    id: "quiz-3",
    title: "Organic Chemistry",
    category: "Chemistry",
    questionCount: 10,
    durationMinutes: 7,
    progressPercent: 0,
    icon: FlaskConical,
  },
  {
    id: "quiz-4",
    title: "World History: Modern Era",
    category: "History",
    questionCount: 14,
    durationMinutes: 9,
    progressPercent: 0,
    icon: BookOpen,
  },
  {
    id: "quiz-5",
    title: "Calculus Practice",
    category: "Mathematics",
    questionCount: 12,
    durationMinutes: 8,
    progressPercent: 0,
    icon: Sigma,
  },
  {
    id: "quiz-6",
    title: "Essay Writing Skills",
    category: "Writing",
    questionCount: 8,
    durationMinutes: 6,
    progressPercent: 0,
    icon: PenTool,
  },
  {
    id: "quiz-7",
    title: "Physics: Mechanics",
    category: "Physics",
    questionCount: 11,
    durationMinutes: 8,
    progressPercent: 0,
    icon: Atom,
  },
  {
    id: "quiz-8",
    title: "English Vocabulary",
    category: "Languages",
    questionCount: 10,
    durationMinutes: 7,
    progressPercent: 0,
    icon: MessageSquare,
  },
];

interface QuizzesGridProps {
  onStartQuiz: (quiz: QuizItem) => void;
  onCreateQuizClick: () => void;
}

export function QuizzesGrid({ onStartQuiz, onCreateQuizClick }: QuizzesGridProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "my" | "saved" | "topic">("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState("Most Recent");
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  const filteredQuizzes = DEFAULT_QUIZZES;

  return (
    <div className="space-y-4">
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
            <span>All Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
              activeTab === "my"
                ? "bg-[#0D382B] text-white shadow-xs"
                : "bg-white border border-[#E0E5E1] text-[#4A5D53] hover:bg-[#F2F5F2]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
              activeTab === "saved"
                ? "bg-[#0D382B] text-white shadow-xs"
                : "bg-white border border-[#E0E5E1] text-[#4A5D53] hover:bg-[#F2F5F2]"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved</span>
          </button>

          <button
            onClick={() => setActiveTab("topic")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
              activeTab === "topic"
                ? "bg-[#0D382B] text-white shadow-xs"
                : "bg-white border border-[#E0E5E1] text-[#4A5D53] hover:bg-[#F2F5F2]"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>By Topic</span>
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
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 font-sans text-xs">
                {["Most Recent", "Highest Score", "Alphabetical", "Question Count"].map((opt) => (
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

      {/* Grid: 3 columns x 3 rows = 9 slots */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
            : "flex flex-col gap-2.5"
        }
      >
        {filteredQuizzes.map((quiz) => {
          const Icon = quiz.icon;
          return (
            <div
              key={quiz.id}
              className="group bg-white border border-[#E7EBE7] hover:border-[#BED6C6] hover:shadow-sm rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Row: Icon + Title + More Button */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#1B4B38]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-[#11231B] leading-tight group-hover:text-emerald-900 transition-colors">
                        {quiz.title}
                      </h3>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags row: category pill + questions + duration */}
                <div className="flex items-center flex-wrap gap-2 mt-3 text-[11px] text-slate-400 font-medium">
                  <span className="bg-[#EEF5F1] text-[#2C6248] px-2 py-0.5 rounded-md font-semibold text-[10px]">
                    {quiz.category}
                  </span>
                  <span>{quiz.questionCount} questions</span>
                  <span>·</span>
                  <span>~ {quiz.durationMinutes} min</span>
                </div>
              </div>

              {/* Bottom Row: Start Quiz button & Radial progress */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F2F5F3]">
                <button
                  onClick={() => onStartQuiz(quiz)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#B8D8C4] bg-white hover:bg-[#E8F3EC] text-[#0D382B] text-xs font-bold transition-all shadow-2xs active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Quiz</span>
                </button>

                {/* Progress indicator dial (0%) */}
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
                      strokeDasharray={`${quiz.progressPercent}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-bold text-slate-400">
                    {quiz.progressPercent}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Slot 9: Create Your Own Quiz */}
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
              Upload your material or choose from your notes.
            </p>
          </div>

          <button className="w-full mt-3 py-1.5 px-3 rounded-xl border border-[#B8D8C4] bg-white group-hover:bg-[#E8F3EC] text-[#0D382B] text-xs font-bold transition-all shadow-2xs">
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
