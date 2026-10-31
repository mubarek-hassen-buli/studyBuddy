"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import {
  History,
  ShieldCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  Code2,
  Terminal,
  Clock,
  UserCheck,
  UserX,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminAuditLog } from "@/types/admin";

export default function AdminAuditLogsPage() {
  const [page, setPage] = React.useState(1);
  const [actionFilter, setActionFilter] = React.useState<string>("all");
  const [expandedLogId, setExpandedLogId] = React.useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "audit-logs", { page, action: actionFilter }],
    queryFn: () =>
      adminApi.getAuditLogs({
        page,
        limit: 20,
        action: actionFilter === "all" ? undefined : actionFilter,
      }),
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination;

  const getActionBadge = (action: string) => {
    switch (action) {
      case "USER_ROLE_UPDATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            ROLE_UPDATE
          </span>
        );
      case "USER_TIER_UPDATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-700" />
            TIER_UPDATE
          </span>
        );
      case "USER_BANNED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <UserX className="w-3 h-3 text-rose-600" />
            ACCOUNT_BANNED
          </span>
        );
      case "USER_UNBANNED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            ACCOUNT_REINSTATED
          </span>
        );
      case "DOCUMENT_DELETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <FileText className="w-3 h-3 text-amber-700" />
            DOC_PURGED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {action}
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
              Security Audit Trail
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              {pagination?.total || 0} Events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident, immutable audit trail tracking all administrative state changes and privileges.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D382B]"
          >
            <option value="all">All Action Types</option>
            <option value="USER_ROLE_UPDATE">Role Modifications</option>
            <option value="USER_TIER_UPDATE">Tier Modifications</option>
            <option value="USER_BANNED">Suspensions</option>
            <option value="USER_UNBANNED">Reinstatements</option>
            <option value="DOCUMENT_DELETED">Document Purges</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 border-3 border-[#0D382B] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Fetching audit trail...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No audit events recorded</p>
            <p className="text-slate-400 mt-0.5">Administrative mutations will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAF6] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4">Network / IP</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {logs.map((log) => {
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        {/* Timestamp */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>

                        {/* Action Badge */}
                        <td className="py-3 px-4">{getActionBadge(log.action)}</td>

                        {/* Admin Identity */}
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{log.adminEmail}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {log.adminId}</p>
                        </td>

                        {/* Target Entity */}
                        <td className="py-3 px-4">
                          {log.targetEmail ? (
                            <div>
                              <p className="font-semibold text-slate-800">{log.targetEmail}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                ID: {log.targetId}
                              </p>
                            </div>
                          ) : log.targetId ? (
                            <p className="font-mono text-[11px] text-slate-600">{log.targetId}</p>
                          ) : (
                            <span className="text-slate-400 text-[11px]">System</span>
                          )}
                        </td>

                        {/* Network / IP */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          <p>{log.ipAddress || "unknown"}</p>
                          {log.userAgent && (
                            <p className="text-[10px] text-slate-400 truncate max-w-xs font-sans" title={log.userAgent}>
                              {log.userAgent.split(" ")[0]}
                            </p>
                          )}
                        </td>

                        {/* Expandable JSON details */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <Code2 className="w-3 h-3" />
                            <span>{isExpanded ? "Hide" : "Inspect"}</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded JSON Inspector row */}
                      {isExpanded && (
                        <tr className="bg-slate-900 text-slate-100 text-xs">
                          <td colSpan={6} className="p-4">
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                              <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5" />
                                Audit Log Payload Record: {log.id}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(log.createdAt).toISOString()}
                              </span>
                            </div>
                            <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded-lg">
                              {JSON.stringify(
                                {
                                  id: log.id,
                                  action: log.action,
                                  admin: { id: log.adminId, email: log.adminEmail },
                                  target: { id: log.targetId, email: log.targetEmail },
                                  details: log.details,
                                  ipAddress: log.ipAddress,
                                  userAgent: log.userAgent,
                                },
                                null,
                                2
                              )}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="py-3 px-4 border-t border-slate-100 bg-[#F8FAF6] flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
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
    </div>
  );
}

