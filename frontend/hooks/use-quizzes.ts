"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  title: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export interface QuizzesOverview {
  quizzesTaken: number;
  averageScore: number;
  bestScore: number;
  totalQuestions: number;
  recentAttempts: QuizAttemptRecord[];
}

export interface UserQuiz {
  id: string;
  studyBuddyId: string;
  studyBuddyName?: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  questions: QuizQuestion[];
  createdAt: string;
  lastAttempt?: {
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
  } | null;
  bestScore: number | null;
}

const defaultOverview: QuizzesOverview = {
  quizzesTaken: 0,
  averageScore: 0,
  bestScore: 0,
  totalQuestions: 0,
  recentAttempts: [],
};

interface CreateQuizParams {
  topic: string;
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
  studyBuddyId?: string | null;
}

interface SubmitAttemptParams {
  quizId: string;
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  percentage: number;
}

export function useQuizzes() {
  const queryClient = useQueryClient();

  // 1. Quizzes Overview
  const overviewQuery = useQuery<QuizzesOverview>({
    queryKey: ["quizzes", "overview"],
    queryFn: () => api.get("/learning/quizzes/overview"),
    refetchOnWindowFocus: true,
  });

  // 2. All User Quizzes
  const quizzesQuery = useQuery<UserQuiz[]>({
    queryKey: ["quizzes", "all"],
    queryFn: () => api.get("/learning/quizzes/all"),
    refetchOnWindowFocus: true,
  });

  // 3. Create Quiz Mutation
  const createQuizMutation = useMutation({
    mutationFn: (params: CreateQuizParams) => api.post("/learning/quizzes/create", params),
    onSuccess: () => {
      toast.success("Quiz generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["quizzes", "all"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["buddies"] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to generate quiz. Please try again.");
    },
  });

  // 4. Submit Attempt Mutation
  const submitAttemptMutation = useMutation({
    mutationFn: ({ quizId, answers, score, totalQuestions, percentage }: SubmitAttemptParams) =>
      api.post(`/learning/quizzes/${quizId}/attempt`, {
        answers,
        score,
        totalQuestions,
        percentage,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes", "all"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", "daily-goals"] });
      queryClient.invalidateQueries({ queryKey: ["studybuddy", "recent-activity"] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to save quiz attempt.");
    },
  });

  return {
    overview: overviewQuery.data || defaultOverview,
    quizzes: Array.isArray(quizzesQuery.data) ? quizzesQuery.data : [],
    isLoading: overviewQuery.isLoading || quizzesQuery.isLoading,
    createQuiz: createQuizMutation.mutateAsync,
    isCreating: createQuizMutation.isPending,
    submitAttempt: submitAttemptMutation.mutateAsync,
    isSubmitting: submitAttemptMutation.isPending,
    refetch: () => {
      overviewQuery.refetch();
      quizzesQuery.refetch();
    },
  };
}
