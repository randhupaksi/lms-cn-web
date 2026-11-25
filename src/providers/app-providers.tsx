"use client";

import type { ReactNode } from "react";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { Tooltip } from "@base-ui/react/tooltip";
import { SchoolProvider } from "@/providers/school-provider";
import { ToastProvider } from "@/providers/toast-provider";

type AppProvidersProps = Readonly<{ children: ReactNode }>;

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 15 * 60_000,
            retry: (failureCount, error) => {
              // The API client already refreshes once for 401 responses.
              // Retrying the query repeats the unauthorized request and refresh.
              if (axios.isAxiosError(error) && error.response?.status === 401) {
                return false;
              }
              return failureCount < 1;
            },
          },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delay={300}>
        <ToastProvider>
          <SchoolProvider>
            <AuthProvider>{children}</AuthProvider>
          </SchoolProvider>
        </ToastProvider>
      </Tooltip.Provider>
    </QueryClientProvider>
  );
}
