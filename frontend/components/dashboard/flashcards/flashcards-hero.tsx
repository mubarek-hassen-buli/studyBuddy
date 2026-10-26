"use client";

import * as React from "react";
import Image from "next/image";
import { Layers, CreditCard, Calendar, Plus, UploadCloud } from "lucide-react";
import { useFlashcardDecks } from "@/hooks/use-flashcard-decks";

interface FlashcardsHeroProps {
  onCreateDeckClick: () => void;
  onImportClick: () => void;
}

export function FlashcardsHero({ onCreateDeckClick, onImportClick }: FlashcardsHeroProps) {
  const { overview } = useFlashcardDecks();

  const deckCount = overview.totalDecks;
  const totalCards = overview.totalCards;
  const dueToday = overview.dueToday;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-transparent pt-2 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Titles & Stats */}
        <div className="max-w-xl z-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-800">
            FLASHCARDS
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#11231B] tracking-tight leading-tight mt-1 mb-2">
            Learn smarter,
            <br className="hidden sm:inline" /> not harder.
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md leading-relaxed">
            Turn your study materials into interactive flashcards. Review, remember, and build your knowledge — one card at a time.
          </p>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
            {/* Total Decks */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5EAE7] rounded-xl px-3.5 py-2 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">
                  {deckCount}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Total Decks
                </span>
              </div>
            </div>

            {/* Total Cards */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5EAE7] rounded-xl px-3.5 py-2 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">
                  {totalCards}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Total Cards
                </span>
              </div>
            </div>

            {/* Due Today */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5EAE7] rounded-xl px-3.5 py-2 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">
                  {dueToday}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Due Today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Character Illustration & Speech Bubble & Top Actions */}
        <div className="flex flex-col items-end z-10">
          {/* Top Actions Row */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onCreateDeckClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Flashcard Deck</span>
            </button>

            <button
              onClick={onImportClick}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold transition-all shadow-2xs active:scale-95"
            >
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span>Import Flashcards</span>
            </button>
          </div>

          {/* Character + Speech bubble */}
          <div className="relative flex items-center justify-end select-none mt-2">
            <div className="relative mr-2 sm:mr-3 max-w-[190px] rounded-2xl bg-[#EBF4EE] border border-[#D4E7DC] p-3 shadow-2xs">
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#EBF4EE] border-t border-r border-[#D4E7DC] rotate-45" />
              <p className="font-handwriting text-base text-[#133226] font-bold leading-tight">
                Practice makes permanent!
              </p>
              <p className="font-handwriting text-xs text-[#234839] leading-snug mt-0.5">
                Review your cards daily for peak recall.
              </p>
            </div>

            <div className="relative w-28 h-32 sm:w-32 sm:h-36 shrink-0">
              <Image
                src="/images/folio.png"
                alt="Folio character"
                width={130}
                height={145}
                priority
                className="w-full h-full object-contain object-bottom drop-shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
