"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap, Brain, ChevronRight, ChevronLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api/client";

interface Flashcard {
  question: string;
  answer: string;
}

export function FlashcardsInterface({ buddyId }: { buddyId: string }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const generateFlashcards = async () => {
    setIsLoading(true);
    setFlashcards([]);
    setIsFinished(false);
    setCurrentIndex(0);
    try {
      const response = await api.post("/learning/flashcards", { studyBuddyId: buddyId, count: 10 }) as { flashcards: Flashcard[] };
      setFlashcards(response.flashcards);
    } catch (error) {
      console.error("Flashcards error:", error);
      alert("Failed to generate flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
      }
    }, 150);
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 150);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 relative">
           <Loader2 className="w-10 h-10 animate-spin text-primary" />
           <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping opacity-20" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Generating Cards...</h2>
        <p className="text-slate-500 font-medium max-w-xs mt-2">AI is identifying key facts and formulating active recall questions.</p>
      </div>
    );
  }

  if (flashcards.length === 0 || isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
           <Brain className="w-10 h-10 text-primary" />
        </div>
        <div className="max-w-md">
           <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
             {isFinished ? "Mastery Complete!" : "Ready to Train Your Brain?"}
           </h2>
           <p className="text-slate-500 font-medium leading-relaxed">
             {isFinished 
               ? "You've reviewed all cards in this session. Re-run to strengthen your neural connections!" 
               : "We'll generate 10 unique flashcards based on your uploaded documents for active recall training."}
           </p>
        </div>
        <Button 
          size="lg" 
          onClick={generateFlashcards} 
          className="rounded-full px-12 py-8 text-xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          {isFinished ? "Start New Session" : "Generate 10 Flashcards"}
        </Button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Recall Session</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Card {currentIndex + 1} of {flashcards.length}</h3>
           </div>
           <p className="text-sm font-black text-primary">{Math.round(progress)}%</p>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-0.5 shadow-inner">
           <div 
            className="h-full bg-primary rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]" 
            style={{ width: `${progress}%` }}
           />
        </div>
      </div>

      {/* Card Wrapper */}
      <div 
        className="relative perspective-1000 group cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full min-h-[400px] transition-all duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
          
          {/* Front: Question */}
          <Card className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-[40px] shadow-2xl flex items-center justify-center p-12 overflow-hidden border-b-[8px] border-b-slate-200">
             <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />
             <div className="text-center space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-1.5 rounded-full">Question</span>
                <p className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                   {currentCard.question}
                </p>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest pt-8 transition-opacity duration-300 group-hover:opacity-100 opacity-50">
                   Click card to reveal answer
                </p>
             </div>
          </Card>

          {/* Back: Answer */}
          <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-slate-800 rounded-[40px] shadow-2xl flex items-center justify-center p-12 overflow-hidden border-b-[8px] border-b-black">
             <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
             <div className="text-center space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 bg-green-400/10 px-4 py-1.5 rounded-full">Answer</span>
                <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed tracking-tight">
                   {currentCard.answer}
                </p>
                <div className="pt-8 flex items-center justify-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                   <RotateCcw className="w-3 h-3" />
                   Click to see question
                </div>
             </div>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
         <Button 
          variant="ghost" 
          onClick={prevCard} 
          disabled={currentIndex === 0}
          className="rounded-2xl h-16 px-6 font-black text-slate-400 hover:text-primary transition-all gap-2"
         >
            <ChevronLeft className="w-5 h-5" />
            Previous
         </Button>

         <div className="flex gap-4">
            <Button 
              size="lg" 
              onClick={nextCard}
              className="rounded-full px-12 h-16 text-lg font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2"
            >
              {currentIndex < flashcards.length - 1 ? (
                <>
                  Got it! <ChevronRight className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  Finish Session <CheckCircle2 className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
         </div>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
