"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { BrainCircuit } from "lucide-react";
import { CreateBuddyDialog } from "@/components/dashboard/create-buddy-dialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, checkSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-slate-50/50">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto w-full flex h-14 lg:h-[60px] items-center gap-4 px-4 lg:px-8">
            <SidebarTrigger className="text-slate-500 hover:text-primary transition-colors" />
            <div className="flex-1">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-primary font-bold text-xs bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                  <BrainCircuit className="w-4 h-4" />
                  <span>AI READY</span>
               </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
            {children}
          </div>
        </div>
      </SidebarInset>
      <CreateBuddyDialog />
    </SidebarProvider>
  );
}
