"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, MessageSquare, Sparkles } from "lucide-react";
import { CreateBuddyDialog } from "@/components/dashboard/create-buddy-dialog";
import { MiniTimerPill } from "@/components/dashboard/mini-timer-pill";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, checkSession } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("[DashboardLayout] Redirection Check: No user found and not loading. Redirecting to sign-in.");
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7FAF8]">
        <div className="h-10 w-10 border-4 border-[#105445] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-[#F6F8F7]">
        {/* Donezo-style Top App Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto w-full flex h-16 items-center gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8">
            <SidebarTrigger className="text-slate-600 hover:text-[#105445] transition-colors" />

            {/* Donezo Search Bar with ⌘F Shortcut */}
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search task, buddies, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-12 rounded-full border border-slate-200 bg-slate-50/80 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#105445]/20 focus:border-[#105445] transition-all"
                />
                <kbd className="absolute right-3 inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs">
                  ⌘F
                </kbd>
              </div>
            </div>

            <div className="flex-1 sm:hidden" />

            {/* Header Right Profile */}
            <div className="flex items-center gap-3">
              <MiniTimerPill />

              {/* User Profile Capsule */}
              <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/80">
                <div className="h-9 w-9 rounded-full bg-[#105445] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.name || "Scholar"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>
      <CreateBuddyDialog />
    </SidebarProvider>
  );
}
