"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Tooltip } from "@base-ui/react/tooltip";
import {
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  GraduationCap,
  UsersRound,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { EmptyState, ErrorState } from "@/components/data-state";
import { Button } from "@/components/ui/button";
import { useDashboardInsights } from "@/features/analytics/use-analytics";
import type { DashboardInsights } from "@/types/lms";
import type { UserRole } from "@/types/api";

const number = (value: number) => value.toLocaleString("id-ID");
const schoolDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date + "T00:00:00+07:00"));
const tone: Record<string, string> = {
  draft: "neutral",
  scheduled: "info",
  ongoing: "primary",
  ended: "subtle",
  pending: "info",
  overdue: "danger",
  submitted: "warning",
  graded: "primary",
  returned: "neutral",
};

function ChartHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="chart-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-2">{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}

function ActivityChart({ data }: { data: DashboardInsights }) {
  const [activeDay, setActiveDay] = useState(0);
  const dayButtons = useRef<(HTMLElement | null)[]>([]);
  const peak = Math.max(
    0,
    ...data.activity.flatMap((day) => [
      day.exam_submissions,
      day.assignment_submissions,
    ]),
  );
  const max = Math.max(2, Math.ceil(peak / 2) * 2);
  const examTotal = data.activity.reduce(
    (sum, day) => sum + day.exam_submissions,
    0,
  );
  const assignmentTotal = data.activity.reduce(
    (sum, day) => sum + day.assignment_submissions,
    0,
  );
  return (
    <section className="insight-surface activity-surface">
      <ChartHeading
        eyebrow="Aktivitas · 14 hari"
        title="Ritme pengumpulan"
        description={`${schoolDate(data.starts_on)} – ${schoolDate(data.ends_on)} · WIB. Jumlah pengumpulan per hari.`}
      />
      <div className="chart-summary">
        <div>
          <span className="chart-dot chart-tone-primary" />
          <span>Ujian</span>
          <strong>{number(examTotal)}</strong>
        </div>
        <div>
          <span className="chart-dot chart-tone-info" />
          <span>Tugas</span>
          <strong>{number(assignmentTotal)}</strong>
        </div>
      </div>
      <div
        className="activity-chart"
        role="group"
        aria-label="Grafik jumlah pengumpulan harian"
      >
        <div className="chart-axis" aria-hidden="true">
          <span>{number(max)}</span>
          <span>{number(Math.round(max / 2))}</span>
          <span>0</span>
        </div>
        <div className="chart-columns">
          {data.activity.map((day, index) => (
            <Tooltip.Root key={day.date}>
              <Tooltip.Trigger
                className="chart-day"
                tabIndex={activeDay === index ? 0 : -1}
                ref={(node: HTMLElement | null) => {
                  dayButtons.current[index] = node;
                }}
                onFocus={() => setActiveDay(index)}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowRight"
                      ? Math.min(index + 1, data.activity.length - 1)
                      : event.key === "ArrowLeft"
                        ? Math.max(index - 1, 0)
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? data.activity.length - 1
                            : null;
                  if (next !== null) {
                    event.preventDefault();
                    setActiveDay(next);
                    dayButtons.current[next]?.focus();
                  }
                }}
                aria-label={`${schoolDate(day.date)}: ${day.exam_submissions} ujian, ${day.assignment_submissions} tugas`}
              >
                <span className="chart-bar-pair" aria-hidden="true">
                  <span
                    className="chart-bar chart-tone-primary"
                    style={{ height: `${(day.exam_submissions / max) * 100}%` }}
                  />
                  <span
                    className="chart-bar chart-tone-info"
                    style={{
                      height: `${(day.assignment_submissions / max) * 100}%`,
                    }}
                  />
                </span>
                <span className="chart-day-label" aria-hidden="true">
                  {index % 3 === 0 || index === data.activity.length - 1
                    ? day.date.slice(8)
                    : ""}
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner
                  side="top"
                  sideOffset={8}
                  className="action-tooltip-positioner"
                >
                  <Tooltip.Popup className="action-tooltip">
                    <strong>{schoolDate(day.date)}</strong>
                    <br />
                    {number(day.exam_submissions)} ujian ·{" "}
                    {number(day.assignment_submissions)} tugas
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>
      </div>
      {examTotal + assignmentTotal === 0 ? (
        <p className="chart-footnote">
          Belum ada pengumpulan pada rentang ini.
        </p>
      ) : (
        <p className="chart-footnote">
          Arahkan penunjuk ke batang atau gunakan panah kiri dan kanan saat
          grafik mendapat fokus.
        </p>
      )}
      <details className="chart-data">
        <summary>Lihat data harian</summary>
        <div className="overflow-x-auto">
          <table className="data-table">
            <caption className="sr-only">
              Data pengumpulan selama 14 hari dalam WIB
            </caption>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th className="numeric-cell">Ujian</th>
                <th className="numeric-cell">Tugas</th>
              </tr>
            </thead>
            <tbody>
              {data.activity.map((day) => (
                <tr key={day.date}>
                  <td>{schoolDate(day.date)}</td>
                  <td className="numeric-cell">
                    {number(day.exam_submissions)}
                  </td>
                  <td className="numeric-cell">
                    {number(day.assignment_submissions)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function Donut({
  items,
  label,
  center,
}: {
  items: { key: string; label: string; value: number }[];
  label: string;
  center?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const segments = items.filter((item) => item.value > 0);
  return (
    <div
      className="donut"
      role="img"
      aria-label={`${label}: ${items.map((item) => `${item.label} ${number(item.value)}`).join(", ")}`}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r="48"
          pathLength="100"
          className="donut-track"
        />
        {segments.map((item, index) => {
          const share = total ? (item.value / total) * 100 : 0;
          const offset = total
            ? (segments
                .slice(0, index)
                .reduce((sum, previous) => sum + previous.value, 0) /
                total) *
              100
            : 0;
          return (
            <circle
              key={item.key}
              cx="60"
              cy="60"
              r="48"
              pathLength="100"
              fill="none"
              className={`donut-segment chart-tone-${tone[item.key] ?? "primary"}`}
              strokeDasharray={`${share} ${100 - share}`}
              strokeDashoffset={-offset}
            />
          );
        })}
      </svg>
      <div className="donut-center" aria-hidden="true">
        <strong>{center ?? number(total)}</strong>
        <span>{center ? "selesai" : "total"}</span>
      </div>
    </div>
  );
}

function Distribution({ data }: { data: DashboardInsights }) {
  const total = data.distribution.reduce((sum, item) => sum + item.value, 0);
  return (
    <section className="insight-surface distribution-surface">
      <ChartHeading
        eyebrow="Komposisi"
        title={data.distribution_title}
        description="Seluruh ujian dalam lingkup akun Anda."
      />
      <Donut items={data.distribution} label={data.distribution_title} />
      <dl className="distribution-legend">
        {data.distribution.map((item) => (
          <div key={item.key}>
            <dt>
              <span
                className={`chart-dot chart-tone-${tone[item.key] ?? "neutral"}`}
              />
              {item.label}
            </dt>
            <dd>
              {number(item.value)}
              <span>{total ? Math.round((item.value / total) * 100) : 0}%</span>
            </dd>
          </div>
        ))}
      </dl>
      {!total ? (
        <p className="chart-footnote">
          Belum ada ujian dalam lingkup akun ini.
        </p>
      ) : null}
    </section>
  );
}

function StudentLearning({ data }: { data: DashboardInsights }) {
  const progress = data.learning_progress;
  const percent =
    progress && progress.total
      ? Math.round((progress.completed / progress.total) * 100)
      : null;
  return (
    <section className="insight-surface learning-progress-surface">
      <ChartHeading
        eyebrow="Langkah demi langkah"
        title="Progres materi"
        description="Materi yang dipublikasikan pada course yang Anda ikuti."
      />
      {progress ? (
        <>
          <Donut
            items={[
              { key: "graded", label: "Selesai", value: progress.completed },
              {
                key: "draft",
                label: "Belum selesai",
                value: Math.max(0, progress.total - progress.completed),
              },
            ]}
            label="Progres materi"
            center={percent === null ? "—" : `${percent}%`}
          />
          <p className="text-center text-sm text-muted">
            <strong className="text-foreground">
              {number(progress.completed)}
            </strong>{" "}
            dari {number(progress.total)} materi selesai
          </p>
          <Link href="/student/materials" className="learning-progress-link">
            Buka ruang baca <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </>
      ) : (
        <p className="chart-footnote">Progres belum tersedia.</p>
      )}
      <div className="student-task-snapshot">
        <h3 className="text-sm font-semibold">{data.distribution_title}</h3>
        <dl className="distribution-legend">
          {data.distribution.map((item) => (
            <div key={item.key}>
              <dt>
                <span
                  className={`chart-dot chart-tone-${tone[item.key] ?? "neutral"}`}
                />
                {item.label}
              </dt>
              <dd>{number(item.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function RecentResults({ data }: { data: DashboardInsights }) {
  return (
    <section className="insight-surface result-chart-surface">
      <ChartHeading
        eyebrow="Hasil belajar"
        title="Perolehan nilai terbaru"
        description="Maksimal 5 hasil terakhir dipublikasikan. Skala nilai 0–100%."
      />
      {data.recent_results.length ? (
        <ol className="result-bars">
          {data.recent_results.map((result) => (
            <li key={result.id}>
              <div className="result-bar-heading">
                <span>
                  <strong>{result.title}</strong>
                  <span>{result.course_name}</span>
                </span>
                <b>
                  {result.percentage.toLocaleString("id-ID", {
                    maximumFractionDigits: 1,
                  })}
                  %
                </b>
              </div>
              <div
                className="result-bar-track"
                role="img"
                aria-label={`${result.title}, ${result.percentage.toFixed(1)} persen`}
              >
                <span
                  style={{
                    width: `${Math.max(0, Math.min(100, result.percentage))}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="p-5">
          <EmptyState
            title="Nilai belum dipublikasikan"
            description="Grafik nilai akan terisi setelah guru mempublikasikan hasil ujian."
          />
        </div>
      )}
      <Link href="/student/results" className="insight-footer-link">
        Lihat rekap hasil <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}

export function DashboardInsightsWorkspace({ role }: { role: UserRole }) {
  const insights = useDashboardInsights();
  if (insights.isLoading)
    return (
      <div className="dashboard-insights" aria-busy="true">
        <p role="status" className="text-sm text-muted">
          Menyiapkan grafik dan analisis…
        </p>
        <div className="insight-metrics" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <span className="skeleton skeleton-square" />
              <span className="skeleton skeleton-title" />
            </div>
          ))}
        </div>
        <div className="insights-grid" aria-hidden="true">
          <div className="insight-surface p-6">
            <span className="skeleton skeleton-title mb-6" />
            <span className="skeleton insight-skeleton-chart" />
          </div>
          <div className="insight-surface p-6">
            <span className="skeleton skeleton-title mb-6" />
            <span className="skeleton insight-skeleton-ring" />
          </div>
        </div>
      </div>
    );
  if (insights.isError && !insights.data)
    return (
      <ErrorState
        label="Grafik dan analisis belum dapat dimuat."
        onRetry={() => void insights.refetch()}
      />
    );
  if (!insights.data) return null;
  const data = insights.data;
  const icons =
    role === "admin"
      ? [GraduationCap, UsersRound, Clock3]
      : [BookOpenText, BarChart3, TrendingUp];
  return (
    <div className="dashboard-insights">
      {insights.isError ? (
        <div className="insight-refresh-error" role="alert">
          <p>Pembaruan gagal. Grafik masih menampilkan data terakhir.</p>
          <Button variant="ghost" onClick={() => void insights.refetch()}>
            Coba lagi
          </Button>
        </div>
      ) : null}
      <dl className="insight-metrics">
        {data.metrics.map((metric, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={metric.key}>
              <span className="insight-metric-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <div>
                <dt>{metric.label}</dt>
                <dd>{number(metric.value)}</dd>
              </div>
            </div>
          );
        })}
      </dl>
      <div
        className={`insights-grid ${role === "student" ? "insights-grid-student" : ""}`}
      >
        <ActivityChart data={data} />
        {role === "student" ? (
          <StudentLearning data={data} />
        ) : (
          <Distribution data={data} />
        )}
        {role === "student" ? <RecentResults data={data} /> : null}
      </div>
      <p className="insight-freshness">
        Diperbarui{" "}
        {new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: data.timezone,
        }).format(new Date(data.generated_at))}{" "}
        WIB ·{" "}
        {role === "admin"
          ? "Lingkup sekolah"
          : role === "teacher"
            ? "Course yang Anda kelola"
            : "Pembelajaran Anda"}
      </p>
    </div>
  );
}
