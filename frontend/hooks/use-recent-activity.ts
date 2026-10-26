"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export interface ActivityFeedItem {
  id: string;
  type: "session" | "document" | "quiz" | "flashcard";
  title: string;
  description: string;
  timestamp: string;
  badge: string;
  score?: number;
  studyBuddyName?: string;
}

export function useRecentActivity() {
  const { data, isLoading, error, refetch } = useQuery<ActivityFeedItem[]>({
    queryKey: ["studybuddy", "recent-activity"],
    queryFn: () => api.get("/studybuddy/recent-activity"),
    refetchOnWindowFocus: true,
  });

  return {
    activities: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
}
