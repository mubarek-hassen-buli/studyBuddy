"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Sparkles,
  Copy,
  CheckCircle2,
  Clock,
  UploadCloud,
  ShieldCheck,
  AlertCircle,
  FileText,
  X,
  CreditCard,
  Building2,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { subscriptionApi } from "@/lib/subscription-api";
import { PaymentMethod } from "@/types/admin";

export default function PricingPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("cbe");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Form states
  const [txRef, setTxRef] = React.useState("");
  const [senderPhone, setSenderPhone] = React.useState("");
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // Queries
  const { data: userStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ["user", "subscription-status"],
    queryFn: () => subscriptionApi.getMyStatus(),
  });

  const { data: paymentInfo } = useQuery({
    queryKey: ["subscription", "payment-info"],
    queryFn: () => subscriptionApi.getPaymentInfo(),
  });

  const isPro = userStatus?.tier === "pro";
  const pendingRequest = userStatus?.pendingRequest;
  const buddiesCreated = userStatus?.buddiesCreatedCount ?? 0;
  const buddiesRemaining = Math.max(0, 3 - buddiesCreated);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied: ${text}`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Handle receipt selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Receipt image must be under 10 MB");
      return;
    }

    setReceiptFile(file);
    const objectUrl = URL.createObjectURL(file);
    setReceiptPreview(objectUrl);
  };

  const removeReceipt = () => {
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
    }
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  // Submit Proof Mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!txRef.trim()) {
        throw new Error("Please enter your transaction reference number");
      }
      if (!receiptFile) {
        throw new Error("Please upload a screenshot of your payment receipt");
      }

      setIsUploading(true);
      // 1. Upload receipt to ImageKit
      const uploadRes = await subscriptionApi.uploadReceipt(receiptFile);
      const receiptUrl = uploadRes?.receiptUrl || (uploadRes as any)?.url;
      if (!receiptUrl) {
        throw new Error("Failed to upload receipt image. Please try again.");
      }

      // 2. Submit payment proof
      return subscriptionApi.submitProof({
        paymentMethod: selectedMethod,
        transactionReference: txRef.trim(),
        senderPhoneNumber: senderPhone.trim() || undefined,
        receiptUrl: receiptUrl,
        amount: paymentInfo?.price || 500,
        currency: paymentInfo?.currency || "ETB",
      });
    },
    onSuccess: () => {
      setIsUploading(false);
      toast.success("Payment proof submitted successfully! Our team will review it shortly.");
      setIsModalOpen(false);
      setTxRef("");
      setSenderPhone("");
      removeReceipt();
      queryClient.invalidateQueries({ queryKey: ["user", "subscription-status"] });
    },
    onError: (err: any) => {
      setIsUploading(false);
      toast.error(err?.data?.message || err?.message || "Failed to submit payment proof");
    },
  });

  const cbeAccount = paymentInfo?.cbe.accountNumber || "1000528855354";
  const cbeName = paymentInfo?.cbe.accountName || "Mubarek Hassen";
  const telebirrPhone = paymentInfo?.telebirr.phoneNumber || "0925036911";
  const telebirrName = paymentInfo?.telebirr.accountName || "Mubarek Hassen";

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10">
      {/* Pending Banner if user has a submitted request */}
      {pendingRequest && (
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-amber-950">
                  Payment Verification in Progress
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-amber-200/70 text-amber-900">
                  Under Review
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                We received your payment proof (Ref:{" "}
                <span className="font-mono font-bold text-amber-950">
                  {pendingRequest.transactionReference}
                </span>{" "}
                via {pendingRequest.paymentMethod.toUpperCase()}). Our team will review your receipt
                and upgrade your account to Master Scholar shortly.
              </p>
            </div>
          </div>
          <div className="shrink-0 text-xs font-semibold text-amber-800 bg-amber-100/60 px-3 py-1.5 rounded-lg border border-amber-200">
            Usually verified within 1-3 hrs
          </div>
        </div>
      )}

      {/* Active Pro Banner */}
      {isPro && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0D382B] to-[#164e3c] text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-lg font-bold text-white">
                  You are an Active Master Scholar
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-full bg-emerald-400 text-[#0D382B]">
                  Pro Tier
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {userStatus?.subscriptionExpiresAt
                  ? `Your subscription is active through ${new Date(
                      userStatus.subscriptionExpiresAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}.`
                  : "Enjoy unlimited StudyBuddy collections, priority AI reasoning, and high document capacity."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 shrink-0 cursor-pointer"
          >
            Extend (+30 Days)
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F3EC] text-[#0D382B] text-xs font-bold tracking-widest uppercase border border-[#CDE3D5]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Folio Membership</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#11231B] tracking-tight">
          Fair, transparent pricing for students
        </h1>
        <p className="text-sm sm:text-base text-[#4A6858] max-w-2xl mx-auto font-medium leading-relaxed">
          Start studying for free with up to 3 StudyBuddies, or elevate your academic journey with
          the Master Scholar plan via local Ethiopian payments (CBE & Telebirr).
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="rounded-3xl border border-[#D5E0D8] shadow-2xs bg-white relative overflow-hidden h-full flex flex-col justify-between p-8">
          <div>
            <CardHeader className="p-0 pb-6 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#11231B]">The Apprentice</h3>
                  <p className="text-xs text-[#527363] mt-0.5">Best for everyday term study</p>
                </div>
                <span className="text-3xl font-serif font-bold text-[#11231B]">0 ETB</span>
              </div>
              <div className="h-px w-full bg-[#EDF2EE] pt-2" />
            </CardHeader>

            <CardContent className="p-0 space-y-5">
              {/* Quota Progress Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Creation Quota</span>
                  <span className="font-bold text-[#0D382B]">
                    {buddiesCreated} of 3 free creations used
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      buddiesCreated >= 3 ? "bg-rose-500" : "bg-[#0D382B]"
                    }`}
                    style={{ width: `${Math.min(100, (buddiesCreated / 3) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {buddiesRemaining > 0
                    ? `${buddiesRemaining} free creation${buddiesRemaining === 1 ? "" : "s"} remaining.`
                    : "Creation quota full. Upgrade to Pro for unlimited StudyBuddies."}
                </p>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Included in Apprentice
              </p>
              <ul className="space-y-3">
                {[
                  "Access to core AI StudyBuddy features",
                  "Up to 3 StudyBuddy collections",
                  "Standard generative processing speed",
                  "Interactive flashcards & practice quizzes",
                  "Grounded answers citing your lecture notes",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#2C4A3C]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3EC] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-800 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>

          <div className="pt-8">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-2xl h-12 font-bold text-xs sm:text-sm bg-[#FAFBF7] hover:bg-[#EEF5F0] text-[#0D382B] border-[#D5E0D8]"
            >
              <Link href="/dashboard">
                {!isPro ? "Current Active Plan" : "Included in Base"}
              </Link>
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        <Card className="rounded-3xl border-2 border-[#0D382B] shadow-md bg-white text-[#11231B] h-full flex flex-col justify-between relative overflow-hidden p-8">
          <div className="absolute top-4 right-5 bg-[#0D382B] text-emerald-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            RECOMMENDED
          </div>

          <div>
            <CardHeader className="p-0 pb-6 space-y-2">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#11231B]">The Master Scholar</h3>
                <p className="text-xs text-[#527363] mt-0.5">For intense term loads & power learners</p>
              </div>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-4xl font-serif font-bold text-[#0D382B]">500 ETB</span>
                <span className="text-xs text-slate-500 font-medium">/ per month</span>
              </div>
              <div className="h-px w-full bg-[#EDF2EE] pt-2" />
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Master Scholar Perks
              </p>
              <ul className="space-y-3">
                {[
                  "Unlimited StudyBuddy subject collections",
                  "Priority Gemini reasoning & deep document grounding",
                  "Unlimited AI flashcard decks & custom quizzes",
                  "High-capacity PDF, DOCX, and slide processing",
                  "Local Ethiopian payment (CBE & Telebirr)",
                  "Continuous revision analytics & streak protection",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#2C4A3C]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3EC] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-800 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>

          <div className="pt-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-2xl h-12 font-bold text-xs sm:text-sm bg-[#0D382B] hover:bg-[#07251C] text-white shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span>
                {isPro
                  ? "Extend Subscription (500 ETB)"
                  : pendingRequest
                  ? "Submit Another Payment (500 ETB)"
                  : "Upgrade to Master Scholar (500 ETB)"}
              </span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Payment Proof Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 border border-[#D5E0D8]">
          <DialogHeader className="space-y-1.5 pb-2 text-left">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-[#0D382B]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <DialogTitle className="font-serif text-2xl font-bold text-[#11231B]">
                Upgrade to Master Scholar
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Pay 500 ETB via CBE or Telebirr, then upload your transfer receipt for verification.
            </DialogDescription>
          </DialogHeader>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedMethod("cbe")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedMethod === "cbe"
                  ? "border-[#0D382B] bg-[#E8F3EC]/50 ring-2 ring-[#0D382B]/20"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                  <Building2 className="w-4 h-4" />
                </span>
                {selectedMethod === "cbe" && (
                  <CheckCircle2 className="w-4 h-4 text-[#0D382B]" />
                )}
              </div>
              <p className="font-bold text-xs text-slate-900">CBE (Commercial Bank)</p>
              <p className="text-[11px] text-slate-500">Bank Transfer / CBE Birr</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod("telebirr")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedMethod === "telebirr"
                  ? "border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Smartphone className="w-4 h-4" />
                </span>
                {selectedMethod === "telebirr" && (
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                )}
              </div>
              <p className="font-bold text-xs text-slate-900">Telebirr</p>
              <p className="text-[11px] text-slate-500">Mobile Money Transfer</p>
            </button>
          </div>

          {/* Account Details Box */}
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E3EBE5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {selectedMethod === "cbe" ? "CBE Account Details" : "Telebirr Details"}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#0D382B]">
                500 ETB / Month
              </span>
            </div>

            {selectedMethod === "cbe" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Account Number</p>
                    <p className="font-mono font-bold text-sm sm:text-base text-slate-900">
                      {cbeAccount}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(cbeAccount, "cbe-acc")}
                    className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer"
                  >
                    {copiedKey === "cbe-acc" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === "cbe-acc" ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs px-1 text-slate-600">
                  <span>Account Holder:</span>
                  <span className="font-semibold text-slate-900">{cbeName}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Telebirr Number</p>
                    <p className="font-mono font-bold text-sm sm:text-base text-slate-900">
                      {telebirrPhone}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(telebirrPhone, "telebirr-phone")}
                    className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer"
                  >
                    {copiedKey === "telebirr-phone" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === "telebirr-phone" ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs px-1 text-slate-600">
                  <span>Receiver Name:</span>
                  <span className="font-semibold text-slate-900">{telebirrName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitMutation.mutate();
            }}
            className="space-y-4 pt-1"
          >
            {/* Transaction Reference Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Transaction Reference ID *</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {selectedMethod === "cbe" ? "e.g. FT2400000000" : "Telebirr TRX Code"}
                </span>
              </label>
              <input
                type="text"
                required
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder={selectedMethod === "cbe" ? "Enter CBE Reference (FT...)" : "Enter Telebirr TRX code"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0D382B] focus:border-[#0D382B]"
              />
            </div>

            {/* Sender Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Sender Phone Number</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="e.g. 0911000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0D382B] focus:border-[#0D382B]"
              />
            </div>

            {/* Receipt Screenshot Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Payment Receipt / Screenshot *
              </label>

              {receiptPreview ? (
                <div className="relative rounded-2xl border border-slate-200 p-2 bg-slate-50 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {receiptFile?.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {receiptFile ? (receiptFile.size / 1024).toFixed(1) + " KB" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer mr-1"
                    title="Remove receipt"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 hover:border-[#0D382B] rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50">
                  <UploadCloud className="w-7 h-7 text-slate-400 mb-1.5" />
                  <span className="text-xs font-bold text-slate-700">
                    Click to upload receipt screenshot
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG, or WEBP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading || submitMutation.isPending}
                className="w-1/3 rounded-xl h-11 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || submitMutation.isPending || !txRef.trim() || !receiptFile}
                className="w-2/3 rounded-xl h-11 text-xs font-bold bg-[#0D382B] hover:bg-[#07251C] text-white shadow-xs cursor-pointer"
              >
                {isUploading || submitMutation.isPending
                  ? "Submitting Verification..."
                  : "Submit Payment Proof"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
