"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

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
  });

  const generateQuiz = useMutation({
    mutationFn: (topic?: string) => api.post("/learning/quiz", { studyBuddyId: buddyId, topic }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", buddyId] });
    },
  });

  return {
    summaries: {
      data: summaries.data || [],
      isLoading: summaries.isLoading,
      generate: generateSummary,
    },
    flashcards: {
      data: (flashcards.data as any)?.flashcards || [],
      isLoading: flashcards.isLoading,
      generate: generateFlashcards,
    },
    quizzes: {
      data: (quizzes.data as any)?.quizzes || [],
      isLoading: quizzes.isLoading,
      generate: generateQuiz,
    },
  };
}
