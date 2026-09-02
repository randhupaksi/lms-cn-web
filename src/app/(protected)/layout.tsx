"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/providers/auth-provider";

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
    return (
      <main className="grid min-h-dvh place-items-center text-sm text-muted">
        Menyiapkan sesi…
      </main>
    );
  if (!user) return null;
  return <AppShell>{children}</AppShell>;
}
