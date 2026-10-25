"use client";

import * as React from "react";
import Image from "next/image";

export function FolioMotivationCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#EBF4EE] p-5 shadow-xs border border-[#D5E6DC] flex flex-col justify-between h-full min-h-[300px]">
      {/* Background ambient lighting */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

      {/* Header Typography */}
      <div className="z-10 relative">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#11231B] leading-tight">
          Progress looks good on you!
        </h3>
        <p className="text-xs text-slate-600 font-medium mt-1.5 leading-snug max-w-[200px]">
          You&apos;re building a better version of yourself, and it shows.
        </p>
      </div>

      {/* Central Illustration: Sketched Lightbulb + Folio Character */}
      <div className="relative flex-1 flex items-end justify-center my-1 z-10">
        {/* Floating Sketched Lightbulb */}
        <div className="absolute top-0 right-1/4 transform -translate-y-1 text-amber-500 select-none animate-bounce duration-1000">
          <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
            {/* Spark rays */}
            <line x1="12" y1="2" x2="12" y2="0" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.93" y1="4.93" x2="3.51" y2="3.51" strokeWidth="2" strokeLinecap="round" />
            <line x1="19.07" y1="4.93" x2="20.49" y2="3.51" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Character Image */}
        <div className="relative w-36 h-40 sm:w-44 sm:h-44 shrink-0 overflow-hidden">
          <Image
            src="/images/folio.png"
            alt="Progress looks good on you"
            width={180}
            height={180}
            className="w-full h-full object-contain object-bottom"
          />
        </div>
      </div>

      {/* Bottom indicator line */}
      <div className="flex items-center gap-1.5 z-10 pt-1">
        <span className="w-6 h-1 rounded-full bg-[#0D382B]" />
        <span className="w-1.5 h-1 rounded-full bg-slate-300" />
        <span className="w-1.5 h-1 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
