"use client";

import { useRef, useState } from "react";
import { useDocuments } from "@/hooks/use-documents";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Loader2, FileText } from "lucide-react";

export function FileUpload({ studyBuddyId }: { studyBuddyId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument } = useDocuments(studyBuddyId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload PDF, DOCX, PPTX or TXT.");
      return;
    }

    // Validate size (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max size is 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocument.mutateAsync(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,.pptx,.txt"
      />
      
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center py-10 px-6 
          rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isUploading ? "bg-slate-50 border-slate-200 cursor-not-allowed" : "bg-white border-slate-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md group-hover:scale-[1.01]"}
        `}
      >
        <div className={`p-4 rounded-2xl mb-4 transition-colors ${isUploading ? "bg-slate-100 text-slate-400" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"}`}>
           {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <FileUp className="w-8 h-8" />}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {isUploading ? "Processing Document..." : "Upload Knowledge Source"}
        </h3>
        <p className="text-slate-500 text-sm font-medium text-center max-w-xs">
          {isUploading ? "We're preparing your buddy with new info." : "Click to browse or drag and drop PDF, DOCX, or PPTX files (Max 10MB)."}
        </p>
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-10">
            {/* Overlay to prevent clicks while uploading */}
        </div>
      )}
    </div>
  );
}
