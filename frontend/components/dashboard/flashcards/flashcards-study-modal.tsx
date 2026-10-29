"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Layers,
  BookOpen,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useFlashcardDecks, FlashcardDeck } from "@/hooks/use-flashcard-decks";
import Image from "next/image";

interface FlashcardsStudyModalProps {
  deck: FlashcardDeck | null;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "study" | "list";
}

export interface FlashcardItem {
  id: string;
  studyBuddyId: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  masteryLevel: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}

export function FlashcardsStudyModal({
  deck,
  isOpen,
  onClose,
  initialMode = "study",
}: FlashcardsStudyModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [reviewedInSession, setReviewedInSession] = React.useState<number>(0);
  const [isFinished, setIsFinished] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"study" | "list">(initialMode);
  const [revealedCardIds, setRevealedCardIds] = React.useState<Record<string, boolean>>({});

  const { reviewCard, isReviewing } = useFlashcardDecks();

  // Reset state when a new deck is opened
  const lastDeckIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (isOpen && deck?.studyBuddyId && deck.studyBuddyId !== lastDeckIdRef.current) {
      lastDeckIdRef.current = deck.studyBuddyId;
      setCurrentIndex(0);
      setIsFlipped(false);
      setReviewedInSession(0);
      setIsFinished(false);
      setViewMode(initialMode);
      setRevealedCardIds({});
    }
  }, [isOpen, deck?.studyBuddyId, initialMode]);

  // Fetch real cards for this deck
  const { data: rawData, isLoading } = useQuery<FlashcardItem[] | { flashcards: FlashcardItem[] }>({
    queryKey: ["flashcards", deck?.studyBuddyId],
    queryFn: () => api.get(`/learning/flashcards/${deck?.studyBuddyId}`),
    enabled: isOpen && !!deck?.studyBuddyId,
  });

  const cards: FlashcardItem[] = React.useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (Array.isArray((rawData as { flashcards?: FlashcardItem[] }).flashcards)) {
      return (rawData as { flashcards: FlashcardItem[] }).flashcards;
    }
    return [];
  }, [rawData]);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    if (currentIndex + 1 < totalCards) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJumpToCard = (index: number) => {
    if (index >= 0 && index < totalCards) {
      setIsFlipped(false);
      setIsFinished(false);
      setCurrentIndex(index);
    }
  };

  const handleRate = async (mastery: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return;

    try {
      await reviewCard({
        cardId: currentCard.id,
        mastery,
      });
      setReviewedInSession((prev) => prev + 1);
    } catch {
      // Continue locally even if network hiccups
    }

    if (currentIndex + 1 < totalCards) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setReviewedInSession(0);
  };

  const toggleRevealCard = (id: string) => {
    setRevealedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl bg-[#FAFBF9] border border-[#E5EAE7] shadow-2xl font-sans max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0D382B] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300">
              FLASHCARD DECK · {totalCards} {totalCards === 1 ? "CARD" : "CARDS"}
            </span>
            <DialogTitle className="text-base sm:text-lg font-serif font-bold text-white tracking-tight mt-0.5">
              {deck?.title || "Study Session"}
            </DialogTitle>
          </div>

          {/* Mode Switcher Tabs */}
          {totalCards > 0 && (
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => {
                  setViewMode("study");
                  setIsFinished(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "study"
                    ? "bg-white text-[#0D382B] shadow-xs"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                Practice Runner
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "list"
                    ? "bg-white text-[#0D382B] shadow-xs"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                All Cards ({totalCards})
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading all {deck?.totalCards || ""} flashcards...</p>
            </div>
          ) : totalCards === 0 ? (
            <div className="py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-[#0D382B] flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No cards in this deck yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-5">
                Generate flashcards using Folio AI or upload study materials to create cards automatically.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#0D382B] text-white text-xs font-bold px-5 py-2.5 shadow-xs"
              >
                Close Runner
              </button>
            </div>
          ) : viewMode === "list" ? (
            /* ALL CARDS (LIST VIEW) - ACCESS ALL GENERATED FLASHCARDS */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">
                  Showing all <span className="font-bold text-slate-900">{totalCards}</span> flashcards in this deck
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = Object.keys(revealedCardIds).length === totalCards &&
                      Object.values(revealedCardIds).every(Boolean);
                    if (allOpen) {
                      setRevealedCardIds({});
                    } else {
                      const all: Record<string, boolean> = {};
                      cards.forEach((c) => (all[c.id] = true));
                      setRevealedCardIds(all);
                    }
                  }}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Toggle All Answers</span>
                </button>
              </div>

              <div className="space-y-3">
                {cards.map((card, idx) => {
                  const isRevealed = !!revealedCardIds[card.id];
                  return (
                    <div
                      key={card.id || idx}
                      className="rounded-2xl border border-[#E5EAE7] bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all space-y-3"
                    >
                      {/* Top Meta Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#E8F2EC] text-[#0D382B] text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {card.difficulty || "medium"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleRevealCard(card.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors"
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Hide Answer</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Reveal Answer</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleJumpToCard(idx);
                              setViewMode("study");
                            }}
                            className="text-[11px] font-bold text-white bg-[#0D382B] hover:bg-[#07241C] px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Practice
                          </button>
                        </div>
                      </div>

                      {/* Question */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                          Question
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                          {card.question}
                        </p>
                      </div>

                      {/* Answer (collapsible or revealed) */}
                      {isRevealed && (
                        <div className="pt-2 border-t border-slate-100 bg-[#FAFBF8] -mx-4.5 -mb-4.5 p-4 rounded-b-2xl border-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                            Answer
                          </span>
                          <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
                            {card.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : isFinished ? (
            /* COMPLETION SCREEN */
            <div className="py-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <Image
                  src="/images/folio.png"
                  alt="Folio avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Session Complete!
              </span>

              <h3 className="font-serif text-xl font-bold text-slate-900 tracking-tight mt-1">
                Splendid Effort!
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mt-1 mb-6">
                You reviewed all {totalCards} cards in this deck. You can review again or inspect every card in the deck list.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2 text-xs font-bold transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Review Again</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#0D382B] border border-[#CDE3D5] px-5 py-2 text-xs font-bold transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View All Cards</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0D382B] hover:bg-[#07241C] text-white px-5 py-2 text-xs font-bold transition-all shadow-xs"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE FLASHCARD STUDY RUNNER */
            <div className="space-y-4">
              {/* Card Navigation & Pill Selector */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Card {currentIndex + 1} of {totalCards}
                </span>

                {/* Quick Jump Number Track */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-xs py-1">
                  {cards.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleJumpToCard(i)}
                      className={`h-6 min-w-[24px] px-1 rounded-md text-[11px] font-bold transition-all ${
                        currentIndex === i
                          ? "bg-[#0D382B] text-white shadow-2xs scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                />
              </div>

              {/* 3D-Style Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative min-h-[220px] sm:min-h-[250px] rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 border shadow-xs select-none ${
                  isFlipped
                    ? "bg-[#0D382B] text-white border-emerald-900"
                    : "bg-white text-slate-900 border-[#E5EAE7] hover:border-emerald-400"
                }`}
              >
                {/* Top Card Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      isFlipped
                        ? "bg-white/15 text-emerald-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isFlipped ? "Answer" : "Question"}
                  </span>

                  <span
                    className={`text-[10px] font-medium flex items-center gap-1 ${
                      isFlipped ? "text-emerald-300/70" : "text-slate-400"
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Click to flip</span>
                  </span>
                </div>

                {/* Card Content Text */}
                <div className="my-auto py-4 text-center">
                  <p
                    className={`text-sm sm:text-base font-semibold leading-relaxed ${
                      isFlipped ? "text-emerald-50" : "text-slate-800"
                    }`}
                  >
                    {isFlipped ? currentCard?.answer : currentCard?.question}
                  </p>
                </div>

                {/* Bottom hint */}
                <div className="text-center pt-2">
                  <span
                    className={`text-[11px] font-medium ${
                      isFlipped ? "text-emerald-300/70" : "text-slate-400"
                    }`}
                  >
                    {isFlipped
                      ? "Rate recall or click Next to advance"
                      : "Think about the answer, then click or press Show Answer"}
                  </span>
                </div>
              </div>

              {/* Always-Accessible Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {!isFlipped ? (
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0D382B] hover:bg-[#07241C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Show Answer</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                ) : (
                  <div className="flex-1 grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("again")}
                      className="flex flex-col items-center py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-all"
                    >
                      <span>Again</span>
                      <span className="text-[9px] text-rose-500 font-normal">&lt;10m</span>
                    </button>
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("hard")}
                      className="flex flex-col items-center py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-bold transition-all"
                    >
                      <span>Hard</span>
                      <span className="text-[9px] text-amber-500 font-normal">1d</span>
                    </button>
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("good")}
                      className="flex flex-col items-center py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition-all"
                    >
                      <span>Good</span>
                      <span className="text-[9px] text-emerald-600 font-normal">3d</span>
                    </button>
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("easy")}
                      className="flex flex-col items-center py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-[11px] font-bold transition-all"
                    >
                      <span>Easy</span>
                      <span className="text-[9px] text-sky-500 font-normal">7d</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                >
                  <span>{currentIndex + 1 < totalCards ? "Next" : "Finish"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
