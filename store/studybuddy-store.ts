import { create } from "zustand";

interface StudyBuddy {
  id: string;
  name: string;
  subject?: string;
  description?: string;
  qdrantCollectionName?: string;
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
