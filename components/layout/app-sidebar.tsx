"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Settings,
  BrainCircuit,
  FileText,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useAppStore } from "@/store/app-store";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AppSidebar() {
  const { user } = useAuthStore();
  const { setCreateModalOpen } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "My Buddies", icon: BrainCircuit, href: "/dashboard/buddies" },
    { name: "Documents", icon: FileText, href: "/dashboard/documents" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <Sidebar variant="sidebar" className="border-r border-slate-200 bg-white">
      <SidebarHeader className="h-14 lg:h-[60px] flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="text-primary" style={{ fontFamily: 'var(--font-grezia)' }}>MyBuddy</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem className="mb-4">
            <SidebarMenuButton 
              size="lg"
              className="w-full bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary transition-all border border-primary/10 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              <span>Create New Buddy</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarSeparator className="bg-slate-100 my-4" />
          
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={`w-full py-6 transition-colors rounded-xl ${
                  pathname === item.href 
                    ? "bg-primary/10 text-primary font-bold" 
                    : "text-slate-500 hover:text-primary hover:bg-slate-50"
                }`}
              >
                <a href={item.href}>
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            {user?.name?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <SidebarMenuButton 
          onClick={handleSignOut}
          className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
