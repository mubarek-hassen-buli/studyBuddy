import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authClient } from "./lib/auth-client";

export async function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/buddy/:path*"],
};
