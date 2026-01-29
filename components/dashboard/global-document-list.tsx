"use client";

import { useAllDocuments } from "@/hooks/use-all-documents";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Loader2, BrainCircuit, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/hooks/use-documents";

export function GlobalDocumentList() {
  const { documents, isLoading } = useAllDocuments();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-[24px] bg-slate-50 animate-pulse border border-slate-100" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
        <FileText className="w-16 h-16 text-slate-300 mb-6" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No documents found</h3>
        <p className="text-slate-500 font-medium">Upload materials to your Buddies to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc: any) => (
        <div 
          key={doc.id} 
          className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
        >
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">{doc.fileName}</h4>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest px-2">
                  {doc.fileType}
                </Badge>
                <span className="text-slate-200">•</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                   <BrainCircuit className="w-3.5 h-3.5" />
                   <span className="text-xs font-bold">{doc.buddyName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
              onClick={() => window.open(doc.fileUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Button>
            <DeleteAction documentId={doc.id} buddyId={doc.studyBuddyId} />
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none">
             <FileText className="w-32 h-32 text-primary" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DeleteAction({ documentId, buddyId }: { documentId: string, buddyId: string }) {
  const { deleteDocument } = useDocuments(buddyId);
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      onClick={() => deleteDocument.mutate(documentId)}
      disabled={deleteDocument.isPending}
    >
      {deleteDocument.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
