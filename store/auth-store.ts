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
      const { data } = await authClient.getSession();
      set({ user: data?.user as User | null, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
  setUser: (user) => set({ user }),
}));
