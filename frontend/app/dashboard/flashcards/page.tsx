"use client";

import * as React from "react";
import { FlashcardsHero } from "@/components/dashboard/flashcards/flashcards-hero";
import { FlashcardsGrid } from "@/components/dashboard/flashcards/flashcards-grid";
import { FlashcardsSidebar } from "@/components/dashboard/flashcards/flashcards-sidebar";
import { CreateDeckModal } from "@/components/dashboard/flashcards/create-deck-modal";
import { FlashcardDeck } from "@/hooks/use-flashcard-decks";

export default function FlashcardsPage() {
  const [createDeckModalOpen, setCreateDeckModalOpen] = React.useState(false);
  const [activeDeck, setActiveDeck] = React.useState<FlashcardDeck | null>(null);

  const handleDeckCreated = (createdDeck: { id: string; studyBuddyId: string; title: string; totalCards: number }) => {
    setActiveDeck({
      id: createdDeck.id,
      studyBuddyId: createdDeck.studyBuddyId,
      title: createdDeck.title,
      subject: createdDeck.title,
      totalCards: createdDeck.totalCards,
      masteredCount: 0,
      dueCount: createdDeck.totalCards,
      masteryPercentage: 0,
      lastReviewedAt: null,
      createdAt: new Date().toISOString(),
    });
  };

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
          <FlashcardsGrid
            onCreateDeckClick={() => setCreateDeckModalOpen(true)}
            externalActiveDeck={activeDeck}
            onClearExternalActiveDeck={() => setActiveDeck(null)}
          />
        </div>

        <div className="lg:col-span-4 xl:col-span-3">
          <FlashcardsSidebar />
        </div>
      </div>

      {/* AI Flashcard Deck Generator Dialog */}
      <CreateDeckModal
        isOpen={createDeckModalOpen}
        onClose={() => setCreateDeckModalOpen(false)}
        onDeckCreated={handleDeckCreated}
      />
    </div>
  );
}
