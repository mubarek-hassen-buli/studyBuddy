"use client";

import * as React from "react";
import Link from "next/link";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ShieldAlert, ArrowLeft, LogIn, CheckCircle2 } from "lucide-react";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { adminUser, isSuperAdmin, isLoading, isError } = useAdminAuth();

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAF6] font-sans">
        <div className="h-10 w-10 border-3 border-[#0D382B] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-600">
          Verifying Super Administrator Authorization...
        </p>
      </div>
    );
  }

  // 2. Unauthorized / Access Denied Barrier
  if (isError || !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAF6] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-5">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            This portal is strictly restricted to verified <strong>Super Administrators</strong>.
            Standard user accounts cannot view or modify administrative records.
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Folio App</span>
            </Link>

            <Link
              href="/sign-in"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Another Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Super Admin Layout
  return (
    <div className="flex min-h-screen bg-[#F4F6F0] font-sans antialiased text-slate-900">
      <AdminSidebar adminUser={adminUser} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Admin Header Bar */}
        <header className="h-16 shrink-0 border-b border-[#E5EAE7] bg-[#F8FAF6]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Production DB</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role: <strong className="text-emerald-950 font-bold">super_admin</strong></span>
            </div>

            <div className="h-8 w-8 rounded-full bg-[#0D382B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {adminUser?.name?.charAt(0).toUpperCase() || "M"}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}

