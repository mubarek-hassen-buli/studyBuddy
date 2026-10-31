import { create } from "zustand";

export type AccentId = "forest" | "teal" | "emerald" | "amber" | "purple" | "sky";

export interface AccentThemeOption {
  id: AccentId;
  label: string;
  bg: string;
  primary: string;
  primaryHover: string;
  light: string;
}

export const ACCENT_THEMES: AccentThemeOption[] = [
  {
    id: "forest",
    label: "Folio Forest",
    bg: "#0D382B",
    primary: "#0D382B",
    primaryHover: "#07251C",
    light: "#E8F2EC",
  },
  {
    id: "teal",
    label: "Deep Teal",
    bg: "#144A3C",
    primary: "#144A3C",
    primaryHover: "#0C3329",
    light: "#E6F4F0",
  },
  {
    id: "emerald",
    label: "Emerald",
    bg: "#10B981",
    primary: "#059669",
    primaryHover: "#047857",
    light: "#ECFDF5",
  },
  {
    id: "amber",
    label: "Amber",
    bg: "#F59E0B",
    primary: "#D97706",
    primaryHover: "#B45309",
    light: "#FEF3C7",
  },
  {
    id: "purple",
    label: "Lavender",
    bg: "#8B5CF6",
    primary: "#7C3AED",
    primaryHover: "#6D28D9",
    light: "#F3E8FF",
  },
  {
    id: "sky",
    label: "Sky Blue",
    bg: "#38BDF8",
    primary: "#0284C7",
    primaryHover: "#0369A1",
    light: "#E0F2FE",
  },
];

interface AccentStore {
  accent: AccentId;
  setAccent: (accent: AccentId) => void;
}

const STORAGE_KEY = "folio-accent-color";

export const useAccentStore = create<AccentStore>((set) => ({
  accent: "forest",
  setAccent: (accent: AccentId) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, accent);
        document.documentElement.setAttribute("data-accent", accent);
        window.dispatchEvent(
          new CustomEvent("folio-accent-changed", { detail: { accent } })
        );
      } catch {
        // Handle private browsing or localStorage errors silently
      }
    }
    set({ accent });
  },
}));

