"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, GraduationCap, CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCw } from "lucide-react";
import { useLearningContent } from "@/hooks/use-learning-content";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export function QuizInterface({ buddyId }: { buddyId: string }) {
  const { quizzes } = useLearningContent(buddyId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Use the most recent quiz questions
  const questions = (quizzes.data[0]?.questions as Question[]) || [];

  const generateQuiz = async () => {
    setIsFinished(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    try {
      await quizzes.generate.mutateAsync(undefined);
    } catch (error) {
      console.error("Quiz error:", error);
      alert("Failed to generate quiz.");
    }
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const submitAnswer = () => {
    if (!selectedOption || isAnswered) return;
    
    setIsAnswered(true);
    if (selectedOption === questions[currentIndex].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (quizzes.isLoading || quizzes.generate.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
           <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Preparing Your Exam...</h2>
        <p className="text-slate-500 font-medium max-w-xs mt-2">AI is drafting questions and distractor options based on your documents.</p>
      </div>
    );
  }

  if (questions.length === 0 || isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
        <div className={`w-24 h-24 rounded-3xl mb-8 flex items-center justify-center ${isFinished ? "bg-green-50 text-green-500" : "bg-primary/10 text-primary"}`}>
           {isFinished ? <Trophy className="w-12 h-12" /> : <GraduationCap className="w-12 h-12" />}
        </div>
        
        {isFinished ? (
          <div className="space-y-4">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Quiz Complete!</h2>
             <div className="flex flex-col items-center gap-2">
                <p className="text-6xl font-black text-primary">{Math.round((score / questions.length) * 100)}%</p>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Score: {score} / {questions.length}</p>
             </div>
             <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed pt-4">
                Excellent work! Use these results to identify gaps in your knowledge and revisit specific document sections.
             </p>
             <div className="pt-8">
                <Button 
                  size="lg" 
                  onClick={generateQuiz} 
                  className="rounded-full px-12 py-8 text-xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-3"
                >
                  <RefreshCw className="w-6 h-6" />
                  Try Another Quiz
                </Button>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ready to Test Your Knowledge?</h2>
             <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
               We'll generate a 10-question multiple-choice quiz to challenge your understanding of the material.
             </p>
             <div className="pt-8">
                <Button 
                  size="lg" 
                  onClick={generateQuiz} 
                  className="rounded-full px-12 py-8 text-xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Start Assessment
                </Button>
             </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Progress */}
      <div className="flex items-center gap-6">
         <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-0.5 shadow-inner">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]" 
              style={{ width: `${progress}%` }}
            />
         </div>
         <span className="text-sm font-black text-slate-400 min-w-[60px]">{currentIndex + 1} of {questions.length}</span>
      </div>

      <Card className="bg-white border-2 border-slate-100 rounded-[40px] shadow-2xl overflow-hidden border-b-[8px] border-b-slate-200">
        <CardHeader className="p-10 pb-6 text-center">
           <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-1.5 rounded-full mb-6">Question {currentIndex + 1}</span>
           <CardTitle className="text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
              {currentQuestion.question}
           </CardTitle>
        </CardHeader>
        <CardContent className="p-10 pt-4 space-y-4">
          <div className="grid gap-4">
            {currentQuestion.options.map((option, i) => {
              const isCorrect = i === currentQuestion.options.indexOf(currentQuestion.answer);
              const isSelected = selectedOption === option;
              
              let variantStyle = "bg-white border-slate-100 hover:border-primary/30 hover:bg-primary/5 text-slate-700";
              if (isSelected && !isAnswered) {
                variantStyle = "bg-primary/5 border-primary text-primary ring-4 ring-primary/5 scale-[1.02]";
              } else if (isAnswered) {
                if (isSelected && isCorrect) variantStyle = "bg-green-50 border-green-500 text-green-700 ring-4 ring-green-500/10 scale-[1.02]";
                else if (isSelected && !isCorrect) variantStyle = "bg-red-50 border-red-500 text-red-700 ring-4 ring-red-500/10 opacity-80";
                else if (isCorrect) variantStyle = "bg-green-50 border-green-500 text-green-700 opacity-90";
                else variantStyle = "bg-white border-slate-50 text-slate-300 opacity-40 grayscale";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                  className={`
                    w-full flex items-center justify-between p-6 rounded-[24px] border-2 transition-all duration-300 text-left font-bold text-lg
                    ${variantStyle}
                  `}
                >
                  <span className="flex-1 pr-4">{option}</span>
                  {isAnswered && (
                    <div className="shrink-0">
                      {isCorrect && (isSelected || !isSelected) && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                      {!isCorrect && isSelected && <XCircle className="w-6 h-6 text-red-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-8 flex items-center justify-center">
            {!isAnswered ? (
              <Button 
                size="lg" 
                onClick={submitAnswer} 
                disabled={!selectedOption}
                className="rounded-full px-16 h-16 text-xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={nextQuestion} 
                className="rounded-full px-16 h-16 text-xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2"
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pt-4">
         Questions are generated using the knowledge context from your sources.
      </p>
    </div>
  );
}
