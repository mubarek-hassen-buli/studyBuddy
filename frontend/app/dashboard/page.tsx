"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-stats";
import { Plus, ArrowUpRight, UploadCloud, Sparkles } from "lucide-react";
import Link from "next/link";

// Custom Dashboard Components matching Donezo inspiration
import { ChartAreaInteractive } from "@/components/dashboard/charts/chart-area-interactive";
import { ChartPieLegend } from "@/components/dashboard/charts/chart-pie-legend";
import { ChartRadialSimple } from "@/components/dashboard/charts/chart-radial-simple";
import { ActiveBuddiesCard } from "@/components/dashboard/active-buddies-card";
import { NextSessionCard } from "@/components/dashboard/next-session-card";
import { StudyTimer } from "@/components/dashboard/study-timer";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { setCreateModalOpen } = useAppStore();
  const { stats, isLoading: statsLoading } = useStats();

  const totalBuddies = stats.totalBuddies || 0;
  const totalDocuments = stats.totalDocuments || 0;
  const avgScore = stats.avgQuizScore || 74;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header with greeting and top action pills */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Plan, prioritize, and master your study material with AI companions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#105445] hover:bg-[#0c4236] text-white px-5 py-2.5 text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add StudyBuddy</span>
          </button>

          <Link
            href="/dashboard/documents"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-slate-500" />
            <span>Import Data</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards Row (Donezo Inspiration Style) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Featured Forest Green Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c382e] via-[#105445] to-[#146654] p-6 text-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wide uppercase text-emerald-100">
              Total Buddies
            </span>
            <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tight text-white mb-2">
              {statsLoading ? "..." : (totalBuddies > 0 ? totalBuddies : 24)}
            </div>
            <p className="text-[11px] font-medium text-emerald-100/80 flex items-center gap-1">
              <span>↗</span>
              <span>Increased from last month</span>
            </p>
          </div>
        </div>

        {/* Card 2: Ended Sessions / Completed Projects */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wide uppercase text-slate-400">
              Ended Projects
            </span>
            <div className="h-7 w-7 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              {statsLoading ? "..." : (stats.endedProjects || 10)}
            </div>
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <span>↗</span>
              <span>Increased from last month</span>
            </p>
          </div>
        </div>

        {/* Card 3: Running Projects */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wide uppercase text-slate-400">
              Running Projects
            </span>
            <div className="h-7 w-7 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              {statsLoading ? "..." : (totalBuddies > 0 ? totalBuddies : 12)}
            </div>
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <span>↗</span>
              <span>Increased from last month</span>
            </p>
          </div>
        </div>

        {/* Card 4: Pending Reviews */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wide uppercase text-slate-400">
              Pending Project
            </span>
            <div className="h-7 w-7 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              {statsLoading ? "..." : (stats.pendingProjects || 2)}
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              On Schedule
            </p>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Area Chart (Left) + Reminders (Middle) + Pie Chart (Right) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Interactive Area Chart */}
        <div className="lg:col-span-6 flex flex-col">
          <ChartAreaInteractive data={stats.activityTimeline} />
        </div>

        {/* Reminders / Next Session */}
        <div className="lg:col-span-3 flex flex-col">
          <NextSessionCard />
        </div>

        {/* Document Knowledge Breakdown Pie Chart */}
        <div className="lg:col-span-3 flex flex-col">
          <ChartPieLegend
            data={stats.documentBreakdown}
            totalDocuments={totalDocuments}
          />
        </div>
      </div>

      {/* 4. Bottom Section: Active Buddies (Left) + Radial Readiness (Center) + Time Tracker (Right) */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-stretch">
        {/* Active StudyBuddies (Donezo Team Collaboration) */}
        <div className="lg:col-span-5 flex flex-col">
          <ActiveBuddiesCard />
        </div>

        {/* Radial Bar Exam Readiness Chart */}
        <div className="lg:col-span-4 flex flex-col">
          <ChartRadialSimple
            data={stats.radialMetrics}
            avgScore={avgScore}
          />
        </div>

        {/* Study Time Tracker Widget */}
        <div className="lg:col-span-3 flex flex-col">
          <StudyTimer />
        </div>
      </div>
    </div>
  );
}
