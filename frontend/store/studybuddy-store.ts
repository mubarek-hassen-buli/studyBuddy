import { create } from "zustand";

export interface StudyBuddy {
  id: string;
  userId?: string;
  name: string;
  subject?: string | null;
  description?: string | null;
  qdrantCollectionName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface StudyBuddyState {
  activeBuddy: StudyBuddy | null;
  setActiveBuddy: (buddy: StudyBuddy | null) => void;
  buddies: StudyBuddy[];
  setBuddies: (buddies: StudyBuddy[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStudyBuddyStore = create<StudyBuddyState>((set) => ({
  activeBuddy: null,
  setActiveBuddy: (buddy) => set({ activeBuddy: buddy }),
  buddies: [],
  setBuddies: (buddies) => set({ buddies }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
