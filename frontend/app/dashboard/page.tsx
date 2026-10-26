"use client";

import * as React from "react";
import { FolioHero } from "@/components/dashboard/folio/folio-hero";
import { FolioActionCards } from "@/components/dashboard/folio/folio-action-cards";
import { FolioProgressChart } from "@/components/dashboard/folio/folio-progress-chart";
import { FolioGoalsCard } from "@/components/dashboard/folio/folio-goals-card";
import { FolioMotivationCard } from "@/components/dashboard/folio/folio-motivation-card";
import { FolioRecentActivity } from "@/components/dashboard/folio/folio-recent-activity";
import { FolioStudyMaterials } from "@/components/dashboard/folio/folio-study-materials";
import { FolioStreakCard } from "@/components/dashboard/folio/folio-streak-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Hero Greeting Section with Character & Speech Bubble */}
      <FolioHero />

      {/* 2. Action Cards (Study a Document, Generate Flashcards, Create a Quiz, Chat with Folio) */}
      <FolioActionCards />

      {/* 3. Middle Row: Study Progress (5 cols) + Today's Goals (4 cols) + Progress looks good on you (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <FolioProgressChart />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <FolioGoalsCard />
        </div>
        <div className="lg:col-span-3 flex flex-col">
          <FolioMotivationCard />
        </div>
      </div>

      {/* 4. Bottom Row: Recent Activity (4 cols) + Study Materials (4 cols) + 3 Day Streak (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <div className="flex flex-col">
          <FolioRecentActivity />
        </div>
        <div className="flex flex-col">
          <FolioStudyMaterials />
        </div>
        <div className="flex flex-col">
          <FolioStreakCard />
        </div>
      </div>
    </div>
  );
}
