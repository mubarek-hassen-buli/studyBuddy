"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Trophy, HelpCircle, Loader2 } from "lucide-react";
import { useQuizzes, UserQuiz } from "@/hooks/use-quizzes";
import Image from "next/image";

interface QuizSessionModalProps {
  quiz: UserQuiz | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizSessionModal({ quiz, isOpen, onClose }: QuizSessionModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const { submitAttempt, isSubmitting } = useQuizzes();

  // Reset state on open or quiz change
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedOption(null);
      setAnswers({});
      setScore(0);
      setIsFinished(false);
    }
  }, [isOpen, quiz?.id]);

  if (!quiz) return null;

  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null || !currentQ) return;

    setSelectedOption(option);
    const isCorrect = option.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => ({
      ...prev,
      [String(currentIndex)]: option,
    }));
  };

  const handleNext = async () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate final score
      const finalScore = score + (selectedOption && currentQ && selectedOption.trim().toLowerCase() === currentQ.answer.trim().toLowerCase() ? 0 : 0);
      const percentage = totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;

      try {
        await submitAttempt({
          quizId: quiz.id,
          answers,
          score: finalScore,
          totalQuestions,
          percentage,
        });
      } catch {
        // toast handled in hook
      }

      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setScore(0);
    setIsFinished(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-[#FAFBF9] rounded-3xl p-0 overflow-hidden border border-[#E5EAE7] shadow-2xl font-sans">
        {/* Modal Header */}
        <div className="bg-[#0D382B] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300">
              {quiz.topic || "QUIZ PRACTICE"}
            </span>
            <DialogTitle className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              {quiz.title}
            </DialogTitle>
          </div>

          {totalQuestions > 0 && !isFinished && (
            <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-white/15">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {totalQuestions === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-500">
                This quiz does not have any questions yet.
              </p>
            </div>
          ) : !isFinished && currentQ ? (
            <div className="space-y-4">
              {/* Progress Bar & Current Score */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Progress</span>
                <span>Current Score: {score}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5EAE7] shadow-2xs mt-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800 block mb-1">
                  QUESTION {currentIndex + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#11231B] leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = opt.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();

                  let style = "border-[#E5EAE7] bg-white hover:border-emerald-300 hover:bg-[#F7FAF8] text-slate-800";

                  if (selectedOption !== null) {
                    if (isCorrect) {
                      style = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs";
                    } else if (isSelected) {
                      style = "border-rose-400 bg-rose-50 text-rose-900 font-bold";
                    } else {
                      style = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-black/5 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {selectedOption !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {selectedOption !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Note when Answered */}
              {selectedOption !== null && currentQ.explanation && (
                <div className="bg-[#E8F2EC] rounded-xl p-3 border border-[#CDE3D5] text-xs text-[#0D382B] leading-relaxed">
                  <span className="font-bold">Explanation: </span>
                  {currentQ.explanation}
                </div>
              )}

              {/* Next/Finish Button */}
              {selectedOption !== null && (
                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Results...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {currentIndex < totalQuestions - 1 ? "Next Question" : "Finish & View Score"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Finished Summary Card */
            <div className="py-6 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <Image
                  src="/images/folio.png"
                  alt="Folio character"
                  fill
                  className="object-contain"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">
                  QUIZ COMPLETED
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#11231B] mt-0.5">
                  Great effort!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You scored <span className="font-bold text-slate-900">{score}</span> out of{" "}
                  <span className="font-bold text-slate-900">{totalQuestions}</span> (
                  <span className="font-bold text-emerald-700">
                    {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                  </span>
                  )
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
