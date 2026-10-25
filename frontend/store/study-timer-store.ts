import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StudyTimerSession {
  sessionId?: string | null;
  sessionTitle?: string | null;
  buddyId?: string | null;
  buddyName?: string | null;
}

interface StudyTimerState {
  seconds: number;
  isRunning: boolean;
  lastTickTimestamp: number | null;
  activeSessionId: string | null;
  activeSessionTitle: string | null;
  activeBuddyId: string | null;
  activeBuddyName: string | null;

  // Actions
  startTimer: (session?: StudyTimerSession) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setSessionDetails: (details: Partial<StudyTimerSession>) => void;
  clearSession: () => void;
  setSeconds: (seconds: number) => void;
}

export const useStudyTimerStore = create<StudyTimerState>()(
  persist(
    (set, get) => ({
      seconds: 0,
      isRunning: false,
      lastTickTimestamp: null,
      activeSessionId: null,
      activeSessionTitle: null,
      activeBuddyId: null,
      activeBuddyName: null,

      startTimer: (session) => {
        const now = Date.now();
        set((state) => ({
          isRunning: true,
          lastTickTimestamp: now,
          activeSessionId: session?.sessionId !== undefined ? session.sessionId : state.activeSessionId,
          activeSessionTitle: session?.sessionTitle !== undefined ? session.sessionTitle : state.activeSessionTitle,
          activeBuddyId: session?.buddyId !== undefined ? session.buddyId : state.activeBuddyId,
          activeBuddyName: session?.buddyName !== undefined ? session.buddyName : state.activeBuddyName,
        }));
      },

      pauseTimer: () => {
        const { isRunning, lastTickTimestamp, seconds } = get();
        if (isRunning && lastTickTimestamp) {
          const now = Date.now();
          const elapsed = Math.floor((now - lastTickTimestamp) / 1000);
          set({
            seconds: seconds + Math.max(0, elapsed),
            isRunning: false,
            lastTickTimestamp: null,
          });
        } else {
          set({ isRunning: false, lastTickTimestamp: null });
        }
      },

      resumeTimer: () => {
        set({
          isRunning: true,
          lastTickTimestamp: Date.now(),
        });
      },

      resetTimer: () => {
        set({
          seconds: 0,
          isRunning: false,
          lastTickTimestamp: null,
        });
      },

      tick: () => {
        const { isRunning, lastTickTimestamp, seconds } = get();
        if (!isRunning) return;

        const now = Date.now();
        if (!lastTickTimestamp) {
          set({ lastTickTimestamp: now });
          return;
        }

        const elapsed = Math.floor((now - lastTickTimestamp) / 1000);
        if (elapsed >= 1) {
          set({
            seconds: seconds + elapsed,
            lastTickTimestamp: now,
          });
        }
      },

      setSessionDetails: (details) => {
        set((state) => ({
          activeSessionId: details.sessionId !== undefined ? details.sessionId : state.activeSessionId,
          activeSessionTitle: details.sessionTitle !== undefined ? details.sessionTitle : state.activeSessionTitle,
          activeBuddyId: details.buddyId !== undefined ? details.buddyId : state.activeBuddyId,
          activeBuddyName: details.buddyName !== undefined ? details.buddyName : state.activeBuddyName,
        }));
      },

      clearSession: () => {
        set({
          activeSessionId: null,
          activeSessionTitle: null,
          activeBuddyId: null,
          activeBuddyName: null,
        });
      },

      setSeconds: (seconds: number) => {
        set({ seconds, lastTickTimestamp: Date.now() });
      },
    }),
    {
      name: "studybuddy-study-timer",
      storage: createJSONStorage(() => localStorage),
      // Synchronize wall clock on hydration if it was running
      onRehydrateStorage: () => (state) => {
        if (state && state.isRunning && state.lastTickTimestamp) {
          const now = Date.now();
          const elapsed = Math.floor((now - state.lastTickTimestamp) / 1000);
          if (elapsed > 0) {
            state.seconds += elapsed;
            state.lastTickTimestamp = now;
          }
        }
      },
    }
  )
);
