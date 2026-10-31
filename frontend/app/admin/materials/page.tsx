"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import {
  FileText,
  Search,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AdminDocument, DocumentProcessingStatus, FileType } from "@/types/admin";

export default function AdminMaterialsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | DocumentProcessingStatus>("all");
  const [fileTypeFilter, setFileTypeFilter] = React.useState<"all" | FileType>("all");

  const [documentToDelete, setDocumentToDelete] = React.useState<AdminDocument | null>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "admin",
      "materials",
      { page, q: debouncedSearch, status: statusFilter, fileType: fileTypeFilter },
    ],
    queryFn: () =>
      adminApi.getMaterials({
        page,
        limit: 15,
        q: debouncedSearch || undefined,
        status: statusFilter,
        fileType: fileTypeFilter,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteMaterial(id),
    onSuccess: (res) => {
      toast.success(res?.message || "Document purged successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "materials"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      setDocumentToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || "Failed to delete document");
    },
  });

  const documents = data?.documents || [];
  const pagination = data?.pagination;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-rose-600" />;
      case "docx":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "ppt":
        return <FileSpreadsheet className="w-4 h-4 text-amber-600" />;
      case "txt":
      default:
        return <FileCode className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: DocumentProcessingStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Failed
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5EAE7] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              Materials Catalog
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              {pagination?.total || 0} Files
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global catalog of documents uploaded across all study buddies. Review processing pipelines and purge files.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAE7] shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D382B]/20 focus:border-[#0D382B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D382B]"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* File Type Filter */}
          <select
            value={fileTypeFilter}
            onChange={(e) => {
              setFileTypeFilter(e.target.value as any);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D382B]"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF (.pdf)</option>
            <option value="docx">Word (.docx)</option>
            <option value="ppt">PowerPoint (.ppt)</option>
            <option value="txt">Text (.txt)</option>
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 border-3 border-[#0D382B] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Fetching materials catalog...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No documents found</p>
            <p className="text-slate-400 mt-0.5">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAF6] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Document</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Study Buddy</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Chunks</th>
                  <th className="py-3.5 px-4">Uploaded</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Filename & Type */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5 max-w-xs">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getFileIcon(doc.fileType)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 truncate" title={doc.fileName}>
                            {doc.fileName}
                          </p>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            {doc.fileType}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 truncate">{doc.ownerName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{doc.ownerEmail}</p>
                    </td>

                    {/* Study Buddy */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 truncate">{doc.studyBuddyName}</p>
                      {doc.studyBuddySubject && (
                        <p className="text-[10px] text-slate-400 truncate">{doc.studyBuddySubject}</p>
                      )}
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatFileSize(doc.fileSize)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">{getStatusBadge(doc.processingStatus)}</td>

                    {/* Chunks */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-500 font-mono">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.chunkCount || 0}</span>
                      </div>
                    </td>

                    {/* Uploaded */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Open File"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => setDocumentToDelete(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Purge Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="py-3 px-4 border-t border-slate-100 bg-[#F8FAF6] flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} documents)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 rounded-lg text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="h-8 rounded-lg text-xs"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Purge Document Confirmation Dialog */}
      <Dialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 font-sans">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="font-serif text-lg font-bold text-rose-700 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Purge Document</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-3 text-xs text-slate-600">
            <p>
              Are you sure you want to permanently purge <strong>{documentToDelete?.fileName}</strong>?
            </p>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] leading-relaxed">
              <strong>Caution:</strong> This administrative purge will remove the document record and delete all {documentToDelete?.chunkCount || 0} associated vector chunks from the database immediately.
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 pt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDocumentToDelete(null)}
              disabled={deleteMutation.isPending}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => documentToDelete && deleteMutation.mutate(documentToDelete.id)}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs"
            >
              {deleteMutation.isPending ? "Purging..." : "Confirm Purge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

