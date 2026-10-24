"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/studybuddy/stats"),
    refetchOnWindowFocus: true,
  });

  return {
    stats: data || { totalBuddies: 0, totalDocuments: 0, avgQuizScore: 0 },
    isLoading,
    error,
  };
}
