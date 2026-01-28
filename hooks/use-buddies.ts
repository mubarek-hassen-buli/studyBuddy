"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useStudyBuddyStore } from "@/store/studybuddy-store";
import { useEffect } from "react";

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
