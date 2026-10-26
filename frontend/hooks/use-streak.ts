"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export interface StreakData {
  streakDays: number;
  longestStreak: number;
  isActiveToday: boolean;
  lastActiveDate?: string;
}

const defaultStreak: StreakData = {
  streakDays: 0,
  longestStreak: 0,
  isActiveToday: false,
};

export function useStreak() {
  const { data, isLoading, error } = useQuery<StreakData>({
    queryKey: ["sessions", "streak"],
    queryFn: () => api.get("/sessions/streak"),
    refetchOnWindowFocus: true,
  });

  return {
    streak: data || defaultStreak,
    isLoading,
    error,
  };
}
