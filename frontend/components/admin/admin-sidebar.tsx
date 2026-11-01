"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  History,
  ArrowLeft,
  LogOut,
  BookOpen,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AdminUser } from "@/types/admin";

interface AdminSidebarProps {
  adminUser: AdminUser | null;
}

export function AdminSidebar({ adminUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  const navItems = [
    {
      name: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Metrics & System Health",
    },
    {
      name: "User Directory",
      href: "/admin/users",
      icon: Users,
      description: "Roles, Tiers & Suspensions",
    },
    {
      name: "Materials Catalog",
      href: "/admin/materials",
      icon: FileText,
      description: "Documents & Vectors",
    },
    {
      name: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCard,
      description: "Payment Verification",
    },
    {
      name: "Audit Trail",
      href: "/admin/audit-logs",
      icon: History,
      description: "Security Mutation Log",
    },
  ];

  const adminName = adminUser?.name || "Super Admin";
  const adminEmail = adminUser?.email || "admin@folio.app";
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 shrink-0 border-r border-[#E5EAE7] bg-[#F8FAF6] flex flex-col justify-between h-screen sticky top-0 transition-all font-sans select-none z-20">
      {/* Top Branding Section */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E5EAE7]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#0D382B] flex items-center justify-center text-white shadow-xs shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-extrabold text-[#0D382B] tracking-tight leading-none">
                  Folio
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-[#0D382B] border border-emerald-300">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium leading-tight">
                Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Back to Learner App Shortcut */}
        <div className="p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-900 bg-white border border-[#E5EAE7] hover:border-[#0D382B]/30 hover:bg-emerald-50/50 shadow-2xs transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0D382B] group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Folio App</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="px-3 space-y-1">
          <div className="px-3 pt-2 pb-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Management
            </span>
          </div>

          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? "bg-[#E8F2EC] text-[#0D382B] font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#0D382B]" : "text-slate-400"
                  }`}
                />
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="truncate leading-tight">{item.name}</span>
                  <span
                    className={`text-[10px] truncate leading-tight ${
                      isActive ? "text-emerald-800/80 font-normal" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-3 border-t border-[#E5EAE7] bg-[#F8FAF6]">
        {/* Super Admin Status Banner */}
        <div className="mb-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-900 to-[#0D382B] text-white shadow-xs">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[11px] font-bold text-white leading-tight">Super Admin</p>
              <p className="text-[9px] text-emerald-200/80 leading-tight">Full System Authority</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5EAE7] shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-[#0D382B] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {initial}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">{adminName}</p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">{adminEmail}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

