"use client";

import * as React from "react";
import Image from "next/image";
import { FileText, Folder, HardDrive, Plus, FolderPlus } from "lucide-react";
import { useAllDocuments } from "@/hooks/use-all-documents";

interface MaterialsHeroProps {
  onUploadClick: () => void;
  onCreateCollectionClick: () => void;
}

export function MaterialsHero({ onUploadClick, onCreateCollectionClick }: MaterialsHeroProps) {
  const { documents } = useAllDocuments();
  const totalCount = documents?.length ? Math.max(12, documents.length) : 12;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-transparent pt-2 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Titles & Stats */}
        <div className="max-w-xl z-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-800">
            YOUR KNOWLEDGE, ORGANIZED
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#11231B] tracking-tight leading-tight mt-1 mb-2">
            My Materials
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
            Upload, organize, and manage your study materials. Turn your notes, PDFs, and documents into flashcards, quizzes, and more.
          </p>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
            {/* Total Materials */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5EAE7] rounded-xl px-3.5 py-2 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">
                  {totalCount}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Total Materials
                </span>
              </div>
            </div>

            {/* Collections */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5EAE7] rounded-xl px-3.5 py-2 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
                <Folder className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">
                  4
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Collections
                </span>
              </div>
            </div>

            {/* Storage Used */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5EAE7] rounded-xl px-3.5 py-2 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center">
                <HardDrive className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">
                  18.6 MB
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Storage Used
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Character Illustration & Speech Bubble & Top Actions */}
        <div className="flex flex-col items-end z-10">
          {/* Top Actions Row */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onUploadClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Material</span>
            </button>

            <button
              onClick={onCreateCollectionClick}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold transition-all shadow-2xs active:scale-95"
            >
              <FolderPlus className="w-4 h-4 text-slate-500" />
              <span>Create Collection</span>
            </button>
          </div>

          {/* Character + Speech Bubble */}
          <div className="relative flex items-center justify-end select-none mt-2">
            {/* Speech Bubble */}
            <div className="relative mr-3 max-w-[210px] sm:max-w-[230px] rounded-2xl bg-[#EBF4EE] border border-[#D4E7DC] p-3 shadow-2xs">
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#EBF4EE] border-t border-r border-[#D4E7DC] rotate-45" />
              <p className="font-handwriting text-base text-[#133226] font-bold leading-tight">
                Great materials lead to great results!
              </p>
              <p className="font-handwriting text-xs text-[#234839] leading-snug mt-1">
                Upload something new or turn your existing files into study tools.
              </p>
              <p className="font-handwriting text-xs text-[#234839] text-right mt-1 font-semibold">
                — Folio
              </p>
            </div>

            {/* Character Image */}
            <div className="relative">
              <div className="absolute -left-2 top-6 text-amber-500 text-xs font-black tracking-widest rotate-[-15deg] pointer-events-none">
                \ | /
              </div>
              <div className="relative w-36 h-40 sm:w-44 sm:h-48 shrink-0">
                <Image
                  src="/images/folio.png"
                  alt="Folio Character"
                  width={180}
                  height={190}
                  priority
                  className="w-full h-full object-contain object-bottom drop-shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
