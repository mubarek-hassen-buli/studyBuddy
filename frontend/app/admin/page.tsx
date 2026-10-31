"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import {
  Users,
  ShieldCheck,
  Sparkles,
  FileText,
  HardDrive,
  Brain,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function AdminOverviewPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: adminApi.getAnalytics,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <div className="h-10 w-10 border-3 border-[#0D382B] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Aggregating system statistics...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-rose-200 text-center font-sans">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-slate-900 text-sm">Failed to load analytics</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">An error occurred while compiling system metrics.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#0D382B] text-white text-xs font-semibold rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { users, content } = data;

  // Chart data: Tiers & Roles
  const tierData = [
    { name: "Free Tier", count: users.freeTier, fill: "#64748B" },
    { name: "Pro Tier", count: users.proTier, fill: "#8B5CF6" },
  ];

  const statusData = [
    { name: "Completed", count: content.documentStatus.completed, fill: "#10B981" },
    { name: "Processing", count: content.documentStatus.processing, fill: "#F59E0B" },
    { name: "Pending", count: content.documentStatus.pending, fill: "#64748B" },
    { name: "Failed", count: content.documentStatus.failed, fill: "#EF4444" },
  ];

  const roleData = [
    { name: "Super Admins", value: users.superAdmins, fill: "#0D382B" },
    { name: "Standard Users", value: users.standardUsers, fill: "#94A3B8" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5EAE7] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              System Overview
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-[#0D382B] border border-emerald-300">
              Live Workload
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry across users, document storage, and active learning engines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE7] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#0D382B]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{users.total}</p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="font-semibold text-emerald-800">{users.superAdmins} Super Admin</span>
            <span>•</span>
            <span>{users.standardUsers} Standard</span>
          </div>
        </div>

        {/* Growth & Signups */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE7] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">New Signups</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-950 tracking-tight">+{users.newLast7Days}</p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Last 7 days</span>
            <span>•</span>
            <span className="font-semibold text-slate-700">+{users.newLast30Days} in 30 days</span>
          </div>
        </div>

        {/* Documents & Storage */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE7] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Storage & Docs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {content.storageMegabytes} <span className="text-base font-bold text-slate-500">MB</span>
          </p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">{content.documents} Documents</span>
            <span>•</span>
            <span>{content.studyBuddies} Buddies</span>
          </div>
        </div>

        {/* Learning Engagement */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE7] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Learning Activity</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{content.flashcards + content.quizzes}</p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>{content.flashcards} Cards</span>
            <span>•</span>
            <span>{content.quizzes} Quizzes</span>
            <span>•</span>
            <span>{content.studyMinutes}m studied</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5EAE7] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">User Subscriptions</h3>
              <p className="text-xs text-slate-400">Distribution between Free and Pro members</p>
            </div>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px",
                    border: "none",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {tierData.map((entry, index) => (
                    <Cell key={`tier-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
              <span className="text-slate-600 font-medium">Free: {users.freeTier}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              <span className="text-slate-600 font-medium">Pro: {users.proTier}</span>
            </div>
          </div>
        </div>

        {/* Document Processing Health */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5EAE7] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">Document Processing Status</h3>
              <p className="text-xs text-slate-400">Ingestion & vectorization pipeline health</p>
            </div>
            <FileText className="w-4 h-4 text-[#0D382B]" />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px",
                    border: "none",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 text-[11px]">
            <span className="text-emerald-700 font-semibold">Completed: {content.documentStatus.completed}</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">Processing: {content.documentStatus.processing}</span>
            <span>•</span>
            <span className="text-rose-700 font-semibold">Failed: {content.documentStatus.failed}</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="p-5 bg-white rounded-2xl border border-[#E5EAE7] hover:border-[#0D382B]/30 hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D382B] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#0D382B] transition-colors">
              User Directory
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Browse {users.total} registered users, toggle subscriptions, grant super admin status, or suspend accounts.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0D382B] mt-4 pt-3 border-t border-slate-100">
            <span>Manage users</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/materials"
          className="p-5 bg-white rounded-2xl border border-[#E5EAE7] hover:border-[#0D382B]/30 hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
              Materials Catalog
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Inspect {content.documents} uploaded documents ({content.storageMegabytes} MB), vector chunking status, and perform administrative purges.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-800 mt-4 pt-3 border-t border-slate-100">
            <span>Inspect materials</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/audit-logs"
          className="p-5 bg-white rounded-2xl border border-[#E5EAE7] hover:border-[#0D382B]/30 hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              Security Audit Trail
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Immutable ledger of all role alterations, subscription overrides, suspensions, and administrative deletions.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mt-4 pt-3 border-t border-slate-100">
            <span>View audit logs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}

