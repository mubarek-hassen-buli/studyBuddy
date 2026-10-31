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
import { Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { UserTier } from "@/types/admin";

interface ChangeTierModalProps {
  userId: string | null;
  currentTier: UserTier | null;
  userName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeTierModal({
  userId,
  currentTier,
  userName,
  open,
  onOpenChange,
}: ChangeTierModalProps) {
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = React.useState<UserTier>("free");

  React.useEffect(() => {
    if (currentTier) {
      setSelectedTier(currentTier);
    }
  }, [currentTier, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      return await adminApi.updateUserTier(userId, selectedTier);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "User tier updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user", userId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.data?.message || error?.message || "Failed to update tier");
    },
  });

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 font-sans">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Update Subscription Tier</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          <p className="text-slate-600">
            Adjusting subscription tier assignment for <strong>{userName}</strong>:
          </p>

          <div className="space-y-2">
            {/* Free Tier */}
            <div
              onClick={() => setSelectedTier("free")}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedTier === "free"
                  ? "border-[#0D382B] bg-[#E8F2EC]/40 text-slate-900 shadow-2xs"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Free Tier</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono">
                    free
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard quotas: 1 Study Buddy, up to 1 document per buddy, limited AI messages.
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                  selectedTier === "free"
                    ? "border-[#0D382B] bg-[#0D382B] text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedTier === "free" && <Check className="w-3 h-3" />}
              </div>
            </div>

            {/* Pro Tier */}
            <div
              onClick={() => setSelectedTier("pro")}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedTier === "pro"
                  ? "border-purple-600 bg-purple-50/50 text-slate-900 shadow-2xs"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-900">Pro Tier</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-800 font-mono font-bold">
                    pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Unlimited study buddies, elevated AI chat generations, advanced quiz and flashcard options.
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                  selectedTier === "pro"
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedTier === "pro" && <Check className="w-3 h-3" />}
              </div>
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
            disabled={mutation.isPending || selectedTier === currentTier}
            className="bg-[#0D382B] hover:bg-[#07251C] text-white rounded-xl text-xs"
          >
            {mutation.isPending ? "Updating..." : "Save Tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

