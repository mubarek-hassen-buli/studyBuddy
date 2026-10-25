"use client";

import * as React from "react";
import {
  LayoutGrid,
  FileText,
  Layers,
  Brain,
  MessageSquare,
  Calendar,
  Folder,
  FolderArchive,
  Archive,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  ArrowRight,
  BookOpen,
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
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { ScheduleSessionDialog } from "@/components/dashboard/schedule-session-dialog";

export function AppSidebar() {
  const { user } = useAuthStore();
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
    { name: "Quizzes", icon: Brain, href: "/dashboard/buddies" },
    { name: "AI Chat", icon: MessageSquare, href: "/dashboard/buddies" },
    { name: "Study Plans", icon: Calendar, href: "/dashboard" },
  ];

  const libraryNavItems = [
    { name: "All Documents", icon: Folder, href: "/dashboard/documents" },
    { name: "Collections", icon: FolderArchive, href: "/dashboard/documents" },
    { name: "Archived", icon: Archive, href: "/dashboard/documents" },
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
              className="w-full bg-[#0D382B] hover:bg-[#07251C] text-white transition-all duration-200 shadow-sm rounded-2xl py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center active:scale-98"
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
                        className={`w-full py-2 px-3 transition-all rounded-xl text-xs ${
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

          {/* Section: LIBRARY */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1 group-data-[collapsible=icon]:hidden">
              Library
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {libraryNavItems.map((item) => {
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        className="w-full py-2 px-3 transition-all rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
                        >
                          <item.icon className="h-4 w-4 shrink-0 text-slate-500" />
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

          {/* Streak Card: Keep going! (Folio Statue Character) */}
          <div className="pt-2 group-data-[collapsible=icon]:hidden">
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
                  className="h-5 w-5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </SidebarContent>

        {/* User Profile Footer */}
        <SidebarFooter className="p-3 border-t border-[#E5EAE7] bg-[#F8FAF6]">
          {/* User Profile Row */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-100/60 transition-colors group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-[#0D382B] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-data-[collapsible=icon]:hidden" />
          </div>

          {/* Settings & Sign Out */}
          <div className="space-y-0.5 pt-1">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 text-xs font-medium transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors group-data-[collapsible=icon]:justify-center"
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
