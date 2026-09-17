import type { Route } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  Radar,
  School,
  UsersRound,
} from "lucide-react";
import { EmptyState } from "@/components/data-state";
import { MetricGrid } from "@/components/metric-grid";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardMetric, DashboardTask } from "@/types/lms";
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

const taskConfig: Record<
  DashboardTask["kind"],
  { href: Route; label: string; icon: typeof ClipboardList }
> = {
  assignment: {
    href: "/student/assignments",
    label: "Tugas",
    icon: ClipboardList,
  },
  exam: { href: "/student/exams", label: "Ujian", icon: GraduationCap },
  grading: {
    href: "/teacher/assignments",
    label: "Penilaian",
    icon: ClipboardCheck,
  },
  results: {
    href: "/teacher/results",
    label: "Hasil ujian",
    icon: CheckCircle2,
  },
  monitoring: {
    href: "/admin/monitoring",
    label: "Monitoring",
    icon: Radar,
  },
};

const statusConfig: Record<
  DashboardTask["status"],
  { label: string; tone: "neutral" | "success" | "warning" | "danger" }
> = {
  pending: { label: "Belum dikumpulkan", tone: "warning" },
  overdue: { label: "Terlambat", tone: "danger" },
  upcoming: { label: "Akan datang", tone: "neutral" },
  available: { label: "Tersedia", tone: "success" },
  in_progress: { label: "Berlangsung", tone: "success" },
  needs_grading: { label: "Perlu dinilai", tone: "warning" },
  needs_publish: { label: "Perlu dipublikasikan", tone: "warning" },
};

function taskTimeLabel(task: DashboardTask) {
  if (!task.attention_at) return null;
  const prefix =
    task.status === "upcoming"
      ? "Mulai"
      : task.status === "overdue"
        ? "Tenggat"
        : task.kind === "grading" || task.kind === "results"
          ? "Aktivitas terakhir"
          : "Berakhir";
  return `${prefix} ${format(new Date(task.attention_at), "d MMM, HH.mm", { locale: id })}`;
}

function taskCountLabel(task: DashboardTask) {
  if (!task.count) return null;
  if (task.kind === "grading") return `${task.count} pengumpulan`;
  if (task.kind === "results") return `${task.count} hasil`;
  return `${task.count} attempt aktif`;
}

export function DashboardWorkspace({
  role,
  metrics,
  tasks,
}: {
  role: UserRole;
  metrics: DashboardMetric[];
  tasks: DashboardTask[];
}) {
  const copy = dashboardCopy[role];
  const actions = actionByRole[role];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,.8fr)]">
      <section className="workspace-section" aria-labelledby="priority-work-title">
        <div className="workspace-section-header">
          <div>
            <h2 id="priority-work-title" className="section-title">Prioritas kerja</h2>
            <p className="section-description">Hal yang paling dekat waktunya atau masih memerlukan tindakan Anda.</p>
          </div>
        </div>
        <div className="workspace-section-body task-list">
          {tasks.length ? (
            tasks.map((task) => {
              const config = taskConfig[task.kind];
              const status = statusConfig[task.status];
              const Icon = config.icon;
              const timeLabel = taskTimeLabel(task);
              const countLabel = taskCountLabel(task);
              return (
                <Link key={`${task.kind}-${task.id}`} href={config.href} className="task-list-item group">
                  <span className="metric-icon size-10 rounded-[var(--radius-sm)]">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted">{config.label}</span>
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </span>
                    <span className="mt-1 block truncate text-sm font-semibold text-foreground">{task.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">
                      {[task.context, countLabel, timeLabel].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <ArrowRight className="shrink-0 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" size={17} />
                </Link>
              );
            })
          ) : (
            <EmptyState
              title="Tidak ada pekerjaan mendesak"
              description="Antrean prioritas Anda sedang bersih. Gunakan akses cepat untuk membuka area kerja lainnya."
            />
          )}
        </div>
      </section>

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

      <section className="workspace-section xl:col-span-2" aria-labelledby="next-actions-title">
        <div className="workspace-section-header">
          <div>
            <h2 id="next-actions-title" className="section-title">Akses cepat</h2>
            <p className="section-description">Buka area kerja utama sesuai tanggung jawab akun Anda.</p>
          </div>
        </div>
        <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {actions.map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href} className="group flex items-center justify-between gap-4 p-5">
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
