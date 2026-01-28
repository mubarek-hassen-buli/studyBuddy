"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useBuddy } from "@/hooks/use-buddies";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { SummarizeInterface } from "@/components/dashboard/summarize-interface";
import { FlashcardsInterface } from "@/components/dashboard/flashcards-interface";
import { QuizInterface } from "@/components/dashboard/quiz-interface";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Zap, GraduationCap, ChevronLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";

type LearningMode = "chat" | "summarize" | "flashcards" | "quiz";

export default function StudyPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMode = (searchParams.get("mode") as LearningMode) || "chat";
  const [mode, setMode] = useState<LearningMode>(initialMode);
  
  const { data: buddy, isLoading } = useBuddy(id as string);

  const modes: { id: LearningMode; label: string; icon: any; color: string }[] = [
    { id: "chat", label: "AI Chat", icon: MessageSquare, color: "text-blue-500" },
    { id: "summarize", label: "Summarize", icon: FileText, color: "text-purple-500" },
    { id: "flashcards", label: "Flashcards", icon: Zap, color: "text-orange-500" },
    { id: "quiz", label: "Quiz", icon: GraduationCap, color: "text-green-500" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!buddy) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">StudyBuddy not found</h2>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/buddies/${id}`}>
             <Button variant="ghost" size="icon" className="rounded-xl border border-slate-200 text-slate-400 hover:text-primary transition-all">
                <ChevronLeft className="w-5 h-5" />
             </Button>
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BrainCircuit className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{buddy.name}</h1>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{buddy.subject}</p>
             </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
           {modes.map((m) => (
             <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                  ${mode === m.id 
                    ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}
                `}
             >
                <m.icon className={`w-4 h-4 ${mode === m.id ? m.color : "text-slate-400"}`} />
                {m.label}
             </button>
           ))}
        </div>
      </div>

      {/* Interface Area */}
      <div className="min-h-[600px]">
        {mode === "chat" && <ChatInterface buddyId={id as string} />}
        {mode === "summarize" && <SummarizeInterface buddyId={id as string} />}
        {mode === "flashcards" && <FlashcardsInterface buddyId={id as string} />}
        {mode === "quiz" && <QuizInterface buddyId={id as string} />}
      </div>
    </div>
  );
}
