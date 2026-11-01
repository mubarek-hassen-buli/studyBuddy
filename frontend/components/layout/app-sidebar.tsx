"use client";

import * as React from "react";
import {
  LayoutGrid,
  FileText,
  Layers,
  Brain,
  MessageSquare,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Sparkles,
  CreditCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { ScheduleSessionDialog } from "@/components/dashboard/schedule-session-dialog";

export function AppSidebar() {
  const { user } = useAuthStore();
  const { isSuperAdmin } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  const mainNavItems = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "My Materials", icon: FileText, href: "/dashboard/documents" },
    { name: "Flashcards", icon: Layers, href: "/dashboard/flashcards" },
    { name: "Quizzes", icon: Brain, href: "/dashboard/quizzes" },
    { name: "AI Chat", icon: MessageSquare, href: "/dashboard/chat" },
  ];

  const userName = user?.name || "Mubarek Hassen";
  const userEmail = user?.email || "mubid@gmail.com";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-[#E5EAE7] bg-[#F8FAF6] transition-all duration-300 font-sans"
      >
        {/* Brand Header: Folio Logo */}
        <SidebarHeader className="h-16 flex items-center justify-between px-5 pt-4 pb-2 group-data-[collapsible=icon]:px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
          >
            <div className="h-9 w-9 rounded-xl bg-[#0D382B] flex items-center justify-center text-white shadow-sm shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-100" />
            </div>
            <div className="flex items-center group-data-[collapsible=icon]:hidden">
              <span className="font-serif text-2xl font-extrabold text-[#0D382B] tracking-tight leading-none">
                Folio
              </span>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-3.5 py-3 space-y-4">
          {/* Quick Action Button: + New Study Session */}
          <div className="pt-1">
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="w-full bg-[#0D382B] hover:bg-[#07251C] text-white transition-all duration-200 shadow-sm rounded-2xl py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center active:scale-98 cursor-pointer"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">New Study Session</span>
            </button>
          </div>

          {/* Section: MAIN */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1 group-data-[collapsible=icon]:hidden">
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {mainNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        isActive={isActive}
                        className={`w-full py-2 px-3 transition-all rounded-xl text-xs cursor-pointer ${
                          isActive
                            ? "bg-[#E8F2EC] text-[#0D382B] font-bold hover:bg-[#E8F2EC] hover:text-[#0D382B]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium"
                        }`}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
                        >
                          <item.icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? "text-[#0D382B]" : "text-slate-500"
                            }`}
                          />
                          <span className="truncate group-data-[collapsible=icon]:hidden">
                            {item.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Upgrade Callout Card (Visible for non-Pro users) */}
          {user?.tier !== "pro" ? (
            <div className="pt-1 group-data-[collapsible=icon]:hidden">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D382B] to-[#174e3d] p-3.5 text-white shadow-sm border border-emerald-950/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-lg bg-emerald-400/20 text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  </div>
                  <h5 className="text-xs font-bold text-white">The Master Scholar</h5>
                </div>
                <p className="text-[10px] text-emerald-100/80 leading-snug mb-3">
                  Unlimited StudyBuddies, priority AI, and CBE / Telebirr payments.
                </p>
                <Link
                  href="/dashboard/pricing"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white text-[#0D382B] hover:bg-emerald-50 text-xs font-bold shadow-2xs transition-all active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Upgrade (500 ETB)</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="pt-1 group-data-[collapsible=icon]:hidden">
              <Link
                href="/dashboard/pricing"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-100/70 border border-emerald-200 text-[#0D382B] hover:bg-emerald-100 transition-colors"
              >
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Master Scholar Active
                </span>
                <span className="text-[10px] text-emerald-800 underline font-semibold">
                  Manage
                </span>
              </Link>
            </div>
          )}

          {/* Streak Card: Keep going! (Folio Statue Character) */}
          <div className="pt-1 group-data-[collapsible=icon]:hidden">
            <div className="relative overflow-hidden rounded-2xl bg-[#0C382C] p-3 text-white shadow-sm border border-emerald-950/20">
              <div className="flex items-center gap-2.5">
                {/* Character Avatar */}
                <div className="h-9 w-9 rounded-full overflow-hidden bg-white/10 shrink-0 border border-emerald-400/30">
                  <Image
                    src="/images/folio.png"
                    alt="Folio character"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover object-[center_12%]"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h5 className="text-xs font-bold text-white leading-tight">Keep going!</h5>
                  <p className="text-[10px] text-emerald-200/80 truncate">
                    Small steps, big progress.
                  </p>
                </div>
              </div>

              {/* Green Progress Bar */}
              <div className="w-full h-1 bg-white/15 rounded-full my-2.5 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-3/5" />
              </div>

              {/* Bottom Streak Row */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[11px] font-bold text-emerald-100 flex items-center gap-1">
                  <span>3 day streak</span>
                  <span>🔥</span>
                </span>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="h-5 w-5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </SidebarContent>

        {/* User Profile Footer */}
        <SidebarFooter className="p-3 border-t border-[#E5EAE7] bg-[#F8FAF6]">
          {/* Super Admin Portal Entry (visible for Super Admins) */}
          {isSuperAdmin && (
            <div className="mb-2">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-900 bg-emerald-100/90 hover:bg-emerald-100 text-xs font-bold transition-all border border-emerald-300 shadow-2xs group-data-[collapsible=icon]:justify-center"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Super Admin Portal</span>
              </Link>
            </div>
          )}

          {/* User Profile Row */}
          <Link
            href="/dashboard/settings"
            className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-100/60 transition-colors group-data-[collapsible=icon]:justify-center cursor-pointer"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user?.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.image}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover border border-[#0D382B]/20 shadow-2xs shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-[#0D382B] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                  {userInitial}
                </div>
              )}
              <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{userName}</p>
                <p className="text-[10px] text-slate-400 truncate leading-tight">{userEmail}</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-data-[collapsible=icon]:hidden" />
          </Link>

          {/* Pricing, Settings & Sign Out */}
          <div className="space-y-0.5 pt-1">
            <Link
              href="/dashboard/pricing"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 text-xs font-medium transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Membership & Pricing</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 text-xs font-medium transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors group-data-[collapsible=icon]:justify-center cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <ScheduleSessionDialog
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
      />
    </>
  );
}
