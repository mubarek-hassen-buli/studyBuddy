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
import { ShieldCheck, ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/types/admin";

interface ChangeRoleModalProps {
  userId: string | null;
  currentRole: UserRole | null;
  userName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeRoleModal({
  userId,
  currentRole,
  userName,
  open,
  onOpenChange,
}: ChangeRoleModalProps) {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("user");

  React.useEffect(() => {
    if (currentRole) {
      setSelectedRole(currentRole);
    }
  }, [currentRole, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      return await adminApi.updateUserRole(userId, selectedRole);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user", userId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.data?.message || error?.message || "Failed to update role");
    },
  });

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 font-sans">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0D382B]" />
            <span>Change User Role</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          <p className="text-slate-600">
            Updating system authorization role for <strong>{userName}</strong>. The system strictly
            enforces two role levels:
          </p>

          {/* Role selection radio boxes */}
          <div className="space-y-2">
            {/* Standard User */}
            <div
              onClick={() => setSelectedRole("user")}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedRole === "user"
                  ? "border-[#0D382B] bg-[#E8F2EC]/50 text-slate-900 shadow-2xs"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Standard User</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono">
                    user
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard application access: creates study buddies, uploads personal documents,
                  studies flashcards and quizzes.
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                  selectedRole === "user"
                    ? "border-[#0D382B] bg-[#0D382B] text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedRole === "user" && <Check className="w-3 h-3" />}
              </div>
            </div>

            {/* Super Admin */}
            <div
              onClick={() => setSelectedRole("super_admin")}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                selectedRole === "super_admin"
                  ? "border-[#0D382B] bg-[#E8F2EC]/50 text-slate-900 shadow-2xs"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Super Administrator</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold">
                    super_admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Full administrative authority: inspects users, alters roles and tiers, suspends accounts,
                  purges materials, and views security audit logs.
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                  selectedRole === "super_admin"
                    ? "border-[#0D382B] bg-[#0D382B] text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedRole === "super_admin" && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>

          {selectedRole === "super_admin" && currentRole !== "super_admin" && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Elevated Privilege Warning:</strong> Promoting this user will give them unrestricted
                access to manage other users and system data.
              </p>
            </div>
          )}
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
            disabled={mutation.isPending || selectedRole === currentRole}
            className="bg-[#0D382B] hover:bg-[#07251C] text-white rounded-xl text-xs"
          >
            {mutation.isPending ? "Updating..." : "Save Role Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

