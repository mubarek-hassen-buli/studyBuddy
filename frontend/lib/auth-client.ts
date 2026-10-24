import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Ensure this points to backend URL
});

export const { signIn, signUp, signOut, useSession } = authClient;
