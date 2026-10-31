"use client";

import { QueryProvider } from "./query-provider";
import { AccentProvider } from "./accent-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AccentProvider>{children}</AccentProvider>
    </QueryProvider>
  );
}
