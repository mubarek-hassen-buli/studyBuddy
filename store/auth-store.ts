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
  checkSession: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  checkSession: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ isLoading: true });
    }
    
    try {
      console.log("Checking session with BetterAuth...");
      const { data, error } = await authClient.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        set({ user: null, isLoading: false });
        return;
      }

      if (data?.user) {
        console.log("Session valid for:", data.user.email);
        set({ user: data.user as User, isLoading: false });
      } else {
        console.warn("No active session found");
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Session check exception:", error);
      set({ user: null, isLoading: false });
    }
  },
  setUser: (user) => set({ user }),
}));
