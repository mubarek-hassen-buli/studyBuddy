"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type DocumentBreakdownItem = {
  fileType: string;
  label: string;
  count: number;
  fill: string;
};

export type ActivityTimelineItem = {
  date: string;
  quizzes: number;
  flashcards: number;
};

export type RadialMetricItem = {
  name: string;
  label: string;
  value: number;
  fill: string;
};

export type DashboardStats = {
  totalBuddies: number;
  totalDocuments: number;
  avgQuizScore: number;
  endedProjects: number;
  runningProjects: number;
  pendingProjects: number;
  documentBreakdown: DocumentBreakdownItem[];
  activityTimeline: ActivityTimelineItem[];
  radialMetrics: RadialMetricItem[];
};

const defaultStats: DashboardStats = {
  totalBuddies: 0,
  totalDocuments: 0,
  avgQuizScore: 0,
  endedProjects: 0,
  runningProjects: 0,
  pendingProjects: 0,
  documentBreakdown: [
    { fileType: "pdf", label: "PDF Documents", count: 0, fill: "var(--color-pdf)" },
    { fileType: "docx", label: "Word Notes", count: 0, fill: "var(--color-docx)" },
    { fileType: "ppt", label: "Presentations", count: 0, fill: "var(--color-ppt)" },
    { fileType: "txt", label: "Markdown & Text", count: 0, fill: "var(--color-txt)" },
  ],
  activityTimeline: [],
  radialMetrics: [
    { name: "quiz", label: "Quiz Accuracy", value: 0, fill: "var(--color-quiz)" },
    { name: "coverage", label: "Syllabus Coverage", value: 0, fill: "var(--color-coverage)" },
    { name: "retention", label: "Concept Retention", value: 0, fill: "var(--color-retention)" },
    { name: "consistency", label: "Study Consistency", value: 0, fill: "var(--color-consistency)" },
  ],
};

export function useStats() {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["stats"],
    queryFn: () => api.get("/studybuddy/stats"),
    refetchOnWindowFocus: true,
  });

  return {
    stats: data || defaultStats,
    isLoading,
    error,
  };
}
