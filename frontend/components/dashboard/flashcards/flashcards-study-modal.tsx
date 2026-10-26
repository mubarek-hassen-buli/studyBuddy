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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useFlashcardDecks, FlashcardDeck } from "@/hooks/use-flashcard-decks";
import Image from "next/image";

interface FlashcardsStudyModalProps {
  deck: FlashcardDeck | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FlashcardItem {
  id: string;
  studyBuddyId: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  masteryLevel: number;
  lastReviewedAt?: string;
}

export function FlashcardsStudyModal({
  deck,
  isOpen,
  onClose,
}: FlashcardsStudyModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [reviewedInSession, setReviewedInSession] = React.useState<number>(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const { reviewCard, isReviewing } = useFlashcardDecks();

  // Reset state when deck changes
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setReviewedInSession(0);
      setIsFinished(false);
    }
  }, [isOpen, deck?.id]);

  // Fetch real cards for this deck
  const { data: cards = [], isLoading } = useQuery<FlashcardItem[]>({
    queryKey: ["flashcards", deck?.studyBuddyId],
    queryFn: () => api.get(`/learning/flashcards/${deck?.studyBuddyId}`),
    enabled: isOpen && !!deck?.studyBuddyId,
  });

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const handleRate = async (mastery: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return;

    await reviewCard({
      cardId: currentCard.id,
      mastery,
    });

    setReviewedInSession((prev) => prev + 1);

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
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-3xl bg-[#FAFBF9] border border-[#E5EAE7] shadow-2xl">
        {/* Header */}
        <div className="bg-[#0D382B] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300">
              FLASHCARD STUDY
            </span>
            <DialogTitle className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              {deck?.title || "Study Session"}
            </DialogTitle>
          </div>

          {totalCards > 0 && !isFinished && (
            <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-white/15">
              Card {currentIndex + 1} of {totalCards}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading your flashcards...</p>
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
          ) : isFinished ? (
            /* Completion Screen */
            <div className="py-8 text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <Image
                  src="/images/folio.png"
                  alt="Folio avatar"
                  width={96}
                  height={96}
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
                You reviewed all {reviewedInSession} card{reviewedInSession === 1 ? "" : "s"} in this deck. Spaced repetition schedules have been updated for maximum retention.
              </p>

              <div className="flex items-center justify-center gap-3">
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
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0D382B] hover:bg-[#07241C] text-white px-5 py-2 text-xs font-bold transition-all shadow-xs"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Flashcard */
            <div className="space-y-5">
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
                className={`relative min-h-[220px] sm:min-h-[240px] rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 border shadow-xs select-none ${
                  isFlipped
                    ? "bg-[#0D382B] text-white border-emerald-900"
                    : "bg-white text-slate-900 border-[#E5EAE7] hover:border-emerald-300"
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
                    <span>Click card to flip</span>
                  </span>
                </div>

                {/* Card Content Text */}
                <div className="my-auto py-3 text-center">
                  <p
                    className={`text-sm sm:text-base font-semibold leading-relaxed ${
                      isFlipped ? "text-emerald-50" : "text-slate-800"
                    }`}
                  >
                    {isFlipped ? currentCard.answer : currentCard.question}
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
                      ? "Rate your recall below to schedule your next review"
                      : "Think about the answer, then click to check"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Again, Hard, Good, Easy */}
              <div className="pt-2">
                {isFlipped ? (
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("again")}
                      className="flex flex-col items-center py-2 px-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-xs font-extrabold">Again</span>
                      <span className="text-[10px] text-rose-500 font-medium mt-0.5">&lt;10 min</span>
                    </button>

                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("hard")}
                      className="flex flex-col items-center py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-xs font-extrabold">Hard</span>
                      <span className="text-[10px] text-amber-500 font-medium mt-0.5">1 day</span>
                    </button>

                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("good")}
                      className="flex flex-col items-center py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-xs font-extrabold">Good</span>
                      <span className="text-[10px] text-emerald-600 font-medium mt-0.5">3 days</span>
                    </button>

                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleRate("easy")}
                      className="flex flex-col items-center py-2 px-1 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-xs font-extrabold">Easy</span>
                      <span className="text-[10px] text-sky-500 font-medium mt-0.5">7 days</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="w-full py-2.5 rounded-xl bg-[#0D382B] hover:bg-[#07241C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Show Answer</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
