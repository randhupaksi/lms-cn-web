"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenCheck,
  BookOpenText,
  ClipboardList,
  Activity,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  School,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import type { UserRole } from "@/types/api";

const navigation: Record<
  UserRole,
  { href: Route; label: string; icon: typeof LayoutDashboard }[]
> = {
  admin: [
    { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/admin/users", label: "Pengguna", icon: UsersRound },
    { href: "/admin/academics", label: "Akademik", icon: School },
    { href: "/admin/monitoring", label: "Monitoring", icon: Activity },
    { href: "/teacher/results", label: "Hasil ujian", icon: GraduationCap },
    { href: "/admin/audit", label: "Audit", icon: ShieldCheck },
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
    { href: "/student/exams", label: "Ujian saya", icon: LayoutDashboard },
    { href: "/student/results", label: "Hasil", icon: GraduationCap },
  ],
};

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  if (!user) return null;
  if (pathname.startsWith("/student/attempts/"))
    return (
      <div className="min-h-dvh bg-surface">
        <header className="border-b border-border bg-background px-5 py-3 text-sm font-bold text-primary">
          CITRA NEGARA LMS · MODE UJIAN
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    );
  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-border bg-background lg:min-h-dvh lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center border-b border-border px-5">
          <div>
            <p className="text-sm font-bold text-primary">CITRA NEGARA</p>
            <p className="text-xs text-muted">Learning Management System</p>
          </div>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1"
          aria-label="Navigasi utama"
        >
          {navigation[user.role].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname === href ? "nav-link-active" : ""}`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-5 lg:px-8">
          <div>
            <p className="text-sm font-semibold">{user.full_name}</p>
            <p className="text-xs capitalize text-muted">{user.role}</p>
          </div>
          <button
            className="button-ghost"
            onClick={() => logout().finally(() => router.replace("/login"))}
          >
            <LogOut size={16} /> Keluar
          </button>
        </header>
        <main className="mx-auto max-w-7xl p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
