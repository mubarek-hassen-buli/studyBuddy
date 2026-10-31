"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  Brain,
  Layers,
  Clock,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  History,
} from "lucide-react";

interface UserDetailsModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({ userId, open, onOpenChange }: UserDetailsModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: () => (userId ? adminApi.getUser(userId) : null),
    enabled: !!userId && open,
  });

  if (!userId) return null;

  const user = data?.user;
  const stats = data?.stats;
  const auditHistory = data?.auditHistory || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 p-6 font-sans">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="font-serif text-xl font-bold text-slate-900 flex items-center justify-between">
            <span>User Profile & Statistics</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 border-3 border-[#0D382B] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Loading user details...</p>
          </div>
        ) : !user ? (
          <div className="py-8 text-center text-xs text-slate-500">User not found</div>
        ) : (
          <div className="space-y-6 pt-2">
            {/* Header Identity Row */}
            <div className="flex items-start justify-between bg-[#F8FAF6] p-4 rounded-xl border border-[#E5EAE7]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#0D382B] text-white flex items-center justify-center text-base font-bold shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">ID: {user.id}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.role === "super_admin"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {user.role === "super_admin" ? "Super Admin" : "User"}
                </span>

                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    user.tier === "pro"
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {user.tier.toUpperCase()} TIER
                </span>
              </div>
            </div>

            {/* Suspension Notice if Banned */}
            {user.banned && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="text-xs">
                  <p className="font-bold">Account is Currently Suspended</p>
                  <p className="text-rose-700 mt-0.5">
                    <strong>Reason:</strong> {user.banReason || "No reason specified."}
                  </p>
                  {user.banExpires && (
                    <p className="text-[11px] text-rose-600 mt-0.5">
                      Expires: {new Date(user.banExpires).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Metrics Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Learning & Resource Usage
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Study Buddies</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{stats?.studyBuddiesCount || 0}</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Documents</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{stats?.documentsCount || 0}</p>
                  <p className="text-[10px] text-slate-400">{stats?.storageMegabytes || 0} MB</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Flashcards</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{stats?.flashcardsCount || 0}</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Brain className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Quizzes</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{stats?.quizzesCount || 0}</p>
                  <p className="text-[10px] text-slate-400">Avg {stats?.averageQuizPercentage || 0}%</p>
                </div>
              </div>
            </div>

            {/* Account Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Study Time: {stats?.totalStudyMinutes || 0} mins</span>
              </div>
            </div>

            {/* Recent Audit Logs Concerning This User */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Administrative Actions
                </h4>
              </div>

              {auditHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                  No administrative actions recorded for this account.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {auditHistory.map((log) => (
                    <div key={log.id} className="p-2.5 bg-white flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{log.action}</span>
                        <p className="text-[11px] text-slate-400">By {log.adminEmail}</p>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

