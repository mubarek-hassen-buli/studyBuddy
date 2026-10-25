"use client";

import * as React from "react";
import { MaterialsHero } from "@/components/dashboard/materials/materials-hero";
import { MaterialsGrid } from "@/components/dashboard/materials/materials-grid";
import { MaterialsSidebar } from "@/components/dashboard/materials/materials-sidebar";
import { useAppStore } from "@/store/app-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileUpload } from "@/components/dashboard/file-upload";
import { useBuddies } from "@/hooks/use-buddies";

export default function DocumentsPage() {
  const { setCreateModalOpen } = useAppStore();
  const { buddies } = useBuddies();
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);

  const defaultBuddyId = buddies && buddies.length > 0 ? buddies[0].id : null;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Page Hero with Titles, Stat Pills, Top Action Buttons, and Folio Character */}
      <MaterialsHero
        onUploadClick={() => setUploadModalOpen(true)}
        onCreateCollectionClick={() => setCreateModalOpen(true)}
      />

      {/* 2. Main Layout Grid: Materials Grid (Left 8.5 cols) + Sidebar (Right 3.5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 xl:col-span-9">
          <MaterialsGrid />
        </div>

        <div className="lg:col-span-4 xl:col-span-3">
          <MaterialsSidebar onUploadClick={() => setUploadModalOpen(true)} />
        </div>
      </div>

      {/* Upload Modal Dialog */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight text-center">
              Upload Material
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500 font-medium">
              Upload PDF, DOCX, TXT, or notes to generate study flashcards and quizzes.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-2">
            {defaultBuddyId ? (
              <FileUpload studyBuddyId={defaultBuddyId} />
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-600 mb-3">
                  Please create a StudyBuddy or collection first to organize your materials.
                </p>
                <button
                  onClick={() => {
                    setUploadModalOpen(false);
                    setCreateModalOpen(true);
                  }}
                  className="rounded-full bg-[#0D382B] text-white text-xs font-bold px-5 py-2.5 shadow-sm"
                >
                  Create StudyBuddy First
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
