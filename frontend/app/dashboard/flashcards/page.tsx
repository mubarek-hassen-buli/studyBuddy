"use client";

import * as React from "react";
import { FlashcardsHero } from "@/components/dashboard/flashcards/flashcards-hero";
import { FlashcardsGrid } from "@/components/dashboard/flashcards/flashcards-grid";
import { FlashcardsSidebar } from "@/components/dashboard/flashcards/flashcards-sidebar";
import { CreateDeckModal } from "@/components/dashboard/flashcards/create-deck-modal";

export default function FlashcardsPage() {
  const [createDeckModalOpen, setCreateDeckModalOpen] = React.useState(false);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Page Hero with Titles, Stat Pills, Top Action Buttons, and Folio Character */}
      <FlashcardsHero
        onCreateDeckClick={() => setCreateDeckModalOpen(true)}
        onImportClick={() => setCreateDeckModalOpen(true)}
      />

      {/* 2. Main Layout Grid: Flashcards Decks Grid (Left 8.5/9 cols) + Sidebar (Right 3.5/3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 xl:col-span-9">
          <FlashcardsGrid onCreateDeckClick={() => setCreateDeckModalOpen(true)} />
        </div>

        <div className="lg:col-span-4 xl:col-span-3">
          <FlashcardsSidebar />
        </div>
      </div>

      {/* AI Flashcard Deck Generator Dialog */}
      <CreateDeckModal
        isOpen={createDeckModalOpen}
        onClose={() => setCreateDeckModalOpen(false)}
      />
    </div>
  );
}
