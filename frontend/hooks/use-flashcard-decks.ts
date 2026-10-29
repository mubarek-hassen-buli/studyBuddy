"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export interface FlashcardOverview {
  totalCards: number;
  totalDecks: number;
  dueToday: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  reviewedToday: number;
  retentionRate: number;
}

export interface FlashcardDeck {
  id: string;
  studyBuddyId: string;
  title: string;
  subject: string;
  description?: string;
  totalCards: number;
  masteredCount: number;
  dueCount: number;
  masteryPercentage: number;
  lastReviewedAt: string | null;
  createdAt: string;
}

const defaultOverview: FlashcardOverview = {
  totalCards: 0,
  totalDecks: 0,
  dueToday: 0,
  masteredCount: 0,
  learningCount: 0,
  newCount: 0,
  reviewedToday: 0,
  retentionRate: 0,
};

export function useFlashcardDecks() {
  const queryClient = useQueryClient();

  // 1. Overview metrics
  const overviewQuery = useQuery<FlashcardOverview>({
    queryKey: ["flashcards", "overview"],
    queryFn: () => api.get("/learning/flashcards/overview"),
    refetchOnWindowFocus: true,
  });

  // 2. Decks list
  const decksQuery = useQuery<FlashcardDeck[]>({
    queryKey: ["flashcards", "decks"],
    queryFn: () => api.get("/learning/flashcards/decks"),
    refetchOnWindowFocus: true,
  });

  // 3. Review Card Mutation
  const reviewCardMutation = useMutation({
    mutationFn: ({
      cardId,
      mastery,
      masteryLevel,
    }: {
      cardId: string;
      mastery?: "again" | "hard" | "good" | "easy";
      masteryLevel?: number;
    }) => api.post(`/learning/flashcards/review/${cardId}`, { mastery, masteryLevel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["flashcards", "decks"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", "daily-goals"] });
      queryClient.invalidateQueries({ queryKey: ["studybuddy", "recent-activity"] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to update flashcard review.");
    },
  });

  // 4. Create Flashcard Deck Mutation
  const createDeckMutation = useMutation({
    mutationFn: async ({
      topic,
      count = 5,
      studyBuddyId,
    }: {
      topic: string;
      count?: number;
      studyBuddyId?: string | null;
    }) => {
      const res = await api.post("/learning/flashcards/create", { topic, count, studyBuddyId });
      return res as { flashcards: any[]; deckId: string; count: number };
    },
    onSuccess: (data) => {
      const count = data?.count || data?.flashcards?.length || 0;
      toast.success(`Generated ${count} flashcard${count === 1 ? "" : "s"} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["flashcards", "decks"] });
      queryClient.invalidateQueries({ queryKey: ["flashcards", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["buddies"] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to generate flashcards.");
    },
  });

  return {
    overview: overviewQuery.data || defaultOverview,
    decks: Array.isArray(decksQuery.data) ? decksQuery.data : [],
    isLoading: overviewQuery.isLoading || decksQuery.isLoading,
    reviewCard: reviewCardMutation.mutateAsync,
    isReviewing: reviewCardMutation.isPending,
    createDeck: createDeckMutation.mutateAsync,
    isCreatingDeck: createDeckMutation.isPending,
    refetch: () => {
      overviewQuery.refetch();
      decksQuery.refetch();
    },
  };
}
