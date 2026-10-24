"use client";

import * as React from "react";
import { Plus, BrainCircuit, ArrowUpRight } from "lucide-react";
import { useBuddies } from "@/hooks/use-buddies";
import { useAppStore } from "@/store/app-store";
import Link from "next/link";

const STATUSES = [
  { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200/80" },
  { label: "Pending", className: "bg-slate-100 text-slate-700 border-slate-200/80" },
];

const AVATAR_COLORS = [
  "bg-[#105445] text-white",
  "bg-teal-600 text-white",
  "bg-emerald-600 text-white",
  "bg-indigo-600 text-white",
  "bg-amber-600 text-white",
];

export function ActiveBuddiesCard() {
  const { buddies, isLoading } = useBuddies();
  const { setCreateModalOpen } = useAppStore();

  const displayBuddies = React.useMemo(() => {
    if (buddies && buddies.length > 0) {
      return buddies.slice(0, 4);
    }
    // Fallback sample buddies matching Donezo inspiration
    return [
      {
        id: "demo-1",
        name: "Alexandra Deff",
        subject: "Computer Science & Architecture",
        description: "Operating systems & memory models",
      },
      {
        id: "demo-2",
        name: "Edwin Adenike",
        subject: "Organic Chemistry & Bio",
        description: "Reaction pathways and enzymes",
      },
      {
        id: "demo-3",
        name: "Isaac Oluwatemilorun",
        subject: "Linear Algebra & Calculus",
        description: "Eigenvalues and matrix decomposition",
      },
      {
        id: "demo-4",
        name: "David Oshodi",
        subject: "Modern World History",
        description: "20th-century political revolutions",
      },
    ];
  }, [buddies]);

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Active StudyBuddies
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Your AI research & study squads
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#105445] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Buddy</span>
          </button>
        </div>

        {/* Buddies List */}
        <div className="space-y-3.5">
          {displayBuddies.map((buddy: any, idx: number) => {
            const status = STATUSES[idx % STATUSES.length];
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const isReal = buddy.id && !buddy.id.startsWith("demo-");

            const content = (
              <div className="group flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}
                  >
                    {buddy.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#105445] transition-colors truncate">
                      {buddy.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {buddy.subject || buddy.description || "General Study"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.className}`}
                  >
                    {status.label}
                  </span>
                  {isReal && (
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#105445] transition-colors" />
                  )}
                </div>
              </div>
            );

            if (isReal) {
              return (
                <Link key={buddy.id} href={`/dashboard/buddies/${buddy.id}`}>
                  {content}
                </Link>
              );
            }

            return <div key={buddy.id}>{content}</div>;
          })}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 text-center">
        <Link
          href="/dashboard/buddies"
          className="text-xs font-bold text-[#105445] hover:underline inline-flex items-center gap-1"
        >
          <span>View all study companions</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
