"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/providers/auth-provider";
import { LoadingState } from "@/components/data-state";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
    else if (
      !isLoading &&
      user?.must_change_password &&
      pathname !== "/change-password"
    )
      router.replace("/change-password");
  }, [isLoading, user, router, pathname]);
  if (isLoading)
    return <main className="mx-auto flex min-h-dvh w-full max-w-xl items-center px-5"><LoadingState label="Menyiapkan sesi…" /></main>;
  if (!user) return null;
  return <AppShell>{children}</AppShell>;
}
