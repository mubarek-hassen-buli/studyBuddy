"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export interface ProgressTimelinePoint {
  day: string;
  date: string;
  minutes: number;
  sessions: number;
}

export interface ProgressMetricsResponse {
  period: string;
  totalMinutes: number;
  avgDailyMinutes: number;
  timeline: ProgressTimelinePoint[];
}

export function useProgressMetrics(days: 7 | 30 = 7) {
  const { data, isLoading, error } = useQuery<ProgressMetricsResponse>({
    queryKey: ["sessions", "metrics", days],
    queryFn: () => api.get(`/sessions/metrics?days=${days}`),
    refetchOnWindowFocus: true,
  });

  return {
    metrics: data,
    isLoading,
    error,
  };
}
