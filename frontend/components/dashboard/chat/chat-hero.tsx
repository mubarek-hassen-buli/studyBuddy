"use client";

import * as React from "react";
import Image from "next/image";

export function ChatHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-transparent pt-1 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Titles & Subtitle */}
        <div className="max-w-xl z-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-800">
            AI CHAT
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#11231B] tracking-tight leading-[1.15] mt-1 mb-2">
            Ask. Explore. Learn.
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md leading-relaxed">
            Get instant help with your study materials, ask questions, or simply have a conversation about your topics.
          </p>
        </div>

        {/* Right: Folio Philosopher Character & Speech Bubble */}
        <div className="relative flex items-center justify-end pr-2 lg:pr-8 min-h-[140px] z-10">
          {/* Handwritten Speech Bubble */}
          <div className="relative z-20 mr-[-28px] mt-[-10px] bg-[#E8F3EC] border border-[#CDE3D5] rounded-2xl px-4 py-2.5 shadow-xs max-w-[210px]">
            <p className="font-handwriting text-base sm:text-lg font-bold text-[#1B4B38] leading-tight text-center">
              Curious minds ask great questions.
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
            {/* Sketched sparks */}
            <div className="absolute -top-1 right-2 text-amber-400 font-bold text-xs select-none pointer-events-none">
              ✦
            </div>
            <div className="absolute top-3 -left-1 text-amber-500 font-bold text-xs select-none pointer-events-none">
              \\
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
