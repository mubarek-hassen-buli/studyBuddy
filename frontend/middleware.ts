import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authClient } from "./lib/auth-client";

export async function middleware(request: NextRequest) {
  // NOTE: In a cross-domain setup (Vercel + Railway), the Vercel Middleware 
  // cannot access cookies set by Railway. We rely on client-side 
  // protection in DashboardLayout.tsx instead.
  
  /*
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      credentials: "include",
      headers: {
        cookie: request.headers.get("cookie") || "",
        "User-Agent": request.headers.get("User-Agent") || "",
      },
    },
  });

  if (!session) {
    console.log("[Middleware] Redirecting to sign-in: No session found for", request.nextUrl.pathname);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/buddy/:path*"],
};
