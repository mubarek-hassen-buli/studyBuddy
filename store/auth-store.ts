import { create } from "zustand";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isChecking: boolean; // Add lock to prevent race conditions
  checkSession: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isChecking: false,
  checkSession: async () => {
    const state = get();
    if (state.isChecking) return; // Avoid redundant calls
    
    // Only show loading if we don't have a user yet
    if (!state.user) {
      set({ isLoading: true });
    }
    
    set({ isChecking: true });
    
    try {
      console.log("[AuthStore] Checking session...");
      const { data, error } = await authClient.getSession();
      
      if (error) {
        console.error("[AuthStore] Session check error:", error);
        set({ user: null, isLoading: false, isChecking: false });
        return;
      }

      if (data?.user) {
        console.log("[AuthStore] Session valid:", data.user.email);
        set({ user: data.user as User, isLoading: false, isChecking: false });
      } else {
        console.warn("[AuthStore] No active session found");
        set({ user: null, isLoading: false, isChecking: false });
      }
    } catch (error) {
      console.error("[AuthStore] Session check exception:", error);
      set({ user: null, isLoading: false, isChecking: false });
    }
  },
  setUser: (user) => {
    console.log("[AuthStore] Setting user:", user?.email || "null");
    set({ user, isLoading: false });
  },
}));
