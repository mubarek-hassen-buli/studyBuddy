"use client";

import * as React from "react";
import { useAccentStore, AccentId, ACCENT_THEMES } from "@/store/accent-store";

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const { accent, setAccent } = useAccentStore();

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("folio-accent-color") as AccentId | null;
      const validIds = ACCENT_THEMES.map((t) => t.id);
      if (saved && validIds.includes(saved)) {
        if (saved !== accent) {
          setAccent(saved);
        }
        document.documentElement.setAttribute("data-accent", saved);
      } else {
        document.documentElement.setAttribute("data-accent", "forest");
      }
    } catch {
      document.documentElement.setAttribute("data-accent", "forest");
    }

    const handleExternalChange = (e: CustomEvent<{ accent: AccentId }>) => {
      if (e.detail?.accent && e.detail.accent !== accent) {
        setAccent(e.detail.accent);
      }
    };

    window.addEventListener(
      "folio-accent-changed",
      handleExternalChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "folio-accent-changed",
        handleExternalChange as EventListener
      );
    };
  }, [accent, setAccent]);

  return <>{children}</>;
}

