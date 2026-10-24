"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useStudyBuddyStore } from "@/store/studybuddy-store";
import { useEffect } from "react";
import { toast } from "sonner";

export function useBuddies() {
  const queryClient = useQueryClient();
  const { setBuddies } = useStudyBuddyStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["buddies"],
    queryFn: () => api.get("/studybuddy"),
  });

  useEffect(() => {
    if (data) {
      setBuddies(data);
    }
  }, [data, setBuddies]);

  const createBuddy = useMutation({
    mutationFn: (newBuddy: { name: string; subject?: string; description?: string }) =>
      api.post("/studybuddy", newBuddy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buddies"] });
    },
    onError: (error: any) => {
      if (error.status === 403) {
        toast.error("StudyBuddy Limit Reached", {
          description: error.data?.message || "Upgrade to Pro for unlimited buddies.",
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/dashboard/pricing",
          },
          duration: 6000,
        });
      } else {
        toast.error("Failed to create Buddy. Please try again.");
      }
    }
  });

  const deleteBuddy = useMutation({
    mutationFn: (id: string) => api.delete(`/studybuddy/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buddies"] });
    },
  });

  return {
    buddies: data || [],
    isLoading,
    error,
    createBuddy,
    deleteBuddy,
  };
}

export function useBuddy(id: string) {
  return useQuery({
    queryKey: ["buddy", id],
    queryFn: () => api.get(`/studybuddy/${id}`),
    enabled: !!id,
  });
}
