"use client";

import * as React from "react";
import Image from "next/image";
import {
  Calendar,
  BarChart3,
  Play,
  ArrowRight,
  CreditCard,
  Layers,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useFlashcardDecks, FlashcardDeck } from "@/hooks/use-flashcard-decks";
import { useStreak } from "@/hooks/use-streak";
import { FlashcardsStudyModal } from "./flashcards-study-modal";

export function FlashcardsSidebar() {
  const { overview, decks } = useFlashcardDecks();
  const { streak } = useStreak();

  const [activeStudyDeck, setActiveStudyDeck] = React.useState<FlashcardDeck | null>(null);

  const dueDeck = decks.find((d) => d.dueCount > 0) || decks[0] || null;

  const handleStartReview = () => {
    if (dueDeck) {
      setActiveStudyDeck(dueDeck);
    }
  };

  const retention = overview.retentionRate || 0;

  return (
    <div className="space-y-4">
      {/* 1. Today's Review Card */}
      <div className="rounded-2xl bg-white p-5 shadow-2xs border border-[#E5EAE7]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Today&apos;s Review
            </h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-800">
            {overview.dueToday} Due
          </span>
        </div>

        {/* Character Avatar + Info */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3.5">
          <div className="h-11 w-11 rounded-full overflow-hidden bg-white shrink-0 border border-emerald-400/30 shadow-2xs">
            <Image
              src="/images/folio.png"
              alt="Folio avatar"
              width={44}
              height={44}
              className="w-full h-full object-cover object-[center_12%]"
            />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
              {overview.dueToday > 0 ? `${overview.dueToday} cards due today` : "All caught up today!"}
            </h5>
            <p className="text-[11px] text-slate-400 font-medium">
              {overview.dueToday > 0 ? "Keep your streak alive!" : "Great job staying consistent."}
            </p>
          </div>
        </div>

        {/* Start Reviewing Button */}
        {dueDeck ? (
          <button
            type="button"
            onClick={handleStartReview}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold py-2.5 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice {dueDeck.title}</span>
          </button>
        ) : (
          <Link
            href="/dashboard/documents"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold py-2.5 shadow-xs transition-all active:scale-95"
          >
            <span>Upload Notes for Cards</span>
          </Link>
        )}
      </div>

      {/* 2. Learning Progress (Donut Chart + Stats) */}
      <div className="rounded-2xl bg-white p-5 shadow-2xs border border-[#E5EAE7]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Learning Progress
            </h4>
          </div>
          <Link
            href="/dashboard/documents"
            className="text-[11px] font-bold text-slate-500 hover:text-[#0D382B] flex items-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4 py-1">
          {/* Radial Donut Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Gray Ring */}
              <path
                className="text-slate-100"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Foreground Green Progress Ring */}
              <path
                className="text-emerald-500 transition-all duration-1000"
                strokeDasharray={`${retention}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                {retention}%
              </span>
              <span className="text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">
                Mastery Rate
              </span>
            </div>
          </div>

          {/* Stats List */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">{overview.totalCards} </span>
                <span className="text-[10px] text-slate-400 font-medium">Total Cards</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">{overview.totalDecks} </span>
                <span className="text-[10px] text-slate-400 font-medium">Decks</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">{streak.streakDays} </span>
                <span className="text-[10px] text-slate-400 font-medium">Day Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Motivational Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0D382B] p-4 text-white shadow-xs border border-emerald-950/20 flex items-center justify-between gap-3">
        <div className="relative w-18 h-20 sm:w-20 sm:h-22 shrink-0 overflow-hidden">
          <Image
            src="/images/folio.png"
            alt="Motivational character"
            width={85}
            height={95}
            className="w-full h-full object-contain object-bottom drop-shadow-sm"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white tracking-tight">
            You&apos;re doing great!
          </h4>
          <p className="text-[10px] text-emerald-100/80 font-medium leading-snug mt-0.5 mb-2.5">
            Every card you review brings you closer to your goals.
            <span className="block text-[9px] text-emerald-200/60 font-semibold">— Folio</span>
          </p>

          <button
            type="button"
            onClick={handleStartReview}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#0D382B] px-3.5 py-1 text-[11px] font-bold hover:bg-emerald-50 transition-all shadow-2xs active:scale-95"
          >
            <span>Practice</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Practice Runner Modal if triggered from sidebar */}
      <FlashcardsStudyModal
        deck={activeStudyDeck}
        isOpen={!!activeStudyDeck}
        onClose={() => setActiveStudyDeck(null)}
      />
    </div>
  );
}
