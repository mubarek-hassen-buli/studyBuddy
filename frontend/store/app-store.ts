import { create } from "zustand";

interface AppState {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  createModalOpen: false,
  setCreateModalOpen: (open) => set({ createModalOpen: open }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
