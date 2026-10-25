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
      <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-[#F8FAF6]">
        {/* Folio Top App Header */}
        <header className="sticky top-0 z-30 border-b border-[#E5EAE7] bg-[#F8FAF6]/95 backdrop-blur-md">
          <div className="w-full flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
              <SidebarTrigger className="text-slate-600 hover:text-[#0D382B] transition-colors" />

              {/* Folio Search Bar with ⌘K Shortcut */}
              <div className="relative flex items-center w-full">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search your materials, notes, or ask Folio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-14 rounded-full border border-[#E5EAE7] bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D382B]/20 focus:border-[#0D382B] transition-all shadow-2xs"
                />
                <kbd className="absolute right-3 inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                  ⌘ K
                </kbd>
              </div>
            </div>

            {/* Header Right: MiniTimer + Notification Bell + User Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              <MiniTimerPill />

              {/* Notification Bell with Red Dot */}
              <button
                type="button"
                className="relative h-9 w-9 rounded-full hover:bg-slate-200/50 flex items-center justify-center text-slate-600 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
              </button>

              {/* User Profile Capsule */}
              <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E5EAE7]">
                <div className="h-8 w-8 rounded-full bg-[#0D382B] text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "M"}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.name || "Mubarek Hassen"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Student
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
