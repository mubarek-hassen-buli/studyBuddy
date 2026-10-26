"use client";

import * as React from "react";
import {
  Layers,
  ChevronDown,
  LayoutGrid,
  List,
  Play,
  Plus,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { useFlashcardDecks, FlashcardDeck } from "@/hooks/use-flashcard-decks";
import { FlashcardsStudyModal } from "./flashcards-study-modal";

interface FlashcardsGridProps {
  onCreateDeckClick: () => void;
}

export function FlashcardsGrid({ onCreateDeckClick }: FlashcardsGridProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "due" | "mastered">("all");
  const [sortBy, setSortBy] = React.useState<"recent" | "cards" | "name">("recent");
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Active study session deck
  const [activeStudyDeck, setActiveStudyDeck] = React.useState<FlashcardDeck | null>(null);

  const { decks, isLoading } = useFlashcardDecks();

  // Filter and sort decks
  const filteredDecks = React.useMemo(() => {
    let list = [...decks];

    if (activeTab === "due") {
      list = list.filter((d) => d.dueCount > 0);
    } else if (activeTab === "mastered") {
      list = list.filter((d) => d.masteryPercentage >= 75);
    }

    list.sort((a, b) => {
      if (sortBy === "recent") {
        const timeA = a.lastReviewedAt ? new Date(a.lastReviewedAt).getTime() : new Date(a.createdAt).getTime();
        const timeB = b.lastReviewedAt ? new Date(b.lastReviewedAt).getTime() : new Date(b.createdAt).getTime();
        return timeB - timeA;
      }
      if (sortBy === "cards") {
        return b.totalCards - a.totalCards;
      }
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }, [decks, activeTab, sortBy]);

  const filterTabs = [
    { id: "all" as const, label: "All Decks" },
    { id: "due" as const, label: "Due for Review" },
    { id: "mastered" as const, label: "High Mastery" },
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
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0D382B] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Sort & View Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-1 bg-white border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <span>
                {sortBy === "recent" ? "Sort: Recently Used" : sortBy === "cards" ? "Sort: Card Count" : "Sort: Name A-Z"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setSortBy("recent"); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${sortBy === "recent" ? "font-bold text-[#0D382B] bg-emerald-50" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Recently Used
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("cards"); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${sortBy === "cards" ? "font-bold text-[#0D382B] bg-emerald-50" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Card Count
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("name"); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${sortBy === "name" ? "font-bold text-[#0D382B] bg-emerald-50" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Name (A-Z)
                </button>
              </div>
            )}
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 bg-white border border-[#E5EAE7] rounded-lg shadow-2xs">
            <button
              type="button"
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
              type="button"
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
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
            : "space-y-2.5"
        }
      >
        {filteredDecks.map((deck) => (
          <div
            key={deck.id}
            className="group relative rounded-2xl bg-white p-4 shadow-2xs hover:shadow-md transition-all border border-[#E5EAE7] flex flex-col justify-between min-h-[145px]"
          >
            {/* Top Row: Icon + Title/Cards + Menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-[#E8F2EC] text-[#0D382B]">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D382B] transition-colors truncate">
                    {deck.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {deck.totalCards} cards • {deck.dueCount} due today
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {deck.subject}
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Row: Progress Bar & Percentage */}
            <div className="my-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mr-3">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${deck.masteryPercentage}%` }}
                  />
                </div>
                <span className="shrink-0">{deck.masteryPercentage}%</span>
              </div>
            </div>

            {/* Bottom Row: Study Button */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveStudyDeck(deck)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F2EC] hover:bg-[#D7EAE0] text-[#0D382B] text-xs font-bold transition-colors active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Practice</span>
              </button>

              <span className="text-[10px] text-slate-400 font-medium">
                {deck.masteredCount} mastered
              </span>
            </div>
          </div>
        ))}

        {/* Create New Deck Slot */}
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
            Generate cards from notes or subject
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

      {/* When no decks exist yet */}
      {decks.length === 0 && !isLoading && (
        <div className="rounded-3xl bg-white p-8 text-center border border-[#E5EAE7] shadow-xs flex flex-col items-center justify-center min-h-[220px]">
          <div className="relative w-20 h-20 mb-3">
            <Image
              src="/images/folio.png"
              alt="Folio avatar"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="font-serif text-base font-bold text-slate-900 tracking-tight">
            No flashcard decks created yet
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mt-1 mb-4">
            Click &apos;Create New Deck&apos; or upload materials to start practicing with spaced repetition.
          </p>
          <button
            type="button"
            onClick={onCreateDeckClick}
            className="inline-flex items-center gap-2 rounded-full bg-[#0D382B] text-white text-xs font-bold px-5 py-2.5 shadow-xs hover:bg-[#07241C] transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Generate First Deck</span>
          </button>
        </div>
      )}

      {/* Interactive Flashcard Study Runner Modal */}
      <FlashcardsStudyModal
        deck={activeStudyDeck}
        isOpen={!!activeStudyDeck}
        onClose={() => setActiveStudyDeck(null)}
      />
    </div>
  );
}
