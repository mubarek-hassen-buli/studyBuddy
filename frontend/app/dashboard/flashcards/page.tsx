"use client";

import * as React from "react";
import { FlashcardsHero } from "@/components/dashboard/flashcards/flashcards-hero";
import { FlashcardsGrid } from "@/components/dashboard/flashcards/flashcards-grid";
import { FlashcardsSidebar } from "@/components/dashboard/flashcards/flashcards-sidebar";
import { useAppStore } from "@/store/app-store";

export default function FlashcardsPage() {
  const { setCreateModalOpen } = useAppStore();

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Page Hero with Titles, Stat Pills, Top Action Buttons, and Folio Character */}
      <FlashcardsHero
        onCreateDeckClick={() => setCreateModalOpen(true)}
        onImportClick={() => setCreateModalOpen(true)}
      />

      {/* 2. Main Layout Grid: Flashcards Decks Grid (Left 8.5/9 cols) + Sidebar (Right 3.5/3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 xl:col-span-9">
          <FlashcardsGrid onCreateDeckClick={() => setCreateModalOpen(true)} />
        </div>

        <div className="lg:col-span-4 xl:col-span-3">
          <FlashcardsSidebar />
        </div>
      </div>
    </div>
  );
}
