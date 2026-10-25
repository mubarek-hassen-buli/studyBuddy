"use client";

import * as React from "react";
import { Clock, Layers, Check, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FolioRecentActivity() {
  const activities = [
    {
      id: "1",
      icon: Layers,
      iconBg: "bg-slate-100 text-slate-700",
      title: "Generated flashcards from 'Machine Learning Notes'",
      time: "2 hours ago",
      href: "/dashboard/buddies",
    },
    {
      id: "2",
      icon: Check,
      iconBg: "bg-[#0D382B] text-white",
      title: "Completed Quiz: Python Basics",
      time: "4 hours ago",
      href: "/dashboard/buddies",
    },
    {
      id: "3",
      icon: MessageSquare,
      iconBg: "bg-slate-100 text-slate-700",
      title: "Asked Folio: \"Explain the difference between async and await\"",
      time: "6 hours ago",
      href: "/dashboard/buddies",
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xs border border-[#E5EAE7] flex flex-col justify-between h-full min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#11231B] tracking-tight">Recent Activity</h4>
        </div>
        <Link
          href="/dashboard/documents"
          className="text-[11px] font-bold text-slate-500 hover:text-[#0D382B] flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3 my-auto">
        {activities.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-slate-50/80 transition-colors group"
          >
            <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.iconBg}`}>
              <item.icon className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 group-hover:text-[#0D382B] truncate transition-colors">
                {item.title}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {item.time}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
