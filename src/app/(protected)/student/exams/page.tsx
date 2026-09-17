"use client";

import { useRouter } from "next/navigation";
import { RoleBoundary } from "@/components/role-boundary";
import {
  useAvailableExams,
  useStartExam,
} from "@/features/attempts/use-attempts";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { GraduationCap } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { AsyncFeedback } from "@/components/async-feedback";

export default function StudentExamsPage() {
  const exams = useAvailableExams();
  const start = useStartExam();
  const router = useRouter();
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Assessment"
          title="Ujian saya"
          description="Waktu ujian dihitung oleh server. Pastikan koneksi stabil sebelum mulai."
          icon={GraduationCap}
        />
        {exams.isLoading ? <LoadingState label="Memuat ujian yang tersedia…" /> : null}
        {exams.isError ? <ErrorState label="Daftar ujian belum dapat dimuat." onRetry={() => void exams.refetch()} /> : null}
        {!exams.isLoading && !exams.isError && exams.data?.length === 0 ? (
          <EmptyState title="Belum ada ujian tersedia" description="Ujian yang telah dibuka untuk Anda akan muncul di halaman ini." />
        ) : null}
        {exams.data?.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exams.data?.map((exam) => {
            const statusLabel =
              exam.attempt_status === "in_progress"
                ? "Sedang dikerjakan"
                : exam.attempt_status === "submitted"
                  ? "Sudah dikumpulkan"
                  : exam.attempt_status === "expired"
                    ? "Waktu berakhir"
                    : "Belum dimulai";
            const statusTone =
              exam.attempt_status === "submitted"
                ? "success"
                : exam.attempt_status === "expired"
                  ? "danger"
                  : exam.attempt_status === "in_progress"
                    ? "warning"
                    : "neutral";
            return (
            <article className="panel panel-interactive" key={exam.id}>
              <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
              <h2 className="mt-4 text-lg font-semibold">{exam.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                {exam.description || "Tidak ada deskripsi."}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted">Durasi</dt>
                  <dd className="font-semibold">
                    {exam.duration_minutes} menit
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Berakhir</dt>
                  <dd className="font-semibold">
                    {new Date(exam.ends_at).toLocaleString("id-ID")}
                  </dd>
                </div>
              </dl>
              <button
                className="button-primary mt-5 w-full"
                disabled={
                  start.isPending || exam.attempt_status === "submitted"
                }
                onClick={() =>
                  start.mutate(exam.id, {
                    onSuccess: (attempt) =>
                      router.push(`/student/attempts/${attempt.attempt_id}`),
                  })
                }
              >
                {start.isPending && start.variables === exam.id
                  ? "Menyiapkan ujian…"
                  : exam.attempt_status === "in_progress"
                  ? "Lanjutkan ujian"
                  : exam.attempt_status === "submitted"
                    ? "Sudah dikumpulkan"
                    : "Mulai ujian"}
              </button>
            </article>
            );
          })}
        </section> : null}
        <AsyncFeedback
          error={start.error}
          isError={start.isError}
          isSuccess={false}
          errorMessage="Ujian belum dapat dimulai. Periksa jadwal, koneksi, lalu coba kembali."
          successMessage=""
        />
      </div>
    </RoleBoundary>
  );
}
