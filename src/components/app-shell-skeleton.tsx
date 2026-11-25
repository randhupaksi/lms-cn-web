import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/brand-mark";
import { SkeletonBlock } from "@/components/ui/skeleton";

function SidebarSkeleton({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  return (
    <aside
      className={cn(
        "workspace-sidebar workspace-sidebar-closed workspace-sidebar-skeleton",
        sidebarCollapsed && "workspace-sidebar-desktop-collapsed",
      )}
      aria-hidden="true"
    >
      <div className="workspace-sidebar-skeleton-stage">
        <div className="workspace-brand">
          <span className="workspace-brand-mark">
            <BrandMark size={34} />
          </span>
          <span className="workspace-skeleton-brand-copy">
            <SkeletonBlock className="workspace-skeleton-brand-name" />
            <SkeletonBlock className="workspace-skeleton-brand-role" />
          </span>
        </div>
        <div className="mx-5 h-px bg-white/12" />
        <div className="workspace-sidebar-scroll">
          {[3, 2, 3].map((rowCount, groupIndex) => (
            <div className="workspace-nav-group" key={groupIndex}>
              <SkeletonBlock className="workspace-skeleton-nav-heading" />
              <div className="space-y-1.5">
                {Array.from({ length: rowCount }, (_, rowIndex) => (
                  <div className="workspace-skeleton-nav-row" key={rowIndex}>
                    <SkeletonBlock className="workspace-skeleton-nav-icon" />
                    <SkeletonBlock className="workspace-skeleton-nav-label" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="workspace-sidebar-footer">
          <div className="workspace-account-dock">
            <SkeletonBlock className="workspace-skeleton-avatar" />
            <span className="workspace-skeleton-account-copy">
              <SkeletonBlock className="workspace-skeleton-account-name" />
              <SkeletonBlock className="workspace-skeleton-account-role" />
            </span>
          </div>
          <SkeletonBlock className="workspace-skeleton-footer-action" />
        </div>
      </div>
    </aside>
  );
}

function TopbarSkeleton() {
  return (
    <header
      className="workspace-topbar workspace-topbar-skeleton skeleton-stage"
      aria-hidden="true"
    >
      <span className="workspace-skeleton-topbar-leading">
        <SkeletonBlock className="workspace-skeleton-menu" />
        <span className="workspace-skeleton-breadcrumb">
          <SkeletonBlock className="workspace-skeleton-breadcrumb-item" />
          <SkeletonBlock className="workspace-skeleton-breadcrumb-item-short" />
        </span>
      </span>
      <span className="workspace-skeleton-user">
        <SkeletonBlock className="workspace-skeleton-avatar" />
        <span className="workspace-skeleton-user-copy">
          <SkeletonBlock className="workspace-skeleton-account-name" />
          <SkeletonBlock className="workspace-skeleton-account-role" />
        </span>
      </span>
    </header>
  );
}

export function AppShellSkeleton({
  children,
  sidebarCollapsed,
}: Readonly<{
  children: ReactNode;
  sidebarCollapsed: boolean;
}>) {
  return (
    <div className="workspace-shell workspace-shell-skeleton">
      <SidebarSkeleton sidebarCollapsed={sidebarCollapsed} />
      <div
        className={cn(
          "workspace-main",
          sidebarCollapsed && "workspace-main-sidebar-collapsed",
        )}
      >
        <TopbarSkeleton />
        <main className="workspace-content">{children}</main>
      </div>
    </div>
  );
}
