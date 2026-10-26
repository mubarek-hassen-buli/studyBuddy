"use client";

import * as React from "react";
import { QuizzesHero } from "@/components/dashboard/quizzes/quizzes-hero";
import { QuizzesGrid } from "@/components/dashboard/quizzes/quizzes-grid";
import { QuizzesSidebar } from "@/components/dashboard/quizzes/quizzes-sidebar";
import { CreateQuizModal } from "@/components/dashboard/quizzes/create-quiz-modal";
import { QuizSessionModal } from "@/components/dashboard/quizzes/quiz-session-modal";
import { useQuizzes, UserQuiz } from "@/hooks/use-quizzes";

export default function QuizzesPage() {
  const [activeQuiz, setActiveQuiz] = React.useState<UserQuiz | null>(null);
  const [createQuizOpen, setCreateQuizOpen] = React.useState(false);

  const { quizzes } = useQuizzes();

  const handleStartQuiz = (quiz: UserQuiz) => {
    setActiveQuiz(quiz);
  };

  const handleRandomQuiz = () => {
    if (quizzes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quizzes.length);
      setActiveQuiz(quizzes[randomIndex]);
    } else {
      setCreateQuizOpen(true);
    }
  };

  const handleSelectAttempt = (quizId: string) => {
    const found = quizzes.find((q) => q.id === quizId);
    if (found) {
      setActiveQuiz(found);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hero + Quizzes Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <QuizzesHero
            onChallengeClick={handleRandomQuiz}
          />

          <QuizzesGrid
            onStartQuiz={handleStartQuiz}
            onCreateQuizClick={() => setCreateQuizOpen(true)}
          />
        </div>

        {/* Right Column: Quick Actions + Recent Attempts + Motivational Card */}
        <div className="lg:col-span-4 xl:col-span-3">
          <QuizzesSidebar
            onGenerateQuizClick={() => setCreateQuizOpen(true)}
            onCreateFlashcardsClick={() => {}}
            onRandomQuizClick={handleRandomQuiz}
            onSelectAttempt={handleSelectAttempt}
          />
        </div>
      </div>

      {/* Interactive Quiz Runner Modal */}
      <QuizSessionModal
        quiz={activeQuiz}
        isOpen={!!activeQuiz}
        onClose={() => setActiveQuiz(null)}
      />

      {/* AI Quiz Creation Modal */}
      <CreateQuizModal
        isOpen={createQuizOpen}
        onClose={() => setCreateQuizOpen(false)}
      />
    </div>
  );
}
