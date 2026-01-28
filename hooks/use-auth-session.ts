"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

/**
 * Enhanced authentication hook that provides user state and auth actions.
 * This wraps the Zustand auth store and provides additional helper methods.
 */
export function useAuthSession() {
  const { user, isLoading, checkSession, setUser } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      checkSession();
    }
  }, [isLoading, checkSession]);

  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return {
    user,
    isLoading,
    checkSession,
    signOut,
    isAuthenticated: !!user,
  };
}
