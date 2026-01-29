"use client";

import { BuddyList } from "@/components/dashboard/buddy-list";
import { Button } from "@/components/ui/button";
import { Plus, BrainCircuit } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export default function BuddiesPage() {
  const { setCreateModalOpen } = useAppStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Buddies</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage and interact with your AI study companions.</p>
        </div>
        <Button 
          size="lg" 
          className="rounded-full px-8 py-7 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Buddy
        </Button>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <BuddyList />
      </div>
    </div>
  );
}
