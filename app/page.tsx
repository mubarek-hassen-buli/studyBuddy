"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import LandingPage from "@/components/landing-page";

export default function Page() {
  const { user, isLoading, checkSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && user) {
      console.log("[RootPage] Authenticated, pushing to dashboard...");
      router.push("/dashboard");
    } else if (!isLoading && !user) {
      console.log("[RootPage] Not authenticated, showing landing page.");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <LandingPage />
    </>
  );
}