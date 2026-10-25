"use client";

import * as React from "react";
import { FileText, Layers, Target, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useBuddies } from "@/hooks/use-buddies";

export function FolioActionCards() {
  const { buddies } = useBuddies();
  const defaultBuddyId = buddies && buddies.length > 0 ? buddies[0].id : null;

  const chatHref = defaultBuddyId
    ? `/dashboard/study/${defaultBuddyId}?mode=chat`
    : "/dashboard/buddies";

  const flashcardHref = defaultBuddyId
    ? `/dashboard/study/${defaultBuddyId}?mode=flashcards`
    : "/dashboard/buddies";

  const quizHref = defaultBuddyId
    ? `/dashboard/study/${defaultBuddyId}?mode=quiz`
    : "/dashboard/buddies";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Study a Document (Featured Forest Green Card) */}
      <Link
        href="/dashboard/documents"
        className="group relative overflow-hidden rounded-2xl bg-[#0D382B] p-4 text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-emerald-950/20 active:scale-99"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200 shrink-0 border border-emerald-400/20">
            <FileText className="w-5 h-5" />
          </div>
          <div className="h-7 w-7 rounded-full bg-white/15 text-emerald-200 group-hover:bg-white group-hover:text-[#0D382B] flex items-center justify-center transition-all">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">Study a Document</h4>
          <p className="text-[11px] text-emerald-100/70 font-medium mt-0.5 leading-snug">
            Upload a file or paste text to create your study materials.
          </p>
        </div>
      </Link>

      {/* 2. Generate Flashcards */}
      <Link
        href={flashcardHref}
        className="group relative rounded-2xl bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-[#E5EAE7] active:scale-99"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-[#E8F2EC] flex items-center justify-center text-[#0D382B] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="h-7 w-7 rounded-full bg-slate-50 border border-slate-200 text-slate-500 group-hover:bg-[#0D382B] group-hover:text-white group-hover:border-[#0D382B] flex items-center justify-center transition-all">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#11231B] tracking-tight">Generate Flashcards</h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
            Turn your notes into interactive flashcards.
          </p>
        </div>
      </Link>

      {/* 3. Create a Quiz */}
      <Link
        href={quizHref}
        className="group relative rounded-2xl bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-[#E5EAE7] active:scale-99"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-[#E8F2EC] flex items-center justify-center text-[#0D382B] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="h-7 w-7 rounded-full bg-slate-50 border border-slate-200 text-slate-500 group-hover:bg-[#0D382B] group-hover:text-white group-hover:border-[#0D382B] flex items-center justify-center transition-all">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#11231B] tracking-tight">Create a Quiz</h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
            Test your knowledge with AI-powered quizzes.
          </p>
        </div>
      </Link>

      {/* 4. Chat with Folio */}
      <Link
        href={chatHref}
        className="group relative rounded-2xl bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-[#E5EAE7] active:scale-99"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-[#E8F2EC] flex items-center justify-center text-[#0D382B] shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="h-7 w-7 rounded-full bg-slate-50 border border-slate-200 text-slate-500 group-hover:bg-[#0D382B] group-hover:text-white group-hover:border-[#0D382B] flex items-center justify-center transition-all">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#11231B] tracking-tight">Chat with Folio</h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
            Ask questions and get instant explanations.
          </p>
        </div>
      </Link>
    </div>
  );
}
