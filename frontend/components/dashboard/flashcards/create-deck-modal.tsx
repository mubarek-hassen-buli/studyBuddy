"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Layers, Loader2 } from "lucide-react";
import { useFlashcardDecks } from "@/hooks/use-flashcard-decks";
import { useBuddies, StudyBuddy } from "@/hooks/use-buddies";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckCreated?: (deck: { id: string; studyBuddyId: string; title: string; totalCards: number }) => void;
}

export function CreateDeckModal({ isOpen, onClose, onDeckCreated }: CreateDeckModalProps) {
  const [topic, setTopic] = React.useState("");
  const [selectedBuddyId, setSelectedBuddyId] = React.useState<string>("");
  const [cardCount, setCardCount] = React.useState<number>(10);

  const { createDeck, isCreatingDeck } = useFlashcardDecks();
  const { buddies } = useBuddies();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      const res = await createDeck({
        topic: topic.trim(),
        count: cardCount,
        studyBuddyId: selectedBuddyId ? selectedBuddyId : undefined,
      });

      const buddyName = selectedBuddyId
        ? buddies.find((b: StudyBuddy) => b.id === selectedBuddyId)?.name || topic.trim()
        : topic.trim();

      const createdDeck = {
        id: res.deckId || selectedBuddyId || "deck",
        studyBuddyId: res.deckId || selectedBuddyId || "deck",
        title: buddyName,
        totalCards: res.count || cardCount,
      };

      setTopic("");
      onClose();

      if (onDeckCreated) {
        onDeckCreated(createdDeck);
      }
    } catch {
      // toast already handled in mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-white border border-[#E5EAE7] shadow-xl font-sans">
        <DialogHeader className="text-center">
          <div className="h-10 w-10 rounded-full bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5 text-emerald-800" />
          </div>
          <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
            Generate Flashcard Deck
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Enter a subject or concept. Folio AI will craft high-yield study cards for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Deck Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Deck Topic or Subject *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Organic Chemistry, Cell Biology, Microeconomics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D382B] focus:border-transparent transition-all"
            />
          </div>

          {/* Optional Companion link */}
          {buddies && buddies.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Link to Course Material (Optional)
              </label>
              <select
                value={selectedBuddyId}
                onChange={(e) => setSelectedBuddyId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0D382B] focus:border-transparent transition-all"
              >
                <option value="">General Deck (Create New Subject)</option>
                {buddies.map((b: StudyBuddy) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.subject ? `(${b.subject})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Card Count Selector (5, 10, 15, 20) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Number of Flashcards to Generate
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setCardCount(cnt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    cardCount === cnt
                      ? "bg-[#0D382B] text-white border-[#0D382B] shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cnt} Cards
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isCreatingDeck}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingDeck || !topic.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D382B] hover:bg-[#07241C] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 active:scale-95"
            >
              {isCreatingDeck ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating {cardCount} Cards...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Create {cardCount} Cards</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
