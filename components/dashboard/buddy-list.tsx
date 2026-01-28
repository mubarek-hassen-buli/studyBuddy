"use client";

import { useBuddies } from "@/hooks/use-buddies";
import { BuddyCard } from "./buddy-card";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Plus, BrainCircuit, Loader2 } from "lucide-react";

export function BuddyList() {
  const { buddies, isLoading } = useBuddies();
  const { setCreateModalOpen } = useAppStore();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[280px] rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
        ))}
      </div>
    );
  }

  if (buddies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 rotate-3 group hover:rotate-0 transition-transform duration-500">
           <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your Study Squad is Empty</h2>
        <p className="text-slate-500 max-w-md mb-10 text-lg font-medium leading-relaxed">
          Create your first AI StudyBuddy to start organizing your knowledge, generating quizzes, and mastering your subjects.
        </p>
        <Button 
          size="lg" 
          className="rounded-full px-10 py-7 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-6 w-6" />
          Create First Buddy
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {buddies.map((buddy: any) => (
        <BuddyCard 
          key={buddy.id}
          id={buddy.id}
          name={buddy.name}
          subject={buddy.subject}
          description={buddy.description}
        />
      ))}
    </div>
  );
}
