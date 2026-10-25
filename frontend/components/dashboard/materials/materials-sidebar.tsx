"use client";

import * as React from "react";
import {
  Upload,
  Link as LinkIcon,
  NotebookPen,
  Scan,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface MaterialsSidebarProps {
  onUploadClick: () => void;
}

export function MaterialsSidebar({ onUploadClick }: MaterialsSidebarProps) {
  const quickActions = [
    {
      id: "upload",
      title: "Upload File",
      subtitle: "PDF, DOCX, TXT, images and more",
      icon: Upload,
      action: onUploadClick,
    },
    {
      id: "url",
      title: "Paste from URL",
      subtitle: "Add a link to any web page",
      icon: LinkIcon,
      action: onUploadClick,
    },
    {
      id: "note",
      title: "Capture Note",
      subtitle: "Write or voice your notes",
      icon: NotebookPen,
      action: onUploadClick,
    },
    {
      id: "scan",
      title: "Scan Document",
      subtitle: "Use your camera to scan",
      icon: Scan,
      action: onUploadClick,
    },
  ];

  const recentUploads = [
    {
      id: "1",
      title: "Machine Learning Fundamentals",
      type: "PDF",
      size: "4.2 MB",
      date: "Oct 24, 2026",
      badgeColor: "bg-rose-50 text-rose-600",
      href: "/dashboard/documents",
    },
    {
      id: "2",
      title: "React Hooks Guide",
      type: "NOTE",
      size: "245 KB",
      date: "Oct 22, 2026",
      badgeColor: "bg-purple-50 text-purple-600",
      href: "/dashboard/documents",
    },
    {
      id: "3",
      title: "Docker Documentation",
      type: "LINK",
      size: "12 KB",
      date: "Oct 20, 2026",
      badgeColor: "bg-emerald-50 text-emerald-600",
      href: "/dashboard/documents",
    },
    {
      id: "4",
      title: "System Design Diagram",
      type: "IMAGE",
      size: "1.2 MB",
      date: "Oct 18, 2026",
      badgeColor: "bg-sky-50 text-sky-600",
      href: "/dashboard/documents",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Quick Actions Card */}
      <div className="rounded-2xl bg-white p-5 shadow-2xs border border-[#E5EAE7]">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
          Quick Actions
        </h4>

        <div className="space-y-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="h-9 w-9 rounded-full bg-[#E8F2EC] text-[#0D382B] group-hover:bg-[#0D382B] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <action.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-[#0D382B] transition-colors truncate">
                  {action.title}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {action.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Recent Uploads Card */}
      <div className="rounded-2xl bg-white p-5 shadow-2xs border border-[#E5EAE7]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Uploads
          </h4>
          <Link
            href="/dashboard/documents"
            className="text-[11px] font-bold text-slate-500 hover:text-[#0D382B] flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {recentUploads.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${item.badgeColor}`}
                >
                  {item.type}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[#0D382B] truncate transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {item.type} • {item.size} • {item.date}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0D382B] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
