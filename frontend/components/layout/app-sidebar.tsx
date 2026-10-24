"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  BrainCircuit,
  FileText,
  Settings,
  CreditCard,
  LogOut,
  Plus,
  Sparkles,
  Compass,
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
import { useAppStore } from "@/store/app-store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function AppSidebar() {
  const { user } = useAuthStore();
  const { setCreateModalOpen } = useAppStore();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  const primaryNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "My Buddies", icon: BrainCircuit, href: "/dashboard/buddies" },
    { name: "Documents", icon: FileText, href: "/dashboard/documents" },
  ];

  const generalNavItems = [
    { name: "Pricing & Plans", icon: CreditCard, href: "/dashboard/pricing" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/80 bg-[#FAFCFB] transition-all duration-300"
    >
      {/* Brand Header */}
      <SidebarHeader className="h-16 flex items-center justify-between px-4 border-b border-slate-100/80 group-data-[collapsible=icon]:px-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-slate-900 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
        >
          <div className="h-9 w-9 rounded-xl bg-[#105445] flex items-center justify-center text-white shadow-sm shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-extrabold text-slate-900 tracking-tight leading-none text-base">
              Donezo <span className="text-[#105445] font-black">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              StudyBuddy Pro
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-4">
        {/* Quick Action Button */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Create New Buddy"
              className="w-full bg-[#105445] hover:bg-[#0c4236] text-white hover:text-white transition-all duration-200 shadow-sm rounded-xl font-semibold flex items-center justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-5 w-5 shrink-0 group-data-[collapsible=icon]:mr-0 mr-2" />
              <span className="group-data-[collapsible=icon]:hidden">Create New Buddy</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Section: MENU */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1 group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.name}
                      isActive={isActive}
                      className={`w-full py-2.5 px-3 transition-all rounded-xl ${
                        isActive
                          ? "bg-[#105445]/10 text-[#105445] font-bold hover:bg-[#105445]/15 hover:text-[#105445]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 group-data-[collapsible=icon]:mr-0 mr-3 ${
                            isActive ? "text-[#105445]" : "text-slate-500"
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

        {/* Section: GENERAL */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1 group-data-[collapsible=icon]:hidden">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.name}
                      isActive={isActive}
                      className={`w-full py-2.5 px-3 transition-all rounded-xl ${
                        isActive
                          ? "bg-[#105445]/10 text-[#105445] font-bold hover:bg-[#105445]/15 hover:text-[#105445]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 group-data-[collapsible=icon]:mr-0 mr-3 ${
                            isActive ? "text-[#105445]" : "text-slate-500"
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

        {/* Promo Card: Donezo Inspiration Style */}
        <div className="pt-2 group-data-[collapsible=icon]:hidden">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D3B31] via-[#105445] to-[#176B58] p-4 text-white shadow-md">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-lg bg-white/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="text-xs font-bold tracking-wide uppercase text-emerald-200">
                Unlock Pro
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Unlimited AI Knowledge
            </h4>
            <p className="text-[11px] text-emerald-100/80 mb-3 leading-relaxed">
              Connect more study materials & generate infinite quizzes.
            </p>
            <Link
              href="/dashboard/pricing"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-[#105445] hover:bg-white transition-colors shadow-sm"
            >
              Explore Plans
            </Link>
          </div>
        </div>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-1 py-1 mb-2 group-data-[collapsible=icon]:justify-center">
          <div className="h-9 w-9 rounded-full bg-[#105445]/10 border border-[#105445]/20 flex items-center justify-center text-xs font-bold text-[#105445] shrink-0">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.name || "Scholar"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Sign Out"
              className="w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all rounded-xl group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:mr-0 mr-2.5" />
              <span className="font-medium text-xs group-data-[collapsible=icon]:hidden">
                Sign Out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
