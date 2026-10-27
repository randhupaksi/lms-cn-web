import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, GraduationCap, School } from "lucide-react";
import type { UserRole } from "@/types/api";

const headerByRole: Record<
  Exclude<UserRole, "superadmin">,
  {
    eyebrow: string;
    greeting: string;
    description: string;
    action: string;
    href: Route;
    icon: typeof School;
  }
> = {
  admin: {
    eyebrow: "Ruang operasional Citra Negara",
    greeting: "Selamat datang",
    description:
      "Kelola data akademik, akun, dan pelaksanaan ujian sekolah dari satu tempat.",
    action: "Kelola akademik",
    href: "/admin/academics",
    icon: School,
  },
  teacher: {
    eyebrow: "Ruang mengajar Citra Negara",
    greeting: "Selamat mengajar",
    description:
      "Siapkan pembelajaran, pantau pengumpulan, dan beri umpan balik untuk siswa Anda.",
    action: "Kelola ujian",
    href: "/teacher/exams",
    icon: GraduationCap,
  },
  student: {
    eyebrow: "Ruang belajar Citra Negara",
    greeting: "Selamat belajar",
    description:
      "Lanjutkan materi, selesaikan tugas, dan ikuti perkembangan belajar Anda.",
    action: "Lanjutkan belajar",
    href: "/student/materials",
    icon: BookOpenText,
  },
};

export function DashboardHeader({
  role,
  name,
  refreshAction,
}: {
  role: Exclude<UserRole, "superadmin">;
  name: string;
  refreshAction: ReactNode;
}) {
  const copy = headerByRole[role];
  const Icon = copy.icon;
  return (
    <header className="dashboard-welcome">
      <div className="dashboard-welcome-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="dashboard-welcome-title">
          {copy.greeting}
          {name.trim() ? `, ${name}` : ""}
        </h1>
        <p className="dashboard-welcome-description">{copy.description}</p>
      </div>
      <div className="dashboard-welcome-actions">
        <Link className="button-secondary" href={copy.href}>
          <Icon size={17} aria-hidden="true" />
          {copy.action}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        {refreshAction}
      </div>
    </header>
  );
}
