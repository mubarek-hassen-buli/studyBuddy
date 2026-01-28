"use client";

import { useDocuments } from "@/hooks/use-documents";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DocumentList({ studyBuddyId }: { studyBuddyId: string }) {
  const { documents, isLoading, deleteDocument } = useDocuments(studyBuddyId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-slate-50 animate-pulse border border-slate-100" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <FileText className="w-10 h-10 text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc: any) => (
        <div 
          key={doc.id} 
          className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{doc.fileName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{doc.fileType}</span>
                <span className="text-slate-200">•</span>
                <StatusBadge status={doc.processingStatus} />
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
            onClick={() => deleteDocument.mutate(doc.id)}
            disabled={deleteDocument.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help">
            {status === "processed" && (
              <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-100 gap-1 px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase">Ready</span>
              </Badge>
            )}
            {status === "processing" && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 gap-1 px-2 py-0.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[10px] font-black uppercase">Processing</span>
              </Badge>
            )}
            {status === "pending" && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 gap-1 px-2 py-0.5">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase">Pending</span>
              </Badge>
            )}
            {status === "error" && (
              <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 gap-1 px-2 py-0.5">
                <AlertCircle className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase">Error</span>
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-medium">
            {status === "processed" && "AI knowledge updated and ready for chat."}
            {status === "processing" && "Vectorizing and chunking document..."}
            {status === "pending" && "Waiting for processing queue."}
            {status === "error" && "Something went wrong during processing."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
