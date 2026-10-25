"use client";

import * as React from "react";
import Image from "next/image";
import {
  Calendar,
  BarChart3,
  Play,
  ArrowRight,
  CreditCard,
  Layers,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useBuddies } from "@/hooks/use-buddies";

export function FlashcardsSidebar() {
  const { buddies } = useBuddies();
  const defaultBuddyId = buddies && buddies.length > 0 ? buddies[0].id : null;

  const reviewHref = defaultBuddyId
    ? `/dashboard/study/${defaultBuddyId}?mode=flashcards`
    : "/dashboard/buddies";

  return (
    <div className="space-y-4">
      {/* 1. Today's Review Card */}
      <div className="rounded-2xl bg-white p-5 shadow-2xs border border-[#E5EAE7]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Today&apos;s Review
            </h4>
          </div>
          <Link
            href={reviewHref}
            className="text-[11px] font-bold text-slate-500 hover:text-[#0D382B] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Character Avatar + Info */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3.5">
          <div className="h-11 w-11 rounded-full overflow-hidden bg-white shrink-0 border border-emerald-400/30 shadow-2xs">
            <Image
              src="/images/folio.png"
              alt="Folio avatar"
              width={44}
              height={44}
              className="w-full h-full object-cover object-[center_12%]"
            />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
              48 cards due today
            </h5>
            <p className="text-[11px] text-slate-400 font-medium">
              Keep your streak alive!
            </p>
          </div>
        </div>

        {/* Start Reviewing Button */}
        <Link
          href={reviewHref}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold py-2.5 shadow-xs transition-all active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Reviewing</span>
        </Link>
      </div>

      {/* 2. Learning Progress (Donut Chart + Stats) */}
      <div className="rounded-2xl bg-white p-5 shadow-2xs border border-[#E5EAE7]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Learning Progress
            </h4>
          </div>
          <Link
            href="/dashboard/documents"
            className="text-[11px] font-bold text-slate-500 hover:text-[#0D382B] flex items-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4 py-1">
          {/* Radial Donut Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Gray Ring */}
              <path
                className="text-slate-100"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Foreground Green Progress Ring (68%) */}
              <path
                className="text-emerald-500 transition-all duration-1000"
                strokeDasharray="68, 100"
                strokeLinecap="round"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                68%
              </span>
              <span className="text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">
                Overall Progress
              </span>
            </div>
          </div>

          {/* Stats List */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">342 </span>
                <span className="text-[10px] text-slate-400 font-medium">Total Cards</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">8 </span>
                <span className="text-[10px] text-slate-400 font-medium">Decks</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">3 </span>
                <span className="text-[10px] text-slate-400 font-medium">Day Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Motivational Card: You're doing great! */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0D382B] p-4 text-white shadow-xs border border-emerald-950/20 flex items-center justify-between gap-3">
        {/* Character Image */}
        <div className="relative w-18 h-20 sm:w-20 sm:h-22 shrink-0 overflow-hidden">
          <Image
            src="/images/folio.png"
            alt="Motivational character"
            width={85}
            height={95}
            className="w-full h-full object-contain object-bottom drop-shadow-sm"
          />
        </div>

        {/* Content & Action */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white tracking-tight">
            You&apos;re doing great!
          </h4>
          <p className="text-[10px] text-emerald-100/80 font-medium leading-snug mt-0.5 mb-2.5">
            Every card you review brings you closer to your goals.
            <span className="block text-[9px] text-emerald-200/60 font-semibold">— Folio</span>
          </p>

          <Link
            href={reviewHref}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#0D382B] text-[10px] font-bold hover:bg-emerald-50 transition-all shadow-2xs active:scale-95"
          >
            <span>Keep Going</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
