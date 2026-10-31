"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import { AdminUser } from "@/types/admin";

export function useAdminAuth() {
  const query = useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      const res = await adminApi.getMe();
      return res.user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: (failureCount, error: any) => {
      // Don't retry if 401 or 403
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 2;
    },
  });

  const adminUser: AdminUser | null = query.data ?? null;
  const isSuperAdmin = adminUser?.role === "super_admin";

  return {
    adminUser,
    isSuperAdmin,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

