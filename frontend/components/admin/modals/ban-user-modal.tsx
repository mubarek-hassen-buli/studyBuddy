"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserX, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface BanUserModalProps {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BanUserModal({
  userId,
  userName,
  userEmail,
  open,
  onOpenChange,
}: BanUserModalProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = React.useState("");
  const [duration, setDuration] = React.useState<"indefinite" | "24h" | "7d" | "30d">("indefinite");

  React.useEffect(() => {
    if (open) {
      setReason("");
      setDuration("indefinite");
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId || !reason.trim()) return;

      let expiresAt: string | null = null;
      const now = new Date();
      if (duration === "24h") {
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      } else if (duration === "7d") {
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (duration === "30d") {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      return await adminApi.banUser(userId, {
        reason: reason.trim(),
        expiresAt,
      });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "User account suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.data?.message || error?.message || "Failed to suspend account");
    },
  });

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 font-sans">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="font-serif text-lg font-bold text-rose-700 flex items-center gap-2">
            <UserX className="w-5 h-5 text-rose-600" />
            <span>Suspend User Account</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          <p className="text-slate-600">
            You are about to suspend <strong>{userName}</strong> ({userEmail}).
          </p>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Suspending this user will immediately revoke all active browser sessions and prevent further logins until reinstated.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Suspension Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Violation of terms: automated content scraping or offensive uploads"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Suspension Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Indefinite / Permanent", value: "indefinite" },
                { label: "24 Hours", value: "24h" },
                { label: "7 Days", value: "7d" },
                { label: "30 Days", value: "30d" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setDuration(item.value as any)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    duration === item.value
                      ? "border-rose-600 bg-rose-50 text-rose-900 font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-100 pt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !reason.trim()}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs"
          >
            {mutation.isPending ? "Suspending..." : "Confirm Suspension"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

