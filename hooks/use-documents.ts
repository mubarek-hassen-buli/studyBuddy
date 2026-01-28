"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useDocuments(studyBuddyId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", studyBuddyId],
    queryFn: () => api.get(`/documents/list/${studyBuddyId}`),
    enabled: !!studyBuddyId,
  });

  const uploadDocument = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studyBuddyId", studyBuddyId);

      return await api.upload("/documents/upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", studyBuddyId] });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", studyBuddyId] });
    },
  });

  return {
    documents: data || [],
    isLoading,
    error,
    uploadDocument,
    deleteDocument,
  };
}
