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
import { DashboardInsightsWorkspace } from "./dashboard-insights";
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

const actionByRole: Record<
  Exclude<UserRole, "superadmin" | "principal">,
  Action[]
> = {
  student: [
    {
      href: "/student/assignments",
      label: "Lihat tugas",
      description: "Periksa instruksi, deadline, dan status pengumpulan.",
      icon: ClipboardList,
    },
    {
      href: "/student/exams",
      label: "Buka ujian",
      description: "Periksa jadwal ujian dan lanjutkan pengerjaan.",
      icon: GraduationCap,
    },
    {
      href: "/student/materials",
      label: "Lanjutkan materi",
      description: "Akses materi yang tersedia di course Anda.",
      icon: BookOpenText,
    },
  ],
  teacher: [
    {
      href: "/teacher/assignments",
      label: "Kelola tugas",
      description: "Buat, publikasikan, dan nilai pengumpulan siswa.",
      icon: ClipboardList,
    },
    {
      href: "/teacher/exams",
      label: "Kelola ujian",
      description: "Siapkan jadwal, soal, dan peserta ujian.",
      icon: GraduationCap,
    },
    {
      href: "/teacher/results",
      label: "Tinjau hasil",
      description: "Periksa nilai dan publikasikan hasil yang siap dibagikan.",
      icon: School,
    },
  ],
  admin: [
    {
      href: "/admin/users",
      label: "Kelola pengguna",
      description: "Atur akun dan akses guru maupun siswa.",
      icon: UsersRound,
    },
    {
      href: "/admin/academics",
      label: "Perbarui akademik",
      description: "Kelola struktur tahun ajaran, kelas, dan course.",
      icon: School,
    },
    {
      href: "/admin/monitoring",
      label: "Pantau ujian",
      description: "Tinjau status peserta pada ujian yang sedang berjalan.",
      icon: GraduationCap,
    },
  ],
  curriculum: [
    {
      href: "/admin/academics",
      label: "Kelola struktur akademik",
      description: "Atur tahun ajaran, kelas, mata pelajaran, dan course.",
      icon: School,
    },
    {
      href: "/curriculum/exams",
      label: "Periksa kesiapan ujian",
      description: "Tinjau kelengkapan ujian dan koordinasikan tindak lanjut.",
      icon: GraduationCap,
    },
    {
      href: "/curriculum/quality",
      label: "Tinjau kualitas data",
      description: "Temukan data akademik yang memerlukan perbaikan.",
      icon: Radar,
    },
  ],
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
  return `${task.count} sesi aktif`;
}

function PriorityQueue({
  tasks,
  role,
}: {
  tasks: DashboardTask[];
  role: Exclude<UserRole, "superadmin" | "principal">;
}) {
  return (
    <section
      className="workspace-section"
      aria-labelledby="priority-work-title"
    >
      <div className="workspace-section-header">
        <div>
          <h2 id="priority-work-title" className="section-title">
            {role === "student"
              ? "Langkah belajar berikutnya"
              : role === "teacher"
                ? "Perlu ditindaklanjuti"
                : "Antrean operasional"}
          </h2>
          <p className="section-description">
            Diurutkan berdasarkan waktu dan pekerjaan yang memerlukan perhatian.
          </p>
        </div>
        <span className="count-label shrink-0">
          {tasks.length > 3
            ? `3 dari ${tasks.length} prioritas`
            : `${tasks.length} prioritas`}
        </span>
      </div>
      <div className="workspace-section-body task-list">
        {tasks.length ? (
          tasks.slice(0, 3).map((task) => {
            const config = taskConfig[task.kind];
            const status = statusConfig[task.status];
            const Icon = config.icon;
            const href =
              task.kind === "monitoring" && role === "teacher"
                ? "/teacher/monitoring"
                : config.href;
            return (
              <Link
                key={task.kind + "-" + task.id}
                href={href}
                className="task-list-item group"
              >
                <span className="metric-icon shrink-0">
                  <Icon aria-hidden="true" size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="task-category">
                    {config.label} · {task.context}
                  </span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-foreground">
                    {task.title}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    <span className="text-xs leading-5 text-muted">
                      {[taskCountLabel(task), taskTimeLabel(task)]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </span>
                <ArrowRight
                  className="shrink-0 text-muted"
                  aria-hidden="true"
                  size={17}
                />
              </Link>
            );
          })
        ) : (
          <EmptyState
            title={
              role === "student"
                ? "Tidak ada tenggat yang perlu dikejar"
                : "Tidak ada pekerjaan mendesak"
            }
            description={
              role === "student"
                ? "Belum ada tugas atau ujian yang memerlukan perhatian. Lanjutkan belajar melalui akses cepat."
                : role === "teacher"
                  ? "Belum ada penilaian atau hasil yang memerlukan tindak lanjut."
                  : "Belum ada kegiatan operasional yang memerlukan perhatian."
            }
          />
        )}
      </div>
    </section>
  );
}

function QuickActions({
  role,
}: {
  role: Exclude<UserRole, "superadmin" | "principal">;
}) {
  return (
    <nav
      className="quick-action-grid"
      aria-label={
        role === "student"
          ? "Akses cepat pembelajaran"
          : "Akses cepat area kerja"
      }
    >
      {actionByRole[role].map(({ href, label, description, icon: Icon }) => (
        <Link key={href} href={href} className="quick-action-card">
          <span className="quick-action-card-top">
            <span className="quick-action-icon">
              <Icon size={21} aria-hidden="true" />
            </span>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="quick-action-arrow"
            />
          </span>
          <span className="quick-action-title">{label}</span>
          <span className="quick-action-description">{description}</span>
        </Link>
      ))}
    </nav>
  );
}

export function DashboardWorkspace({
  role,
  metrics,
  tasks,
}: {
  role: Exclude<UserRole, "superadmin" | "principal">;
  metrics: DashboardMetric[];
  tasks: DashboardTask[];
}) {
  const overview = {
    admin: {
      title: "Ringkasan akademik",
      description: "Gambaran pengguna, course, dan pelaksanaan ujian sekolah.",
    },
    curriculum: {
      title: "Ringkasan kurikulum",
      description: "Gambaran struktur akademik dan pelaksanaan ujian di seluruh sekolah.",
    },
    teacher: {
      title: "Ringkasan pengajaran",
      description:
        "Pantau course, kesiapan soal, dan hasil yang perlu Anda publikasikan.",
    },
    student: {
      title: "Ringkasan belajar",
      description:
        "Lihat pembelajaran yang diikuti, ujian tersedia, dan progres Anda.",
    },
  }[role];
  const summary = (
    <section className="dashboard-kpis" aria-labelledby="dashboard-kpi-heading">
      <div className="dashboard-overview-heading">
        <h2 id="dashboard-kpi-heading" className="section-title">
          {overview.title}
        </h2>
        <p className="section-description">{overview.description}</p>
      </div>
      {metrics.length ? (
        <MetricGrid metrics={metrics} />
      ) : (
        <EmptyState
          title="Ringkasan belum tersedia"
          description="Belum ada metrik yang dapat ditampilkan untuk akun ini."
        />
      )}
    </section>
  );
  return (
    <div className="dashboard-composition" data-role={role}>
      {summary}
      {role === "student" ? (
        <>
          <div className="dashboard-student-focus">
            <PriorityQueue tasks={tasks} role={role} />
            <div className="dashboard-student-links">
              <div>
                <h2 className="section-title">Jelajahi pembelajaran</h2>
                <p className="section-description">
                  Pilih tempat untuk melanjutkan kegiatan Anda.
                </p>
              </div>
              <QuickActions role={role} />
            </div>
          </div>
          <DashboardInsightsWorkspace role={role} />
        </>
      ) : role === "teacher" ? (
        <>
          <div className="dashboard-teacher-focus">
            <PriorityQueue tasks={tasks} role={role} />
            <QuickActions role={role} />
          </div>
          <DashboardInsightsWorkspace role={role} />
        </>
      ) : (
        <>
          <PriorityQueue tasks={tasks} role={role} />
          <QuickActions role={role} />
          <DashboardInsightsWorkspace role={role} />
        </>
      )}
    </div>
  );
}
