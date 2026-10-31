"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, ListUsersParams } from "@/lib/admin-api";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  MoreVertical,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserDetailsModal } from "@/components/admin/modals/user-details-modal";
import { ChangeRoleModal } from "@/components/admin/modals/change-role-modal";
import { ChangeTierModal } from "@/components/admin/modals/change-tier-modal";
import { BanUserModal } from "@/components/admin/modals/ban-user-modal";
import { toast } from "sonner";
import { AdminUser, UserRole, UserTier, UserStatus } from "@/types/admin";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  // Filter & Pagination State
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"all" | UserRole>("all");
  const [tierFilter, setTierFilter] = React.useState<"all" | UserTier>("all");
  const [statusFilter, setStatusFilter] = React.useState<UserStatus>("all");

  // Modals state
  const [activeUser, setActiveUser] = React.useState<AdminUser | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [roleModalOpen, setRoleModalOpen] = React.useState(false);
  const [tierModalOpen, setTierModalOpen] = React.useState(false);
  const [banModalOpen, setBanModalOpen] = React.useState(false);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Query users list
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "admin",
      "users",
      { page, q: debouncedSearch, role: roleFilter, tier: tierFilter, status: statusFilter },
    ],
    queryFn: () =>
      adminApi.getUsers({
        page,
        limit: 15,
        q: debouncedSearch || undefined,
        role: roleFilter,
        tier: tierFilter,
        status: statusFilter,
      }),
  });

  // Reinstatement mutation
  const unbanMutation = useMutation({
    mutationFn: (userId: string) => adminApi.unbanUser(userId),
    onSuccess: (res) => {
      toast.success(res?.message || "User reinstated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || "Failed to reinstate user");
    },
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5EAE7] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              User Directory
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              {pagination?.total || 0} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage user accounts, assign the <strong>super_admin</strong> role, adjust subscriptions, or suspend users.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAE7] shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D382B]/20 focus:border-[#0D382B] transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as any);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D382B]"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value as any);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D382B]"
          >
            <option value="all">All Tiers</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D382B]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 border-3 border-[#0D382B] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Fetching users directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No users found</p>
            <p className="text-slate-400 mt-0.5">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAF6] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Tier</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Workload</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => {
                  const isSuperAdmin = u.role === "super_admin";
                  const isBanned = u.banned;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Identity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-[#0D382B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 truncate">{u.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isSuperAdmin
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {isSuperAdmin ? "Super Admin" : "User"}
                        </span>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            u.tier === "pro"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {u.tier}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Workload */}
                      <td className="py-3 px-4 text-slate-500">
                        <span>{u.stats?.studyBuddiesCount || 0} Buddies</span>
                        <span className="mx-1.5">•</span>
                        <span>{u.stats?.documentsCount || 0} Docs</span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl shadow-md border border-slate-200 p-1 font-sans text-xs">
                            <DropdownMenuItem
                              onClick={() => {
                                setActiveUser(u);
                                setDetailsModalOpen(true);
                              }}
                              className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Profile & Stats</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setActiveUser(u);
                                setRoleModalOpen(true);
                              }}
                              className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#0D382B]" />
                              <span>Change Role</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setActiveUser(u);
                                setTierModalOpen(true);
                              }}
                              className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              <span>Change Tier</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 bg-slate-100" />

                            {isBanned ? (
                              <DropdownMenuItem
                                onClick={() => unbanMutation.mutate(u.id)}
                                className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-1.5 text-emerald-700 hover:bg-emerald-50"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Reinstate Account</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => {
                                  setActiveUser(u);
                                  setBanModalOpen(true);
                                }}
                                disabled={isSuperAdmin}
                                className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-1.5 text-rose-600 hover:bg-rose-50"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Suspend Account</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
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
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
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

      {/* Modals */}
      <UserDetailsModal
        userId={activeUser?.id ?? null}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      <ChangeRoleModal
        userId={activeUser?.id ?? null}
        currentRole={activeUser?.role ?? null}
        userName={activeUser?.name ?? null}
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
      />

      <ChangeTierModal
        userId={activeUser?.id ?? null}
        currentTier={activeUser?.tier ?? null}
        userName={activeUser?.name ?? null}
        open={tierModalOpen}
        onOpenChange={setTierModalOpen}
      />

      <BanUserModal
        userId={activeUser?.id ?? null}
        userName={activeUser?.name ?? null}
        userEmail={activeUser?.email ?? null}
        open={banModalOpen}
        onOpenChange={setBanModalOpen}
      />
    </div>
  );
}

