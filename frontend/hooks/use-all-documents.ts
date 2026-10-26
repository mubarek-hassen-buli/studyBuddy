"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export interface UserDocument {
  id: string;
  studyBuddyId: string;
  studyBuddyName?: string;
  title?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url?: string;
  createdAt: string;
  updatedAt?: string;
}

export function useAllDocuments() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<UserDocument[]>({
    queryKey: ["documents", "all"],
    queryFn: () => api.get("/documents/list-all"),
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      toast.success("Document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["documents", "all"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to delete document");
    },
  });

  return {
    documents: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
