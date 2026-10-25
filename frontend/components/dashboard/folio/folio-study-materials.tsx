"use client";

import * as React from "react";
import { Folder, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAllDocuments } from "@/hooks/use-all-documents";

interface MaterialItem {
  id: string;
  name: string;
  type: string;
  pages?: string;
  href: string;
}

const DEFAULT_MATERIALS: MaterialItem[] = [
  {
    id: "1",
    name: "Machine Learning Notes",
    type: "PDF",
    pages: "24 pages",
    href: "/dashboard/documents",
  },
  {
    id: "2",
    name: "Web Development Guide",
    type: "PDF",
    pages: "18 pages",
    href: "/dashboard/documents",
  },
  {
    id: "3",
    name: "Arabic Grammar",
    type: "PDF",
    pages: "32 pages",
    href: "/dashboard/documents",
  },
];

export function FolioStudyMaterials() {
  const { documents } = useAllDocuments();

  // If user has uploaded docs, prioritize them; otherwise display the showcase materials
  const items: MaterialItem[] =
    documents && documents.length > 0
      ? documents.slice(0, 3).map((doc: any) => ({
          id: doc.id,
          name: doc.title || doc.fileName || "Uploaded Material",
          type: (doc.fileType || "PDF").toUpperCase(),
          pages: doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : "15 pages",
          href: doc.studyBuddyId
            ? `/dashboard/buddies/${doc.studyBuddyId}`
            : "/dashboard/documents",
        }))
      : DEFAULT_MATERIALS;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xs border border-[#E5EAE7] flex flex-col justify-between h-full min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#11231B] tracking-tight">Study Materials</h4>
        </div>
        <Link
          href="/dashboard/documents"
          className="text-[11px] font-bold text-slate-500 hover:text-[#0D382B] flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Materials List */}
      <div className="space-y-2.5 my-auto">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 group-hover:text-[#0D382B] truncate transition-colors">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {item.type} • {item.pages}
                </p>
              </div>
            </div>

            <div className="h-6 w-6 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:bg-[#0D382B] group-hover:text-white group-hover:border-[#0D382B] flex items-center justify-center shrink-0 transition-all">
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
