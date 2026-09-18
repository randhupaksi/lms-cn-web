"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/auth-provider";
import type { UserRole } from "@/types/api";

type NavigationItem = {
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
};

const navigation: Record<UserRole, NavigationItem[]> = {
  admin: [
    { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, group: "Workspace" },
    { href: "/admin/users", label: "Pengguna", icon: UsersRound, group: "Data akademik" },
    { href: "/admin/academics", label: "Akademik", icon: School, group: "Data akademik" },
    { href: "/admin/monitoring", label: "Monitoring", icon: Activity, group: "Operasional" },
    { href: "/teacher/results", label: "Hasil ujian", icon: GraduationCap, group: "Operasional" },
    { href: "/admin/audit", label: "Audit aktivitas", icon: ShieldCheck, group: "Operasional" },
  ],
  teacher: [
    { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, group: "Workspace" },
    { href: "/teacher/questions", label: "Bank soal", icon: BookOpenCheck, group: "Pembelajaran" },
    { href: "/teacher/materials", label: "Materi", icon: BookOpenText, group: "Pembelajaran" },
    { href: "/teacher/assignments", label: "Tugas", icon: ClipboardList, group: "Pembelajaran" },
    { href: "/teacher/exams", label: "Ujian", icon: GraduationCap, group: "Pembelajaran" },
    { href: "/teacher/monitoring", label: "Monitoring", icon: Activity, group: "Evaluasi" },
    { href: "/teacher/results", label: "Hasil", icon: School, group: "Evaluasi" },
  ],
  student: [
    { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, group: "Workspace" },
    { href: "/student/materials", label: "Materi", icon: BookOpenText, group: "Pembelajaran" },
    { href: "/student/assignments", label: "Tugas", icon: ClipboardList, group: "Pembelajaran" },
    { href: "/student/exams", label: "Ujian saya", icon: GraduationCap, group: "Pembelajaran" },
    { href: "/student/results", label: "Hasil belajar", icon: School, group: "Pembelajaran" },
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
  const [isLoggingOut, setLoggingOut] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sidebarOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = () =>
      Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ??
          [],
      );
    focusables()[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [sidebarOpen]);

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
          <StatusBadge tone="success">Sesi terlindungi</StatusBadge>
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
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="workspace-shell">
      <a href="#main-content" className="skip-link button-primary">
        Langsung ke konten utama
      </a>
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
        ref={sidebarRef}
        id="application-navigation"
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
          <nav className="relative z-10" aria-label="Menu utama">
            {Array.from(new Set(items.map((item) => item.group))).map((group) => (
              <div className="workspace-nav-group" key={group}>
                <p className="workspace-nav-group-label">{group}</p>
                <div className="space-y-1.5">
                  {items.filter((item) => item.group === group).map(({ href, label, icon: Icon }) => {
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
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="workspace-sidebar-footer">
          <div className="workspace-account-dock">
            <span className="workspace-user-avatar">{getInitials(user.full_name)}</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">{user.full_name}</p>
              <p className="mt-0.5 text-[11px] text-white/62">Akun {roleLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="workspace-sidebar-logout"
            disabled={isLoggingOut}
          >
            <LogOut size={17} /> {isLoggingOut ? "Mengakhiri sesi…" : "Keluar"}
          </button>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={sidebarOpen}
              aria-controls="application-navigation"
            >
              <Menu size={19} />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-muted">{roleLabel}</p>
              <p className="mt-0.5 truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
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

        <main id="main-content" className="workspace-content" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
