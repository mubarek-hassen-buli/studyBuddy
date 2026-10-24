"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useAllDocuments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", "all"],
    queryFn: () => api.get("/documents/list-all"),
  });

  return {
    documents: data || [],
    isLoading,
    error,
  };
}
