"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export function useLearningContent(buddyId: string) {
  const queryClient = useQueryClient();

  const summaries = useQuery({
    queryKey: ["summaries", buddyId],
    queryFn: () => api.get(`/learning/summarize/${buddyId}`),
    enabled: !!buddyId,
  });

  const flashcards = useQuery({
    queryKey: ["flashcards", buddyId],
    queryFn: () => api.get(`/learning/flashcards/${buddyId}`),
    enabled: !!buddyId,
  });

  const quizzes = useQuery({
    queryKey: ["quizzes", buddyId],
    queryFn: () => api.get(`/learning/quiz/${buddyId}`),
    enabled: !!buddyId,
  });

  const generateSummary = useMutation({
    mutationFn: (type: string) => api.post("/learning/summarize", { studyBuddyId: buddyId, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["summaries", buddyId] });
    },
  });

  const generateFlashcards = useMutation({
    mutationFn: (count: number) => api.post("/learning/flashcards", { studyBuddyId: buddyId, count }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", buddyId] });
    },
    onError: (error: any) => {
      if (error.status === 403) {
        toast.error("Generation Limit Reached", {
          description: error.data?.message || "Flashcard limit reached on Free plan.",
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/dashboard/pricing",
          },
          duration: 6000,
        });
      } else {
        toast.error("Failed to generate flashcards. Please try again.");
      }
    }
  });

  const generateQuiz = useMutation({
    mutationFn: (topic?: string) => api.post("/learning/quiz", { studyBuddyId: buddyId, topic }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", buddyId] });
    },
    onError: (error: any) => {
      if (error.status === 403) {
        toast.error("Quiz Limit Reached", {
          description: error.data?.message || "Quiz limit reached on Free plan.",
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/dashboard/pricing",
          },
          duration: 6000,
        });
      } else {
        toast.error("Failed to generate quiz. Please try again.");
      }
    }
  });

  return {
    summaries: {
      data: Array.isArray(summaries.data) ? summaries.data : [],
      isLoading: summaries.isLoading,
      generate: generateSummary,
    },
    flashcards: {
      data: Array.isArray(flashcards.data) 
        ? flashcards.data 
        : (flashcards.data as any)?.flashcards || [],
      isLoading: flashcards.isLoading,
      generate: generateFlashcards,
    },
    quizzes: {
      data: Array.isArray(quizzes.data) 
        ? quizzes.data 
        : ((quizzes.data as any)?.quiz || (quizzes.data as any)?.quizzes || []),
      isLoading: quizzes.isLoading,
      generate: generateQuiz,
    },
  };
}
