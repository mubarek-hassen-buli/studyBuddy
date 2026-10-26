"use client";

import * as React from "react";
import Image from "next/image";
import { FileCheck, Shuffle, Link as LinkIcon, Trophy, ArrowRight } from "lucide-react";
import { useQuizzes } from "@/hooks/use-quizzes";
import { useStreak } from "@/hooks/use-streak";

interface QuizzesHeroProps {
  onChallengeClick?: () => void;
}

export function QuizzesHero({ onChallengeClick }: QuizzesHeroProps) {
  const { overview } = useQuizzes();
  const { streak } = useStreak();
  return (
    <div className="relative overflow-hidden rounded-3xl bg-transparent pt-1 pb-4">
      {/* Top Section: Title & Classical Philosopher Character */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Headline & Subtitle */}
        <div className="max-w-xl z-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-800">
            QUIZZES
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#11231B] tracking-tight leading-[1.15] mt-1 mb-2">
            Test your knowledge,
            <br />
            lock in your progress.
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md leading-relaxed">
            Turn your study materials into quizzes or take one of our pre-made quizzes. Learn, improve, repeat.
          </p>
        </div>

        {/* Right: Folio Bust Character & Speech Bubble */}
        <div className="relative flex items-center justify-end pr-2 lg:pr-8 min-h-[140px] z-10">
          {/* Handwritten Speech Bubble */}
          <div className="relative z-20 mr-[-28px] mt-[-10px] bg-[#E8F3EC] border border-[#CDE3D5] rounded-2xl px-4 py-2.5 shadow-xs max-w-[210px]">
            <p className="font-handwriting text-base sm:text-lg font-bold text-[#1B4B38] leading-tight text-center">
              Good questions build great understanding!
            </p>
            <p className="font-handwriting text-xs text-[#2A654D] text-right mt-0.5">
              — Folio
            </p>
            {/* Speech bubble pointer / triangle */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-[#E8F3EC]" />
          </div>

          {/* Philosopher Illustration with Yellow Glasses */}
          <div className="relative w-32 sm:w-40 h-32 sm:h-40 shrink-0">
            <Image
              src="/images/folio.png"
              alt="Folio Philosopher"
              fill
              priority
              className="object-contain object-bottom drop-shadow-sm"
            />
            {/* Subtle sketched sparks/rays around head/specs */}
            <div className="absolute -top-1 right-2 text-amber-400 font-bold text-xs select-none pointer-events-none">
              ✦
            </div>
            <div className="absolute top-3 -left-1 text-amber-500 font-bold text-xs select-none pointer-events-none">
              \\
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row: 4 Rounded Stat Containers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Stat 1: Quizzes Taken */}
        <div className="flex items-center gap-3 bg-white border border-[#E5EAE7] rounded-2xl px-4 py-3 shadow-2xs hover:border-emerald-200 transition-all">
          <div className="h-9 w-9 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4 text-[#1B4B38]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold text-[#11231B] leading-tight">
              {overview.quizzesTaken}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Quizzes Taken
            </span>
          </div>
        </div>

        {/* Stat 2: Average Score */}
        <div className="flex items-center gap-3 bg-white border border-[#E5EAE7] rounded-2xl px-4 py-3 shadow-2xs hover:border-emerald-200 transition-all">
          <div className="h-9 w-9 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0">
            <Shuffle className="w-4 h-4 text-[#1B4B38]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold text-[#11231B] leading-tight">
              {overview.averageScore}%
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Average Score
            </span>
          </div>
        </div>

        {/* Stat 3: Streak Days */}
        <div className="flex items-center gap-3 bg-white border border-[#E5EAE7] rounded-2xl px-4 py-3 shadow-2xs hover:border-emerald-200 transition-all">
          <div className="h-9 w-9 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0">
            <LinkIcon className="w-4 h-4 text-[#1B4B38]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold text-[#11231B] leading-tight">
              {streak.streakDays}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Streak Days
            </span>
          </div>
        </div>

        {/* Stat 4: You're doing great! */}
        <div 
          onClick={onChallengeClick}
          className="flex items-center justify-between gap-2 bg-white border border-[#E5EAE7] rounded-2xl px-4 py-3 shadow-2xs hover:border-amber-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#FEF6E6] text-amber-600 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold text-[#11231B] leading-tight">
                You&apos;re doing great!
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Keep challenging yourself.
              </span>
            </div>
          </div>
          <div className="h-7 w-7 rounded-full bg-[#F4F6F4] group-hover:bg-[#E8F3EC] group-hover:text-[#0D382B] text-slate-600 flex items-center justify-center transition-all shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
