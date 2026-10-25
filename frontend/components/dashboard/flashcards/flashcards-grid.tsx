"use client";

import * as React from "react";
import {
  Layers,
  User,
  Share2,
  Bookmark,
  ChevronDown,
  LayoutGrid,
  List,
  MoreHorizontal,
  Play,
  Plus,
  Code,
  FlaskConical,
  Calculator,
  BookOpen,
  MessageSquare,
  FileText,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useBuddies } from "@/hooks/use-buddies";

interface FlashcardDeckItem {
  id: string;
  title: string;
  cardsCount: number;
  dueToday: number;
  progressPercent: number;
  icon: any;
  iconColor: string;
  iconBg: string;
  buddyId?: string;
}

const SHOWCASE_DECKS: FlashcardDeckItem[] = [
  {
    id: "1",
    title: "Computer Science",
    cardsCount: 12,
    dueToday: 3,
    progressPercent: 75,
    icon: Code,
    iconColor: "text-[#0D382B]",
    iconBg: "bg-[#E8F2EC]",
  },
  {
    id: "2",
    title: "Biology",
    cardsCount: 28,
    dueToday: 5,
    progressPercent: 60,
    icon: FlaskConical,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "3",
    title: "Web Development",
    cardsCount: 46,
    dueToday: 8,
    progressPercent: 42,
    icon: Terminal,
    iconColor: "text-slate-700",
    iconBg: "bg-slate-100",
  },
  {
    id: "4",
    title: "Mathematics",
    cardsCount: 32,
    dueToday: 6,
    progressPercent: 68,
    icon: Calculator,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50",
  },
  {
    id: "5",
    title: "Islamic Studies",
    cardsCount: 18,
    dueToday: 4,
    progressPercent: 55,
    icon: BookOpen,
    iconColor: "text-teal-700",
    iconBg: "bg-teal-50",
  },
  {
    id: "6",
    title: "English Vocabulary",
    cardsCount: 40,
    dueToday: 7,
    progressPercent: 38,
    icon: MessageSquare,
    iconColor: "text-amber-700",
    iconBg: "bg-amber-50",
  },
  {
    id: "7",
    title: "General Knowledge",
    cardsCount: 24,
    dueToday: 2,
    progressPercent: 72,
    icon: FileText,
    iconColor: "text-indigo-700",
    iconBg: "bg-indigo-50",
  },
  {
    id: "8",
    title: "System Design",
    cardsCount: 16,
    dueToday: 3,
    progressPercent: 50,
    icon: Terminal,
    iconColor: "text-cyan-700",
    iconBg: "bg-cyan-50",
  },
];

interface FlashcardsGridProps {
  onCreateDeckClick: () => void;
}

export function FlashcardsGrid({ onCreateDeckClick }: FlashcardsGridProps) {
  const [activeTab, setActiveTab] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const { buddies } = useBuddies();

  // If user has real buddies, map them into decks or combine with showcase
  const decks = React.useMemo(() => {
    if (buddies && buddies.length > 0) {
      const realDecks: FlashcardDeckItem[] = buddies.map((b: any, index: number) => ({
        id: b.id,
        title: b.name,
        cardsCount: 20 + (index * 5),
        dueToday: 3 + (index * 2),
        progressPercent: Math.min(95, 45 + (index * 12)),
        icon: index % 2 === 0 ? Code : BookOpen,
        iconColor: "text-[#0D382B]",
        iconBg: "bg-[#E8F2EC]",
        buddyId: b.id,
      }));

      // Combine with showcase
      const combined = [...realDecks];
      SHOWCASE_DECKS.forEach((d) => {
        if (!combined.some((c) => c.title.toLowerCase() === d.title.toLowerCase())) {
          combined.push(d);
        }
      });
      return combined.slice(0, 8);
    }
    return SHOWCASE_DECKS;
  }, [buddies]);

  const filterTabs = [
    { id: "all", label: "All Decks", icon: null },
    { id: "my", label: "My Decks", icon: User },
    { id: "shared", label: "Shared", icon: Share2 },
    { id: "favorites", label: "Favorites", icon: Bookmark },
  ];

  return (
    <div className="space-y-4">
      {/* Filters and Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E5EAE7] rounded-xl shadow-2xs">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0D382B] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Sort & View Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
            <span>Sort by: Recently Used</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 bg-white border border-[#E5EAE7] rounded-lg shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded ${
                viewMode === "grid"
                  ? "bg-[#E8F2EC] text-[#0D382B]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded ${
                viewMode === "list"
                  ? "bg-[#E8F2EC] text-[#0D382B]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Decks Grid (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {decks.map((deck) => {
          const studyHref = deck.buddyId
            ? `/dashboard/study/${deck.buddyId}?mode=flashcards`
            : `/dashboard/buddies`;

          return (
            <div
              key={deck.id}
              className="group relative rounded-2xl bg-white p-4 shadow-2xs hover:shadow-md transition-all border border-[#E5EAE7] flex flex-col justify-between min-h-[145px]"
            >
              {/* Top Row: Icon + Title/Cards + Menu */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${deck.iconBg} ${deck.iconColor}`}
                  >
                    <deck.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D382B] transition-colors truncate">
                      {deck.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {deck.cardsCount} cards • {deck.dueToday} due today
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Middle Row: Progress Bar & Percentage */}
              <div className="my-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mr-3">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${deck.progressPercent}%` }}
                    />
                  </div>
                  <span className="shrink-0">{deck.progressPercent}%</span>
                </div>
              </div>

              {/* Bottom Row: Study Button */}
              <div className="pt-1">
                <Link
                  href={studyHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F2EC] hover:bg-[#D7EAE0] text-[#0D382B] text-xs font-bold transition-colors active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Study</span>
                </Link>
              </div>
            </div>
          );
        })}

        {/* 9th Card: Create New Deck Card */}
        <div
          onClick={onCreateDeckClick}
          className="group relative rounded-2xl bg-white p-4 shadow-2xs hover:shadow-md transition-all border border-dashed border-slate-300 hover:border-[#0D382B] flex flex-col items-center justify-center text-center cursor-pointer min-h-[145px]"
        >
          <div className="h-10 w-10 rounded-full bg-[#E8F2EC] text-[#0D382B] group-hover:bg-[#0D382B] group-hover:text-white flex items-center justify-center mb-2 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D382B] transition-colors">
            Create New Deck
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 mb-2.5">
            Start with your own material
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600 hover:bg-[#0D382B] hover:text-white hover:border-[#0D382B] transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Create Deck</span>
          </button>
        </div>
      </div>
    </div>
  );
}
