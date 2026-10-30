import type { ReactNode } from "react";
import { ArrowUpRight, Check, Clock3 } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { StatusBadge } from "@/components/ui/status-badge";
import { AsyncFeedback } from "@/components/async-feedback";
import { ErrorState, LoadingState } from "@/components/data-state";

export const roleLabels: Record<string, string> = {
  superadmin: "Superadmin",
  principal: "Kepala Sekolah",
  admin: "Administrator",
  teacher: "Guru",
  student: "Siswa",
};
export const stateLabels: Record<string, string> = {
  draft: "Draft",
  scheduled: "Terjadwal",
  running: "Berlangsung",
  ended: "Berakhir",
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
  academic: "Akademik",
  holiday: "Hari libur",
  meeting: "Rapat",
  announcement: "Pengumuman",
  exam: "Ujian",
};
export function schoolTime(value: string, dateOnly = false) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(dateOnly ? {} : { hour: "2-digit", minute: "2-digit" }),
  }).format(new Date(value));
}
export function localInput(value: string) {
  const d = new Date(new Date(value).getTime() + 7 * 3600_000);
  return d.toISOString().slice(0, 16);
}
export function inputToISO(value: string) {
  return new Date(`${value}:00+07:00`).toISOString();
}
export function GovernanceBadge({ value }: { value: string }) {
  return (
    <StatusBadge
      tone={
        value === "approved" || value === "running"
          ? "success"
          : value === "pending" || value === "scheduled"
            ? "warning"
            : value === "rejected"
              ? "danger"
              : "neutral"
      }
    >
      {stateLabels[value] ?? value}
    </StatusBadge>
  );
}
export function GovernanceSection({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="governance-section">
      <header className="governance-section-heading">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="section-title">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
export function WorkspaceLink({
  href,
  children,
}: {
  href: Route;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="governance-text-link">
      {children}
      <ArrowUpRight size={15} aria-hidden="true" />
    </Link>
  );
}
export function QueryState({
  query,
  label = "Memuat data sekolah…",
}: {
  query: { isLoading: boolean; isError: boolean; refetch: () => unknown };
  label?: string;
}) {
  return (
    <>
      {query.isLoading && <LoadingState label={label} />}{" "}
      {query.isError && (
        <ErrorState
          label="Data belum dapat dimuat. Coba kembali."
          onRetry={() => void query.refetch()}
        />
      )}
    </>
  );
}
export function MutationFeedback({
  mutation,
  success = "Perubahan berhasil disimpan.",
}: {
  mutation: { error: unknown; isError: boolean; isSuccess: boolean };
  success?: string;
}) {
  return (
    <AsyncFeedback
      {...mutation}
      errorMessage="Perubahan belum dapat diproses."
      successMessage={success}
    />
  );
}
export function CheckLine({
  ok,
  children,
}: {
  ok: boolean;
  children: ReactNode;
}) {
  const Icon = ok ? Check : Clock3;
  return (
    <div className={`governance-check ${ok ? "is-ready" : "is-pending"}`}>
      <Icon size={16} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
