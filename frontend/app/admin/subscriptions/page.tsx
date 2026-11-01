"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import {
  CreditCard,
  Building2,
  Smartphone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Check,
  X,
  Copy,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  SubscriptionRequestItem,
  SubscriptionStatus,
  PaymentMethod,
} from "@/types/admin";

export default function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<"all" | SubscriptionStatus>("all");
  const [methodFilter, setMethodFilter] = React.useState<"all" | PaymentMethod>("all");

  // Inspection & Action Modals
  const [viewingRequest, setViewingRequest] = React.useState<SubscriptionRequestItem | null>(null);
  const [approvingRequest, setApprovingRequest] = React.useState<SubscriptionRequestItem | null>(null);
  const [rejectingRequest, setRejectingRequest] = React.useState<SubscriptionRequestItem | null>(null);
  const [adminNote, setAdminNote] = React.useState("");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Queries
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "subscriptions", { page, status: statusFilter, paymentMethod: methodFilter }],
    queryFn: () =>
      adminApi.getSubscriptions({
        page,
        limit: 15,
        status: statusFilter,
        paymentMethod: methodFilter,
      }),
  });

  const { data: analytics } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => adminApi.getAnalytics(),
  });

  const requests = data?.requests || [];
  const pagination = data?.pagination;

  // Mutations
  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminApi.approveSubscription(id, { adminNotes: notes }),
    onSuccess: (res) => {
      toast.success(res?.message || "Subscription approved & Pro activated!");
      queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setApprovingRequest(null);
      setViewingRequest(null);
      setAdminNote("");
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || "Failed to approve subscription");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminApi.rejectSubscription(id, { adminNotes: notes }),
    onSuccess: (res) => {
      toast.success(res?.message || "Subscription request rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      setRejectingRequest(null);
      setViewingRequest(null);
      setAdminNote("");
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || "Failed to reject subscription");
    },
  });

  const pendingCount = analytics?.subscriptions?.pending ?? 0;
  const approvedCount = analytics?.subscriptions?.approved ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              Subscriptions & Proof Verification
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review Ethiopian student payments via CBE (1000528855354) & Telebirr (0925036911) to activate Pro memberships.
          </p>
        </div>

        {/* Quick summary pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E5EAE7] shadow-2xs text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pending Actions
            </p>
            <p className="text-base font-extrabold text-amber-700 leading-tight">
              {pendingCount}
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E5EAE7] shadow-2xs text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Approved
            </p>
            <p className="text-base font-extrabold text-[#0D382B] leading-tight">
              {approvedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[#E5EAE7] shadow-2xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-1 pl-1">Status:</span>
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-[#0D382B] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Method Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1">Method:</span>
          {(["all", "cbe", "telebirr"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMethodFilter(m);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all cursor-pointer ${
                methodFilter === m
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Loading subscription requests...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-600 text-xs">
            Failed to load subscription requests.
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2 text-xs"
            >
              Retry
            </Button>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No payment verification requests</p>
            <p className="text-[11px] text-slate-400">
              When students submit CBE or Telebirr receipts from the pricing page, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] border-b border-[#E5EAE7] text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-3">Method</th>
                  <th className="py-3.5 px-3">Reference / Phone</th>
                  <th className="py-3.5 px-3">Amount</th>
                  <th className="py-3.5 px-3">Receipt</th>
                  <th className="py-3.5 px-3">Submitted</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE7]">
                {requests.map((req) => {
                  const initial = req.userName ? req.userName.charAt(0).toUpperCase() : "U";

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#0D382B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {initial}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 truncate">{req.userName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{req.userEmail}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                  req.userTier === "pro"
                                    ? "bg-emerald-100 text-[#0D382B]"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {req.userTier}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Payment Method Badge */}
                      <td className="py-3.5 px-3">
                        {req.paymentMethod === "cbe" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            <Building2 className="w-3 h-3 text-amber-700" />
                            <span>CBE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                            <Smartphone className="w-3 h-3 text-sky-600" />
                            <span>Telebirr</span>
                          </span>
                        )}
                      </td>

                      {/* Reference & Phone */}
                      <td className="py-3.5 px-3 font-mono">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-900 text-xs">
                            {req.transactionReference}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(req.transactionReference, req.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy Reference"
                          >
                            {copiedKey === req.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        {req.senderPhoneNumber && (
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                            Tel: {req.senderPhoneNumber}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {req.amount} {req.currency}
                      </td>

                      {/* Receipt Preview */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => setViewingRequest(req)}
                          className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 hover:border-[#0D382B] bg-slate-50 hover:bg-white transition-all cursor-pointer group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={req.receiptUrl}
                            alt="Receipt"
                            className="w-8 h-8 rounded object-cover border border-slate-200"
                          />
                          <span className="text-[10px] font-semibold text-slate-600 group-hover:text-[#0D382B] pr-1">
                            Inspect
                          </span>
                        </button>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {req.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            <Clock className="w-3 h-3 animate-spin text-amber-700" />
                            Pending
                          </span>
                        )}
                        {req.status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#0D382B] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            Approved
                          </span>
                        )}
                        {req.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {req.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => {
                                setApprovingRequest(req);
                                setAdminNote("");
                              }}
                              className="h-7 px-2.5 rounded-lg text-[11px] font-bold bg-[#0D382B] hover:bg-[#07251C] text-white shadow-2xs cursor-pointer gap-1"
                            >
                              <Check className="w-3 h-3 text-emerald-300" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRejectingRequest(req);
                                setAdminNote("");
                              }}
                              className="h-7 px-2 rounded-lg text-[11px] font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 border-rose-200 cursor-pointer"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400">
                            {req.reviewedAt
                              ? `Reviewed ${new Date(req.reviewedAt).toLocaleDateString()}`
                              : "Completed"}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-3 border-t border-[#E5EAE7] flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 gap-1 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 gap-1 text-xs"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Inspection Dialog */}
      <Dialog open={!!viewingRequest} onOpenChange={(open) => !open && setViewingRequest(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border border-[#D5E0D8]">
          <DialogHeader className="space-y-1 pb-2">
            <DialogTitle className="font-serif text-xl font-bold text-slate-900 flex items-center justify-between">
              <span>Receipt Verification</span>
              <a
                href={viewingRequest?.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-sans font-semibold text-emerald-800 hover:underline flex items-center gap-1"
              >
                Open in Full Size <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submitted by <span className="font-bold text-slate-800">{viewingRequest?.userName}</span> ({viewingRequest?.userEmail})
            </DialogDescription>
          </DialogHeader>

          {viewingRequest && (
            <div className="space-y-4 pt-2">
              {/* Receipt Image Display */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 flex items-center justify-center p-2 min-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewingRequest.receiptUrl}
                  alt="Receipt Full Preview"
                  className="max-h-[500px] w-auto object-contain rounded-xl"
                />
              </div>

              {/* Transaction Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Method</span>
                  <p className="font-bold uppercase text-slate-900">{viewingRequest.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Reference Code</span>
                  <p className="font-mono font-bold text-slate-900 truncate">
                    {viewingRequest.transactionReference}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Amount</span>
                  <p className="font-bold text-emerald-800">
                    {viewingRequest.amount} {viewingRequest.currency}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Sender Phone</span>
                  <p className="font-mono text-slate-700">
                    {viewingRequest.senderPhoneNumber || "None provided"}
                  </p>
                </div>
              </div>

              {viewingRequest.adminNotes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Admin Note: </span>
                  {viewingRequest.adminNotes}
                </div>
              )}

              {/* Quick Actions if Pending */}
              {viewingRequest.status === "pending" && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRejectingRequest(viewingRequest);
                      setAdminNote("");
                    }}
                    className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200 rounded-xl cursor-pointer"
                  >
                    Reject Request
                  </Button>
                  <Button
                    onClick={() => {
                      setApprovingRequest(viewingRequest);
                      setAdminNote("");
                    }}
                    className="text-xs bg-[#0D382B] hover:bg-[#07251C] text-white rounded-xl cursor-pointer gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    Approve & Activate Pro
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Modal */}
      <Dialog open={!!approvingRequest} onOpenChange={(open) => !open && setApprovingRequest(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-[#D5E0D8]">
          <DialogHeader className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-[#0D382B]">
                <Sparkles className="w-5 h-5" />
              </span>
              <DialogTitle className="font-serif text-xl font-bold text-slate-900">
                Approve Payment & Activate Pro
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              This will update <span className="font-bold text-slate-800">{approvingRequest?.userName}</span> to{" "}
              <span className="font-bold text-[#0D382B]">Pro tier</span> and grant 30 days of unlimited StudyBuddy access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-bold uppercase text-slate-800">{approvingRequest?.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference:</span>
                <span className="font-mono font-bold text-slate-800">{approvingRequest?.transactionReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-[#0D382B]">{approvingRequest?.amount} {approvingRequest?.currency}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Optional Admin Note
              </label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Verified via CBE Birr app transaction"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D382B]"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApprovingRequest(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={approveMutation.isPending}
              onClick={() => {
                if (approvingRequest) {
                  approveMutation.mutate({
                    id: approvingRequest.id,
                    notes: adminNote.trim() || undefined,
                  });
                }
              }}
              className="rounded-xl text-xs font-bold bg-[#0D382B] hover:bg-[#07251C] text-white cursor-pointer"
            >
              {approveMutation.isPending ? "Activating..." : "Confirm & Activate Pro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal */}
      <Dialog open={!!rejectingRequest} onOpenChange={(open) => !open && setRejectingRequest(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-[#D5E0D8]">
          <DialogHeader className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <AlertCircle className="w-5 h-5" />
              </span>
              <DialogTitle className="font-serif text-xl font-bold text-slate-900">
                Reject Subscription Proof
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Rejecting payment for <span className="font-bold text-slate-800">{rejectingRequest?.userName}</span>.
              The student will see this status on their pricing page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Reason for Rejection *
              </label>
              <textarea
                required
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Transaction reference not found in bank statement, or blurry receipt"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectingRequest(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={rejectMutation.isPending}
              onClick={() => {
                if (rejectingRequest) {
                  rejectMutation.mutate({
                    id: rejectingRequest.id,
                    notes: adminNote.trim() || undefined,
                  });
                }
              }}
              className="rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white cursor-pointer"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

