"use client";

import * as React from "react";
import {
  FileText,
  FileCode,
  NotebookPen,
  Link as LinkIcon,
  Image as ImageIcon,
  Tag,
  ChevronDown,
  LayoutGrid,
  List,
  MoreHorizontal,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useAllDocuments } from "@/hooks/use-all-documents";

interface MaterialCardItem {
  id: string;
  title: string;
  type: "PDF" | "DOCX" | "NOTE" | "LINK" | "IMAGE" | "OTHER";
  size: string;
  date: string;
  isReady: boolean;
  href: string;
}

const SHOWCASE_MATERIALS: MaterialCardItem[] = [
  {
    id: "1",
    title: "Computer Science Notes",
    type: "PDF",
    size: "4.2 MB",
    date: "Oct 24, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    type: "DOCX",
    size: "1.8 MB",
    date: "Oct 22, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "3",
    title: "React Hooks Guide",
    type: "NOTE",
    size: "245 KB",
    date: "Oct 20, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "4",
    title: "Docker Documentation",
    type: "LINK",
    size: "12 KB",
    date: "Oct 18, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "5",
    title: "System Design Diagram",
    type: "IMAGE",
    size: "1.2 MB",
    date: "Oct 16, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "6",
    title: "Islamic Jurisprudence (Fiqh)",
    type: "PDF",
    size: "3.6 MB",
    date: "Oct 14, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "7",
    title: "Product Ideas",
    type: "NOTE",
    size: "512 KB",
    date: "Oct 12, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "8",
    title: "Business Strategy",
    type: "DOCX",
    size: "890 KB",
    date: "Oct 10, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
  {
    id: "9",
    title: "Bybit API Documentation",
    type: "LINK",
    size: "18 KB",
    date: "Oct 8, 2026",
    isReady: true,
    href: "/dashboard/documents",
  },
];

export function MaterialsGrid() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const { documents } = useAllDocuments();

  // Merge real documents if uploaded with showcase items
  const items: MaterialCardItem[] = React.useMemo(() => {
    if (documents && documents.length > 0) {
      const realItems: MaterialCardItem[] = documents.map((doc: any) => {
        const ext = (doc.fileType || "pdf").toUpperCase();
        let type: MaterialCardItem["type"] = "PDF";
        if (ext.includes("DOC")) type = "DOCX";
        else if (ext.includes("TXT") || ext.includes("NOTE")) type = "NOTE";
        else if (ext.includes("LINK") || ext.includes("URL")) type = "LINK";
        else if (ext.includes("IMAGE") || ext.includes("PNG") || ext.includes("JPG")) type = "IMAGE";

        return {
          id: doc.id,
          title: doc.title || doc.fileName || "Uploaded Material",
          type,
          size: doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : "1.2 MB",
          date: doc.createdAt
            ? new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Today",
          isReady: true,
          href: doc.studyBuddyId ? `/dashboard/buddies/${doc.studyBuddyId}` : "/dashboard/documents",
        };
      });

      // Combine with showcase items so grid is fully populated
      const combined = [...realItems];
      SHOWCASE_MATERIALS.forEach((m) => {
        if (!combined.some((c) => c.title.toLowerCase() === m.title.toLowerCase())) {
          combined.push(m);
        }
      });
      return combined.slice(0, 9);
    }
    return SHOWCASE_MATERIALS;
  }, [documents]);

  const filterTabs = [
    { id: "all", label: "All Materials", icon: null },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "notes", label: "Notes", icon: NotebookPen },
    { id: "links", label: "Web Links", icon: LinkIcon },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "other", label: "Other", icon: Tag },
  ];

  const getTypeStyle = (type: MaterialCardItem["type"]) => {
    switch (type) {
      case "PDF":
        return { bg: "bg-rose-50 text-rose-600 border border-rose-100", label: "PDF" };
      case "DOCX":
        return { bg: "bg-blue-50 text-blue-600 border border-blue-100", label: "DOC" };
      case "NOTE":
        return { bg: "bg-purple-50 text-purple-600 border border-purple-100", label: "NOTE" };
      case "LINK":
        return { bg: "bg-emerald-50 text-emerald-600 border border-emerald-100", label: "LINK" };
      case "IMAGE":
        return { bg: "bg-sky-50 text-sky-600 border border-sky-100", label: "IMG" };
      default:
        return { bg: "bg-slate-50 text-slate-600 border border-slate-100", label: "FILE" };
    }
  };

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
          <div className="flex items-center gap-1 bg-white border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
            <span>Newest first</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 bg-white border border-[#E5EAE7] rounded-lg shadow-2xs">
            <button
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

      {/* Materials Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {items.map((item) => {
          const badge = getTypeStyle(item.type);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative rounded-2xl bg-white p-4 shadow-2xs hover:shadow-md transition-all border border-[#E5EAE7] flex flex-col justify-between min-h-[135px] active:scale-99"
            >
              {/* Top Row: Type Badge + Info + Three Dots */}
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
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {item.type} • {item.size}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.date}
                    </p>
                  </div>
                </div>

                {/* More Options Menu */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Row: Ready for Study Tag */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0D382B] bg-[#E8F2EC] px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Ready for study
                </span>
              </div>
            </Link>
          );
        })}
      </div>

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
          href="/dashboard/buddies"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-5 py-2.5 shadow-xs transition-all shrink-0 active:scale-95"
        >
          <span>Try It Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
