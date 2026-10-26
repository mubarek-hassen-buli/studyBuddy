"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export interface DashboardGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  percentage: number;
}

export interface DailyGoalsResponse {
  date: string;
  completedGoalsCount: number;
  totalGoalsCount: number;
  allCompleted: boolean;
  goals: DashboardGoal[];
}

const defaultGoals: DailyGoalsResponse = {
  date: new Date().toISOString().split("T")[0],
  completedGoalsCount: 0,
  totalGoalsCount: 4,
  allCompleted: false,
  goals: [
    {
      id: "study_time",
      title: "Daily Study Target",
      target: 30,
      current: 0,
      unit: "mins",
      completed: false,
      percentage: 0,
    },
    {
      id: "quizzes",
      title: "Daily Quiz Challenge",
      target: 1,
      current: 0,
      unit: "quiz",
      completed: false,
      percentage: 0,
    },
    {
      id: "flashcards",
      title: "Flashcard Revision",
      target: 10,
      current: 0,
      unit: "cards",
      completed: false,
      percentage: 0,
    },
    {
      id: "chat_questions",
      title: "Curiosity Inquiries",
      target: 2,
      current: 0,
      unit: "queries",
      completed: false,
      percentage: 0,
    },
  ],
};

export function useDashboardGoals() {
  const { data, isLoading, error, refetch } = useQuery<DailyGoalsResponse>({
    queryKey: ["sessions", "daily-goals"],
    queryFn: () => api.get("/sessions/daily-goals"),
    refetchOnWindowFocus: true,
  });

  return {
    goalsData: data || defaultGoals,
    isLoading,
    error,
    refetch,
  };
}
