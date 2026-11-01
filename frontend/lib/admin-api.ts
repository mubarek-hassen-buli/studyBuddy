import { api } from "@/lib/api/client";
import {
  AdminUser,
  AdminUserDetail,
  AdminAnalytics,
  AdminDocument,
  AdminAuditLog,
  AdminPagination,
  UserRole,
  UserTier,
  UserStatus,
  DocumentProcessingStatus,
  FileType,
  SubscriptionRequestItem,
  SubscriptionStatus,
  PaymentMethod,
} from "@/types/admin";

export interface ListUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  role?: "all" | UserRole;
  tier?: "all" | UserTier;
  status?: UserStatus;
}

export interface ListMaterialsParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: "all" | DocumentProcessingStatus;
  fileType?: "all" | FileType;
}

export interface ListAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  adminId?: string;
  targetId?: string;
}

export interface ListSubscriptionsParams {
  page?: number;
  limit?: number;
  status?: "all" | SubscriptionStatus;
  paymentMethod?: "all" | PaymentMethod;
}

export const adminApi = {
  // Current admin verification
  getMe: async (): Promise<{ user: AdminUser }> => {
    return api.get("/admin/me");
  },

  // System Analytics Overview
  getAnalytics: async (): Promise<AdminAnalytics> => {
    return api.get("/admin/analytics/overview");
  },

  // User Management
  getUsers: async (
    params: ListUsersParams = {}
  ): Promise<{ users: AdminUser[]; pagination: AdminPagination }> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.q) searchParams.set("q", params.q);
    if (params.role && params.role !== "all") searchParams.set("role", params.role);
    if (params.tier && params.tier !== "all") searchParams.set("tier", params.tier);
    if (params.status && params.status !== "all") searchParams.set("status", params.status);

    const queryStr = searchParams.toString();
    return api.get(`/admin/users${queryStr ? `?${queryStr}` : ""}`);
  },

  getUser: async (id: string): Promise<AdminUserDetail> => {
    return api.get(`/admin/users/${id}`);
  },

  updateUserRole: async (
    id: string,
    role: UserRole
  ): Promise<{ success: boolean; message: string; user: AdminUser }> => {
    return api.patch(`/admin/users/${id}/role`, { role });
  },

  updateUserTier: async (
    id: string,
    tier: UserTier
  ): Promise<{ success: boolean; message: string; user: AdminUser }> => {
    return api.patch(`/admin/users/${id}/tier`, { tier });
  },

  banUser: async (
    id: string,
    data: { reason: string; expiresAt?: string | null }
  ): Promise<{ success: boolean; message: string }> => {
    return api.post(`/admin/users/${id}/ban`, data);
  },

  unbanUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.post(`/admin/users/${id}/unban`, {});
  },

  // Materials & Documents Management
  getMaterials: async (
    params: ListMaterialsParams = {}
  ): Promise<{ documents: AdminDocument[]; pagination: AdminPagination }> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.q) searchParams.set("q", params.q);
    if (params.status && params.status !== "all") searchParams.set("status", params.status);
    if (params.fileType && params.fileType !== "all") searchParams.set("fileType", params.fileType);

    const queryStr = searchParams.toString();
    return api.get(`/admin/materials${queryStr ? `?${queryStr}` : ""}`);
  },

  deleteMaterial: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/admin/materials/${id}`);
  },

  // Audit Logs
  getAuditLogs: async (
    params: ListAuditLogsParams = {}
  ): Promise<{ logs: AdminAuditLog[]; pagination: AdminPagination }> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.action) searchParams.set("action", params.action);
    if (params.adminId) searchParams.set("adminId", params.adminId);
    if (params.targetId) searchParams.set("targetId", params.targetId);

    const queryStr = searchParams.toString();
    return api.get(`/admin/audit-logs${queryStr ? `?${queryStr}` : ""}`);
  },

  // Subscription Requests Management
  getSubscriptions: async (
    params: ListSubscriptionsParams = {}
  ): Promise<{ requests: SubscriptionRequestItem[]; pagination: AdminPagination }> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.status && params.status !== "all") searchParams.set("status", params.status);
    if (params.paymentMethod && params.paymentMethod !== "all") {
      searchParams.set("paymentMethod", params.paymentMethod);
    }

    const queryStr = searchParams.toString();
    return api.get(`/admin/subscriptions${queryStr ? `?${queryStr}` : ""}`);
  },

  approveSubscription: async (
    id: string,
    data: { adminNotes?: string } = {}
  ): Promise<{ success: boolean; message: string; request: SubscriptionRequestItem }> => {
    return api.post(`/admin/subscriptions/${id}/approve`, data);
  },

  rejectSubscription: async (
    id: string,
    data: { adminNotes?: string } = {}
  ): Promise<{ success: boolean; message: string; request: SubscriptionRequestItem }> => {
    return api.post(`/admin/subscriptions/${id}/reject`, data);
  },
};

