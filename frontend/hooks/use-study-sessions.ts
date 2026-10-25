"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export interface StudyBuddySummary {
  id: string;
  name: string;
  subject?: string | null;
  description?: string | null;
  avatar?: string | null;
}

export interface StudySession {
  id: string;
  userId: string;
  studyBuddyId: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualDurationSeconds: number | null;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  targetResourceType?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  studyBuddy?: StudyBuddySummary;
}

export interface UpcomingSessionResponse {
  session: StudySession | null;
  isActive: boolean;
}

export interface CreateSessionInput {
  studyBuddyId: string;
  title: string;
  scheduledStart: string; // ISO string
  scheduledEnd: string;   // ISO string
  targetResourceType?: "chat" | "quiz" | "flashcard" | "summary" | "general";
  notes?: string;
}

export interface CompleteSessionInput {
  id: string;
  actualDurationSeconds: number;
  notes?: string;
}

export interface QuickLogInput {
  durationSeconds: number;
  studyBuddyId?: string;
  title?: string;
  notes?: string;
}

export function useUpcomingSession() {
  return useQuery<UpcomingSessionResponse>({
    queryKey: ["upcoming-session"],
    queryFn: () => api.get("/sessions/upcoming"),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refresh every minute for schedule updates
  });
}

export function useStudySessions() {
  return useQuery<StudySession[]>({
    queryKey: ["study-sessions"],
    queryFn: () => api.get("/sessions"),
  });
}

export function useStudySessionMutations() {
  const queryClient = useQueryClient();

  const invalidateSessionQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["upcoming-session"] });
    queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  const createSession = useMutation({
    mutationFn: (data: CreateSessionInput) => api.post("/sessions", data),
    onSuccess: () => invalidateSessionQueries(),
  });

  const startSession = useMutation({
    mutationFn: (id: string) => api.patch(`/sessions/${id}/start`),
    onSuccess: () => invalidateSessionQueries(),
  });

  const completeSession = useMutation({
    mutationFn: ({ id, actualDurationSeconds, notes }: CompleteSessionInput) =>
      api.post(`/sessions/${id}/complete`, { actualDurationSeconds, notes }),
    onSuccess: () => invalidateSessionQueries(),
  });

  const quickLogSession = useMutation({
    mutationFn: (data: QuickLogInput) => api.post("/sessions/quick-log", data),
    onSuccess: () => invalidateSessionQueries(),
  });

  const deleteSession = useMutation({
    mutationFn: (id: string) => api.delete(`/sessions/${id}`),
    onSuccess: () => invalidateSessionQueries(),
  });

  return {
    createSession,
    startSession,
    completeSession,
    quickLogSession,
    deleteSession,
  };
}
