"use client";

import * as React from "react";
import { Folder, FileText, ArrowRight, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useAllDocuments, UserDocument } from "@/hooks/use-all-documents";

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function FolioStudyMaterials() {
  const { documents, isLoading } = useAllDocuments();

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

      {/* Materials List or Empty State */}
      <div className="space-y-2.5 my-auto">
        {documents.length > 0 ? (
          documents.slice(0, 3).map((doc: UserDocument) => (
            <Link
              key={doc.id}
              href="/dashboard/documents"
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-8 w-8 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-[#0D382B] truncate transition-colors">
                    {doc.title || doc.fileName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {(doc.fileType || "PDF").toUpperCase()} • {formatBytes(doc.fileSize)}
                  </p>
                </div>
              </div>

              <div className="h-6 w-6 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:bg-[#0D382B] group-hover:text-white group-hover:border-[#0D382B] flex items-center justify-center shrink-0 transition-all">
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))
        ) : (
          <div className="py-4 text-center">
            <div className="h-8 w-8 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center mb-1.5">
              <UploadCloud className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-700">No materials uploaded yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Drop a note or document to start learning with Folio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
