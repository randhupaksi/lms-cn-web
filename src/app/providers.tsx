import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type AppProvidersProps = { children: ReactNode };

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, gcTime: 15 * 60_000, retry: 1 }, mutations: { retry: 0 } } }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
