"use client";

import * as React from "react";
import {
  FileText,
  NotebookPen,
  ChevronDown,
  LayoutGrid,
  List,
  BookOpen,
  ArrowRight,
  Trash2,
  UploadCloud,
  FileCode,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAllDocuments, UserDocument } from "@/hooks/use-all-documents";

interface MaterialsGridProps {
  onUploadClick?: () => void;
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function getDocumentTypeConfig(fileType: string) {
  const ext = (fileType || "pdf").toLowerCase();
  if (ext.includes("pdf")) {
    return { bg: "bg-rose-50 text-rose-600 border border-rose-100", label: "PDF", category: "documents" };
  }
  if (ext.includes("doc") || ext.includes("word")) {
    return { bg: "bg-blue-50 text-blue-600 border border-blue-100", label: "DOC", category: "documents" };
  }
  if (ext.includes("ppt") || ext.includes("powerpoint")) {
    return { bg: "bg-amber-50 text-amber-700 border border-amber-100", label: "PPT", category: "documents" };
  }
  if (ext.includes("txt") || ext.includes("note") || ext.includes("md")) {
    return { bg: "bg-purple-50 text-purple-600 border border-purple-100", label: "NOTE", category: "notes" };
  }
  return { bg: "bg-slate-50 text-slate-600 border border-slate-100", label: "FILE", category: "other" };
}

export function MaterialsGrid({ onUploadClick }: MaterialsGridProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "documents" | "notes" | "other">("all");
  const [sortBy, setSortBy] = React.useState<"newest" | "oldest" | "name" | "size">("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const { documents, isLoading, deleteDocument } = useAllDocuments();

  // Filter documents
  const filteredDocuments = React.useMemo(() => {
    let list = [...documents];

    if (activeTab !== "all") {
      list = list.filter((doc) => {
        const config = getDocumentTypeConfig(doc.fileType);
        return config.category === activeTab;
      });
    }

    // Sort documents
    list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "name") {
        return (a.title || a.fileName).localeCompare(b.title || b.fileName);
      }
      if (sortBy === "size") {
        return (b.fileSize || 0) - (a.fileSize || 0);
      }
      return 0;
    });

    return list;
  }, [documents, activeTab, sortBy]);

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to remove this document?")) {
      try {
        setDeletingId(docId);
        await deleteDocument(docId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filterTabs = [
    { id: "all" as const, label: "All Materials", icon: null },
    { id: "documents" as const, label: "Documents", icon: FileText },
    { id: "notes" as const, label: "Notes & Text", icon: NotebookPen },
    { id: "other" as const, label: "Other Files", icon: Tag },
  ];

  return (
    <div className="space-y-4">
      {/* Filters and Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E5EAE7] rounded-xl shadow-2xs">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0D382B] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Sort & View Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-1 bg-white border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <span className="capitalize">{sortBy === "newest" ? "Newest first" : sortBy === "oldest" ? "Oldest first" : sortBy === "name" ? "Name (A-Z)" : "Largest size"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setSortBy("newest"); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${sortBy === "newest" ? "font-bold text-[#0D382B] bg-emerald-50" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Newest first
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("oldest"); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${sortBy === "oldest" ? "font-bold text-[#0D382B] bg-emerald-50" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Oldest first
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("name"); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${sortBy === "name" ? "font-bold text-[#0D382B] bg-emerald-50" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Name (A-Z)
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("size"); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${sortBy === "size" ? "font-bold text-[#0D382B] bg-emerald-50" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Largest size
                </button>
              </div>
            )}
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 bg-white border border-[#E5EAE7] rounded-lg shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded ${
                viewMode === "grid"
                  ? "bg-[#E8F2EC] text-[#0D382B]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1 rounded ${
                viewMode === "list"
                  ? "bg-[#E8F2EC] text-[#0D382B]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Materials Cards Grid */}
      {filteredDocuments.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
              : "space-y-2.5"
          }
        >
          {filteredDocuments.map((doc: UserDocument) => {
            const badge = getDocumentTypeConfig(doc.fileType);
            const dateStr = doc.createdAt
              ? new Date(doc.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            return (
              <div
                key={doc.id}
                className={`group relative rounded-2xl bg-white p-4 shadow-2xs hover:shadow-md transition-all border border-[#E5EAE7] flex flex-col justify-between ${
                  viewMode === "grid" ? "min-h-[135px]" : "py-3"
                }`}
              >
                {/* Top Row: Type Badge + Info + Delete Action */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Badge */}
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-[10px] tracking-wide shrink-0 ${badge.bg}`}
                    >
                      {badge.label}
                    </div>

                    {/* Title & Metadata */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D382B] transition-colors truncate">
                        {doc.title || doc.fileName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {badge.label} • {formatFileSize(doc.fileSize)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {dateStr}
                      </p>
                    </div>
                  </div>

                  {/* Delete Document Button */}
                  <button
                    type="button"
                    disabled={deletingId === doc.id}
                    onClick={(e) => handleDelete(e, doc.id)}
                    title="Remove document"
                    className="h-7 w-7 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600 flex items-center justify-center transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Row: Companion & Study Link */}
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#0D382B] bg-[#E8F2EC] px-2.5 py-0.5 rounded-full border border-emerald-100 truncate max-w-[170px]">
                    {doc.studyBuddyName || "Active Material"}
                  </span>

                  <Link
                    href={`/dashboard/chat?studyBuddyId=${doc.studyBuddyId}`}
                    className="text-[11px] font-bold text-[#0D382B] hover:underline flex items-center gap-1"
                  >
                    <span>Study</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Clean Folio Empty State */
        <div className="rounded-3xl bg-white p-8 text-center border border-[#E5EAE7] shadow-xs flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative w-24 h-24 mb-3">
            <Image
              src="/images/folio.png"
              alt="Folio character"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight">
            No study materials found
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mt-1 mb-5">
            {activeTab !== "all"
              ? `You don't have any ${activeTab} uploaded yet. Switch back to "All Materials" or upload new files.`
              : "Upload your PDFs, class notes, or documents to let Folio generate flashcards and quizzes."}
          </p>
          {onUploadClick && (
            <button
              type="button"
              onClick={onUploadClick}
              className="inline-flex items-center gap-2 rounded-full bg-[#0D382B] text-white text-xs font-bold px-5 py-2.5 shadow-xs hover:bg-[#07241C] transition-all active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Your First Material</span>
            </button>
          )}
        </div>
      )}

      {/* Interactive Bottom Banner: Turn your materials into interactive learning tools */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-2xs border border-[#E5EAE7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-[#0D382B] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Turn your materials into interactive learning tools
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Generate flashcards, quizzes, and chat with Folio — all from your study materials.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/flashcards"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-5 py-2.5 shadow-xs transition-all shrink-0 active:scale-95"
        >
          <span>Create Flashcards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
