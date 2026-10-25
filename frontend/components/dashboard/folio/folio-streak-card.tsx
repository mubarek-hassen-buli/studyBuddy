"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FolioStreakCardProps {
  streakDays?: number;
}

export function FolioStreakCard({ streakDays = 3 }: FolioStreakCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0D382B] p-5 text-white shadow-xs border border-emerald-950/20 flex items-center justify-between gap-4 h-full min-h-[220px]">
      {/* Background ambient pattern */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

      {/* Left: Circular Character Avatar */}
      <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white/10 shrink-0 border-2 border-emerald-400/30 shadow-md">
        <Image
          src="/images/folio.png"
          alt="Streak Avatar"
          width={80}
          height={80}
          className="w-full h-full object-cover object-[center_12%]"
        />
      </div>

      {/* Right: Content & Action */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>🔥</span>
            <span>{streakDays} Day Streak</span>
          </span>
        </div>

        <p className="text-xs text-emerald-100/70 font-medium leading-snug">
          That&apos;s {streakDays} days in a row! Keep the momentum going.
        </p>

        <div className="mt-3">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#0D382B] px-4 py-1.5 text-xs font-bold hover:bg-emerald-50 transition-all shadow-2xs active:scale-95"
          >
            <span>View your streak</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
