"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, HelpCircle, Loader2 } from "lucide-react";
import { useQuizzes } from "@/hooks/use-quizzes";
import { useBuddies, StudyBuddy } from "@/hooks/use-buddies";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQuizModal({ isOpen, onClose }: CreateQuizModalProps) {
  const [topic, setTopic] = React.useState("");
  const [selectedBuddyId, setSelectedBuddyId] = React.useState<string>("");
  const [difficulty, setDifficulty] = React.useState<"easy" | "medium" | "hard">("medium");
  const [questionCount, setQuestionCount] = React.useState<number>(5);

  const { createQuiz, isCreating } = useQuizzes();
  const { buddies } = useBuddies();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      await createQuiz({
        topic: topic.trim(),
        count: questionCount,
        difficulty,
        studyBuddyId: selectedBuddyId ? selectedBuddyId : undefined,
      });
      setTopic("");
      onClose();
    } catch {
      // toast handled in hook mutation
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
            Create AI Quiz
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Enter a subject or concept. Folio AI will craft rigorous multiple-choice questions for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Topic Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Quiz Topic or Subject
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Molecular Genetics, French Revolution, Calculus III"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-medium"
              required
              disabled={isCreating}
            />
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 font-medium"
                disabled={isCreating}
              >
                <option value="easy">Easy (Fundamentals)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="hard">Hard (Advanced)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 font-medium"
                disabled={isCreating}
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          </div>

          {/* Optional StudyBuddy Link */}
          {buddies.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Link to StudyBuddy (Optional)
              </label>
              <select
                value={selectedBuddyId}
                onChange={(e) => setSelectedBuddyId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 font-medium"
                disabled={isCreating}
              >
                <option value="">General (No specific buddy)</option>
                {buddies.map((b: StudyBuddy) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.subject ? `(${b.subject})` : ""}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Linking to a buddy enables Folio to ground questions in your uploaded documents.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !topic.trim()}
              className="inline-flex items-center gap-1.5 bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
