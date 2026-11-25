import type { ReactNode } from "react";
import { ArrowUpRight, Check, Clock3 } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { StatusBadge } from "@/components/ui/status-badge";
import { AsyncFeedback } from "@/components/async-feedback";
import { ErrorState } from "@/components/data-state";

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
  skeleton,
  showLoading = true,
}: {
  query: { isLoading: boolean; isError: boolean; refetch: () => unknown };
  skeleton: ReactNode;
  showLoading?: boolean;
}) {
  return (
    <>
      {query.isLoading && showLoading && skeleton}{" "}
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
  showSuccess = true,
}: {
  mutation: { error: unknown; isError: boolean; isSuccess: boolean };
  success?: string;
  showSuccess?: boolean;
}) {
  return (
    <AsyncFeedback
      {...mutation}
      isSuccess={showSuccess && mutation.isSuccess}
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
