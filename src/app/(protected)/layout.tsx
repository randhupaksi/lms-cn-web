"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AppShellSkeleton } from "@/components/app-shell-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { ProtectedRouteSkeleton } from "./route-skeleton";
import {
  ChangePasswordDialog,
} from "@/features/auth/components/change-password-dialog";
import {
  useSidebarCollapsedPreference,
  writeSidebarCollapsedPreference,
} from "@/lib/sidebar-preference";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarCollapsed = useSidebarCollapsedPreference();
  const [navigationPath, setNavigationPath] = useState<string | null>(null);
  const [changePasswordRequested, setChangePasswordRequested] =
    useState(false);
  const navigationTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
    else if (
      !isLoading &&
      user?.must_change_password &&
      pathname !== "/dashboard"
    )
      router.replace("/dashboard");
  }, [isLoading, user, router, pathname]);

  useEffect(() => {
    function startNavigation(nextPath: string) {
      if (nextPath === pathname) return;
      setNavigationPath(nextPath);
      if (navigationTimer.current !== null)
        window.clearTimeout(navigationTimer.current);
      navigationTimer.current = window.setTimeout(() => {
        setNavigationPath(null);
        navigationTimer.current = null;
      }, 12000);
    }

    function handleInternalLink(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        (link.target && link.target !== "_self") ||
        link.hasAttribute("download")
      )
        return;

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin === window.location.origin &&
        destination.pathname !== pathname
      )
        startNavigation(destination.pathname);
    }

    function handleHistoryNavigation() {
      if (window.location.pathname !== pathname)
        startNavigation(window.location.pathname);
    }

    document.addEventListener("click", handleInternalLink, true);
    window.addEventListener("popstate", handleHistoryNavigation);
    return () => {
      document.removeEventListener("click", handleInternalLink, true);
      window.removeEventListener("popstate", handleHistoryNavigation);
      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
        navigationTimer.current = null;
      }
    };
  }, [pathname]);

  if (isLoading)
    return (
      <AppShellSkeleton sidebarCollapsed={sidebarCollapsed}>
        <ProtectedRouteSkeleton pathname={pathname} />
      </AppShellSkeleton>
    );
  if (!user) return null;
  if (navigationPath && navigationPath !== pathname)
    return (
      <AppShellSkeleton sidebarCollapsed={sidebarCollapsed}>
        <ProtectedRouteSkeleton pathname={navigationPath} />
      </AppShellSkeleton>
    );
  const passwordChangeRequired = user.must_change_password;
  return (
    <>
      <AppShell
        sidebarCollapsed={sidebarCollapsed}
        onSidebarCollapsedChange={writeSidebarCollapsedPreference}
        onChangePassword={() => setChangePasswordRequested(true)}
      >
        {children}
      </AppShell>
      {passwordChangeRequired || changePasswordRequested ? (
        <ChangePasswordDialog
          required={passwordChangeRequired}
          onClose={() => setChangePasswordRequested(false)}
        />
      ) : null}
    </>
  );
}
