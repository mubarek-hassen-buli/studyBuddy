"use client";

import * as React from "react";
import {
  Upload,
  Link as LinkIcon,
  NotebookPen,
  Scan,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAllDocuments, UserDocument } from "@/hooks/use-all-documents";

interface MaterialsSidebarProps {
  onUploadClick: () => void;
}

function formatSize(bytes: number): string {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function MaterialsSidebar({ onUploadClick }: MaterialsSidebarProps) {
  const { documents } = useAllDocuments();

  const quickActions = [
    {
      id: "upload",
      title: "Upload File",
      subtitle: "PDF, DOCX, TXT, images and notes",
      icon: Upload,
      action: onUploadClick,
    },
    {
      id: "url",
      title: "Paste from URL",
      subtitle: "Import notes from a link",
      icon: LinkIcon,
      action: onUploadClick,
    },
    {
      id: "note",
      title: "Capture Note",
      subtitle: "Quick-paste your lecture notes",
      icon: NotebookPen,
      action: onUploadClick,
    },
    {
      id: "scan",
      title: "Scan Document",
      subtitle: "Import camera or scanned pages",
      icon: Scan,
      action: onUploadClick,
    },
  ];

  const recentUploads = documents.slice(0, 4);

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
              type="button"
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
          {recentUploads.length > 0 ? (
            recentUploads.map((doc: UserDocument) => {
              const ext = (doc.fileType || "pdf").toUpperCase();
              const dateStr = doc.createdAt
                ? new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Recent";

              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[#0D382B] flex items-center justify-center font-bold text-[10px] shrink-0 border border-emerald-100">
                      {ext.slice(0, 4)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#0D382B] truncate transition-colors">
                        {doc.title || doc.fileName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {ext} • {formatSize(doc.fileSize)} • {dateStr}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0D382B] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })
          ) : (
            <div className="py-4 text-center">
              <Sparkles className="w-4 h-4 text-slate-300 mx-auto mb-1" />
              <p className="text-xs text-slate-500 font-semibold">No recent uploads</p>
              <button
                type="button"
                onClick={onUploadClick}
                className="text-[11px] text-[#0D382B] font-bold hover:underline mt-1 inline-block"
              >
                + Add your first file
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
