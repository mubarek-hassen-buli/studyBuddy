"use client";

import * as React from "react";
import { QuizzesHero } from "@/components/dashboard/quizzes/quizzes-hero";
import { QuizzesGrid, QuizItem } from "@/components/dashboard/quizzes/quizzes-grid";
import { QuizzesSidebar } from "@/components/dashboard/quizzes/quizzes-sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, CheckCircle2, RotateCcw } from "lucide-react";

export default function QuizzesPage() {
  const [activeQuiz, setActiveQuiz] = React.useState<QuizItem | null>(null);
  const [createQuizOpen, setCreateQuizOpen] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [quizScore, setQuizScore] = React.useState(0);
  const [quizFinished, setQuizFinished] = React.useState(false);

  const sampleQuestions = [
    {
      question: "Which organelle is considered the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
      correct: 1,
    },
    {
      question: "What is the primary function of chlorophyll in plant cells?",
      options: [
        "Absorbing light energy for photosynthesis",
        "Storing water in vacuole",
        "Cellular respiration",
        "Protein synthesis",
      ],
      correct: 0,
    },
    {
      question: "Which molecule provides immediate energy for cellular processes?",
      options: ["DNA", "ATP", "Glucose", "Lipid"],
      correct: 1,
    },
  ];

  const handleStartQuiz = (quiz: QuizItem) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === sampleQuestions[currentQuestionIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hero (Headline + Bust + 4 Stat Pills) + 9-Slot Quizzes Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <QuizzesHero
            onChallengeClick={() => {
              if (activeQuiz) return;
              handleStartQuiz({
                id: "daily-challenge",
                title: "Daily Challenge Quiz",
                category: "General Knowledge",
                questionCount: 3,
                durationMinutes: 5,
                progressPercent: 0,
                icon: Sparkles,
              });
            }}
          />

          <QuizzesGrid
            onStartQuiz={handleStartQuiz}
            onCreateQuizClick={() => setCreateQuizOpen(true)}
          />
        </div>

        {/* Right Column: Quick Actions + Recent Quizzes + Bottom Motivational Card */}
        <div className="lg:col-span-4 xl:col-span-3">
          <QuizzesSidebar
            onGenerateQuizClick={() => setCreateQuizOpen(true)}
            onCreateFlashcardsClick={() => {}}
            onRandomQuizClick={() => {
              handleStartQuiz({
                id: "random-quiz",
                title: "Random Challenge: Science & History",
                category: "General Science",
                questionCount: 3,
                durationMinutes: 4,
                progressPercent: 0,
                icon: Sparkles,
              });
            }}
          />
        </div>
      </div>

      {/* Interactive Quiz Dialog */}
      <Dialog open={!!activeQuiz} onOpenChange={(open) => !open && setActiveQuiz(null)}>
        <DialogContent className="max-w-lg bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-xl font-sans">
          <DialogHeader>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">
              {activeQuiz?.category || "QUIZ SESSION"}
            </span>
            <DialogTitle className="font-serif text-2xl font-bold text-[#11231B] mt-0.5">
              {activeQuiz?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Test your knowledge with Folio interactive practice.
            </DialogDescription>
          </DialogHeader>

          {!quizFinished ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>
                  Question {currentQuestionIndex + 1} of {sampleQuestions.length}
                </span>
                <span>Score: {quizScore}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / sampleQuestions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <h4 className="text-base font-bold text-[#11231B] pt-2">
                {sampleQuestions[currentQuestionIndex].question}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {sampleQuestions[currentQuestionIndex].options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === sampleQuestions[currentQuestionIndex].correct;
                  let btnStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                    } else if (isSelected) {
                      btnStyle = "border-rose-400 bg-rose-50 text-rose-800";
                    } else {
                      btnStyle = "border-slate-100 opacity-50 text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectAnswer(i)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              {selectedAnswer !== null && (
                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1.5 bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <span>
                      {currentQuestionIndex < sampleQuestions.length - 1
                        ? "Next Question"
                        : "Finish Quiz"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-50 text-[#0D382B] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#11231B]">
                  Quiz Completed!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You scored {quizScore} out of {sampleQuestions.length} (
                  {Math.round((quizScore / sampleQuestions.length) * 100)}%)
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleStartQuiz(activeQuiz!)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Quiz Dialog */}
      <Dialog open={createQuizOpen} onOpenChange={setCreateQuizOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-xl font-sans">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold text-[#11231B]">
              Create New Quiz
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Generate a custom quiz from your notes or documents using Folio AI.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCreateQuizOpen(false);
            }}
            className="space-y-4 mt-2"
          >
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="e.g. World War II Key Battles"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Subject or Category
              </label>
              <input
                type="text"
                placeholder="e.g. History"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateQuizOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Create with AI
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
