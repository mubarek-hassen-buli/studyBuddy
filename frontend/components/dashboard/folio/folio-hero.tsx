"use client";

import * as React from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";

export function FolioHero() {
  const { user } = useAuthStore();
  const rawName = user?.name || "Mubarek";
  const firstName = rawName.split(" ")[0];

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-transparent py-4 sm:py-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Greeting & Typography */}
        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 mb-1.5">
            <span className="text-sm">☀️</span>
            <span>{getGreeting()}, {firstName}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#11231B] tracking-tight leading-[1.14]">
            Let&apos;s turn your materials
            <br />
            into knowledge.
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-3 leading-relaxed font-medium">
            Upload your notes, PDFs, or anything you&apos;re studying, and I&apos;ll help you create flashcards, quizzes, and more.
          </p>
        </div>

        {/* Right: Character Illustration & Speech Bubble */}
        <div className="relative flex items-center justify-center lg:justify-end z-10 select-none">
          {/* Organic Handwritten Speech Bubble */}
          <div className="relative mr-2 sm:mr-4 max-w-[210px] sm:max-w-[240px] rounded-2xl bg-[#EBF4EE] border border-[#D4E7DC] p-3.5 shadow-2xs">
            {/* Speech bubble tail pointing right towards Folio */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#EBF4EE] border-t border-r border-[#D4E7DC] rotate-45" />

            <p className="font-handwriting text-base sm:text-lg text-[#133226] font-bold leading-tight">
              You&apos;re doing great!
            </p>
            <p className="font-handwriting text-xs sm:text-sm text-[#234839] leading-snug mt-1">
              Consistency beats intensity. Keep going, one step at a time.
            </p>
            <p className="font-handwriting text-xs text-[#234839] text-right mt-1 font-semibold">
              — Folio
            </p>
          </div>

          {/* Golden sketch spark doodles */}
          <div className="relative">
            <div className="absolute -left-3 top-8 text-amber-500 text-xs font-black tracking-widest rotate-[-15deg] pointer-events-none">
              \ | /
            </div>

            {/* Character Image */}
            <div className="relative w-40 h-44 sm:w-48 sm:h-52 shrink-0">
              <Image
                src="/images/folio.png"
                alt="Folio character"
                width={200}
                height={220}
                priority
                className="w-full h-full object-contain object-bottom drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
