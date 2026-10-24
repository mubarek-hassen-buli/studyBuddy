"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

export function useAuth() {
  const { user, isLoading, checkSession, setUser } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      checkSession();
    }
  }, [isLoading, checkSession]);

  return {
    user,
    isLoading,
    checkSession,
    setUser,
    isAuthenticated: !!user,
  };
}
