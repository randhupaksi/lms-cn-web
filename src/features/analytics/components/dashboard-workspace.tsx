import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, ClipboardList, GraduationCap, School, UsersRound } from "lucide-react";
import { MetricGrid } from "@/components/metric-grid";
import type { DashboardMetric } from "@/types/lms";
import type { UserRole } from "@/types/api";

type Action = {
  href: Route;
  label: string;
  description: string;
  icon: typeof BookOpenText;
};

const actionByRole: Record<UserRole, Action[]> = {
  student: [
    { href: "/student/assignments", label: "Lihat tugas", description: "Periksa instruksi, deadline, dan status pengumpulan.", icon: ClipboardList },
    { href: "/student/exams", label: "Buka ujian", description: "Lihat assessment yang tersedia dan status attempt.", icon: GraduationCap },
    { href: "/student/materials", label: "Lanjutkan materi", description: "Akses materi yang tersedia di course Anda.", icon: BookOpenText },
  ],
  teacher: [
    { href: "/teacher/assignments", label: "Kelola tugas", description: "Buat, publikasikan, dan nilai pengumpulan siswa.", icon: ClipboardList },
    { href: "/teacher/exams", label: "Kelola ujian", description: "Atur assessment dan publikasi ujian per course.", icon: GraduationCap },
    { href: "/teacher/results", label: "Tinjau hasil", description: "Periksa nilai dan publikasikan hasil yang siap dibagikan.", icon: School },
  ],
  admin: [
    { href: "/admin/users", label: "Kelola pengguna", description: "Atur akun dan akses guru maupun siswa.", icon: UsersRound },
    { href: "/admin/academics", label: "Perbarui akademik", description: "Kelola struktur tahun ajaran, kelas, dan course.", icon: School },
    { href: "/admin/monitoring", label: "Pantau ujian", description: "Tinjau status peserta pada ujian yang sedang berjalan.", icon: GraduationCap },
  ],
};

const dashboardCopy: Record<UserRole, { title: string; description: string }> = {
  student: {
    title: "Ringkasan belajar",
    description: "Mulai dari pekerjaan yang perlu Anda selesaikan, lalu gunakan ringkasan ini untuk melihat kondisi pembelajaran saat ini.",
  },
  teacher: {
    title: "Ringkasan pengajaran",
    description: "Akses pekerjaan inti terlebih dahulu, kemudian gunakan ringkasan untuk memantau aktivitas dalam scope course Anda.",
  },
  admin: {
    title: "Ringkasan operasional",
    description: "Mulai dari administrasi yang perlu ditindaklanjuti dan gunakan ringkasan untuk memantau kondisi LMS.",
  },
};

export function DashboardWorkspace({ role, metrics }: { role: UserRole; metrics: DashboardMetric[] }) {
  const copy = dashboardCopy[role];
  const actions = actionByRole[role];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,.65fr)]">
      <section className="workspace-section" aria-labelledby="dashboard-summary-title">
        <div className="workspace-section-header">
          <div>
            <h2 id="dashboard-summary-title" className="section-title">{copy.title}</h2>
            <p className="section-description">{copy.description}</p>
          </div>
        </div>
        <div className="workspace-section-body">
          <MetricGrid metrics={metrics} />
        </div>
      </section>

      <section className="workspace-section" aria-labelledby="next-actions-title">
        <div className="workspace-section-header">
          <div>
            <h2 id="next-actions-title" className="section-title">Lanjutkan pekerjaan</h2>
            <p className="section-description">Pintasan ke aktivitas utama sesuai peran Anda.</p>
          </div>
        </div>
        <div className="workspace-section-body action-list">
          {actions.map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href} className="action-list-item group">
              <span className="flex min-w-0 items-center gap-3">
                <span className="metric-icon size-10 rounded-[var(--radius-sm)]"><Icon aria-hidden="true" size={18} /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted">{description}</span>
                </span>
              </span>
              <ArrowRight className="shrink-0 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" size={17} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
