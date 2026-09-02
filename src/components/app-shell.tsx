"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BookOpenCheck,
  BookOpenText,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/auth-provider";
import type { UserRole } from "@/types/api";

type NavigationItem = {
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
};

const navigation: Record<UserRole, NavigationItem[]> = {
  admin: [
    { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/admin/users", label: "Pengguna", icon: UsersRound },
    { href: "/admin/academics", label: "Akademik", icon: School },
    { href: "/admin/monitoring", label: "Monitoring", icon: Activity },
    { href: "/teacher/results", label: "Hasil ujian", icon: GraduationCap },
    { href: "/admin/audit", label: "Audit aktivitas", icon: ShieldCheck },
  ],
  teacher: [
    { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/teacher/questions", label: "Bank soal", icon: BookOpenCheck },
    { href: "/teacher/materials", label: "Materi", icon: BookOpenText },
    { href: "/teacher/assignments", label: "Tugas", icon: ClipboardList },
    { href: "/teacher/exams", label: "Ujian", icon: GraduationCap },
    { href: "/teacher/monitoring", label: "Monitoring", icon: Activity },
    { href: "/teacher/results", label: "Hasil", icon: School },
  ],
  student: [
    { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/student/materials", label: "Materi", icon: BookOpenText },
    { href: "/student/assignments", label: "Tugas", icon: ClipboardList },
    { href: "/student/exams", label: "Ujian saya", icon: GraduationCap },
    { href: "/student/results", label: "Hasil belajar", icon: School },
  ],
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  teacher: "Guru",
  student: "Siswa",
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isNavigationActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function resolvePageTitle(pathname: string, items: NavigationItem[]) {
  const item = [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find(({ href }) => isNavigationActive(pathname, href));
  return item?.label ?? "Citra Negara LMS";
}

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  if (pathname.startsWith("/student/attempts/")) {
    return (
      <div className="workspace-shell">
        <header className="workspace-topbar mx-2 lg:mx-auto lg:max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="workspace-user-avatar">CN</span>
            <div>
              <p className="eyebrow">Mode ujian</p>
              <p className="text-sm font-bold text-foreground">Citra Negara LMS</p>
            </div>
          </div>
          <span className="status-badge status-active">Sesi terlindungi</span>
        </header>
        <main className="mx-auto w-full max-w-7xl px-3 pb-8 sm:px-5 lg:px-8">
          {children}
        </main>
      </div>
    );
  }

  const items = navigation[user.role];
  const roleLabel = roleLabels[user.role];
  const pageTitle = resolvePageTitle(pathname, items);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="workspace-shell">
      <button
        type="button"
        aria-label="Tutup navigasi"
        aria-hidden={!sidebarOpen}
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "sidebar-overlay lg:hidden",
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "workspace-sidebar",
          sidebarOpen ? "workspace-sidebar-open" : "workspace-sidebar-closed",
        )}
        aria-label="Navigasi aplikasi"
      >
        <div className="workspace-brand">
          <div className="workspace-brand-mark">CN</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">Citra Negara LMS</p>
            <p className="mt-1 text-xs leading-5 text-white/70">Ruang belajar dan evaluasi sekolah</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="mx-5 h-px bg-white/12" />
        <div className="workspace-sidebar-scroll">
          <p className="workspace-nav-label">Portal {roleLabel}</p>
          <nav className="space-y-1.5" aria-label="Menu utama">
            {items.map(({ href, label, icon: Icon }) => {
              const active = isNavigationActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn("nav-link", active && "nav-link-active")}
                >
                  <span className="nav-icon"><Icon aria-hidden="true" size={17} /></span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4">
          <div className="mb-4 h-px bg-white/12" />
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-danger-soft px-5 text-sm font-bold text-danger transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut size={17} /> Keluar
          </button>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="secondary"
              size="icon"
              className="shrink-0 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={18} />
            </Button>
            <div className="min-w-0">
              <p className="eyebrow">Portal {roleLabel}</p>
              <p className="mt-1 truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {pageTitle}
              </p>
            </div>
          </div>

          <div className="workspace-user">
            <span className="workspace-user-avatar">{getInitials(user.full_name)}</span>
            <div className="hidden min-w-0 pr-2 sm:block">
              <p className="max-w-44 truncate text-xs font-bold text-foreground">{user.full_name}</p>
              <p className="mt-0.5 text-xs text-muted">{roleLabel}</p>
            </div>
          </div>
        </header>

        <main className="workspace-content">{children}</main>
      </div>
    </div>
  );
}
