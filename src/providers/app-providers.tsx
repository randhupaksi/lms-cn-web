"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { Tooltip } from "@base-ui/react/tooltip";
import { SchoolProvider } from "@/providers/school-provider";

type AppProvidersProps = Readonly<{ children: ReactNode }>;

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, gcTime: 15 * 60_000, retry: 1 },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delay={300}>
        <SchoolProvider>
          <AuthProvider>{children}</AuthProvider>
        </SchoolProvider>
      </Tooltip.Provider>
    </QueryClientProvider>
  );
}
