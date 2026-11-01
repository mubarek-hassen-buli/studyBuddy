import { api } from "@/lib/api/client";
import {
  PaymentAccountDetails,
  UserSubscriptionStatus,
  SubscriptionRequestItem,
  PaymentMethod,
} from "@/types/admin";

export interface SubmitSubscriptionPayload {
  paymentMethod: PaymentMethod;
  transactionReference: string;
  senderPhoneNumber?: string;
  receiptUrl: string;
  amount?: number;
  currency?: string;
}

export const subscriptionApi = {
  // Get official CBE & Telebirr account information
  getPaymentInfo: async (): Promise<PaymentAccountDetails> => {
    return api.get("/subscriptions/payment-info");
  },

  // Get current user's subscription, buddy counts, and pending request status
  getMyStatus: async (): Promise<UserSubscriptionStatus> => {
    return api.get("/subscriptions/my-status");
  },

  // Upload receipt image to ImageKit
  uploadReceipt: async (file: File): Promise<{ success: boolean; receiptUrl: string; fileName: string }> => {
    const formData = new FormData();
    formData.append("receipt", file);
    return api.upload("/subscriptions/upload-receipt", formData);
  },

  // Submit payment proof for admin review
  submitProof: async (
    payload: SubmitSubscriptionPayload
  ): Promise<{ success: boolean; message: string; request: SubscriptionRequestItem }> => {
    return api.post("/subscriptions/submit", payload);
  },
};

