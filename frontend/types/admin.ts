export type UserRole = "user" | "super_admin";
export type UserTier = "free" | "pro";
export type UserStatus = "all" | "active" | "banned";
export type DocumentProcessingStatus = "pending" | "processing" | "completed" | "failed";
export type FileType = "pdf" | "docx" | "ppt" | "txt";

export interface AdminUserStats {
  studyBuddiesCount: number;
  documentsCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  banned: boolean;
  banReason?: string | null;
  banExpires?: string | null;
  image?: string | null;
  buddiesCreatedCount?: number;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  stats?: AdminUserStats;
}

export interface AdminUserDetailStats {
  studyBuddiesCount: number;
  documentsCount: number;
  storageBytes: number;
  storageMegabytes: number;
  flashcardsCount: number;
  quizzesCount: number;
  quizAttemptsCount: number;
  averageQuizPercentage: number;
  studySessionsCount: number;
  totalStudyMinutes: number;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetId?: string | null;
  targetEmail?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AdminUserDetail {
  user: AdminUser;
  stats: AdminUserDetailStats;
  auditHistory: AdminAuditLog[];
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminAnalytics {
  users: {
    total: number;
    superAdmins: number;
    standardUsers: number;
    proTier: number;
    freeTier: number;
    banned: number;
    newLast7Days: number;
    newLast30Days: number;
  };
  content: {
    studyBuddies: number;
    documents: number;
    storageBytes: number;
    storageMegabytes: number;
    documentStatus: {
      completed: number;
      processing: number;
      failed: number;
      pending: number;
    };
    flashcards: number;
    quizzes: number;
    quizAttempts: number;
    studySessions: number;
    studyMinutes: number;
  };
  subscriptions?: {
    pending: number;
    approved: number;
  };
  timestamp: string;
}

export interface AdminDocument {
  id: string;
  fileName: string;
  fileType: FileType;
  fileUrl: string;
  fileSize: number;
  processingStatus: DocumentProcessingStatus;
  chunkCount: number;
  createdAt: string;
  studyBuddyId: string;
  studyBuddyName: string;
  studyBuddySubject?: string | null;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
}

export type PaymentMethod = "cbe" | "telebirr";
export type SubscriptionStatus = "pending" | "approved" | "rejected";

export interface SubscriptionRequestItem {
  id: string;
  userId: string;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  senderPhoneNumber?: string | null;
  receiptUrl: string;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userTier: UserTier;
  userRole: UserRole;
  userImage?: string | null;
  subscriptionExpiresAt?: string | null;
}

export interface PaymentAccountDetails {
  plan: string;
  price: number;
  currency: string;
  interval: string;
  cbe: {
    accountNumber: string;
    accountName: string;
    bank: string;
  };
  telebirr: {
    phoneNumber: string;
    accountName: string;
  };
}

export interface UserSubscriptionStatus {
  tier: UserTier;
  role: UserRole;
  subscriptionExpiresAt?: string | null;
  buddiesCreatedCount: number;
  buddiesRemaining: number;
  isExpired: boolean;
  pendingRequest?: {
    id: string;
    paymentMethod: PaymentMethod;
    transactionReference: string;
    receiptUrl: string;
    amount: number;
    currency: string;
    status: SubscriptionStatus;
    createdAt: string;
  } | null;
}

