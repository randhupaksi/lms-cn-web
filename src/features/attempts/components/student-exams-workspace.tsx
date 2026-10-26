"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, CalendarDays, GraduationCap, ArrowRight } from "lucide-react";
import { RoleBoundary } from "@/components/role-boundary";
import {
  useAvailableExams,
  useStartExam,
} from "@/features/attempts/use-attempts";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";

export function StudentExamsWorkspace() {
  const exams = useAvailableExams();
  const start = useStartExam();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = exams.data?.find((exam) => exam.id === selectedId);
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Evaluasi · Jadwal ujian"
          title="Ujian saya"
          description="Periksa jadwal dan durasi. Siapkan koneksi serta waktu yang cukup sebelum memulai ujian."
          icon={GraduationCap}
        />
        <div className="context-note">
          <Clock3 aria-hidden="true" size={18} />
          <p>
            Waktu pengerjaan mengikuti server dan tetap berjalan selama sesi
            ujian. Jawaban yang berhasil disimpan dapat dipulihkan saat Anda
            kembali.
          </p>
        </div>
        {exams.isLoading ? (
          <LoadingState label="Memuat ujian yang tersedia…" />
        ) : null}
        {exams.isError ? (
          <ErrorState
            label="Daftar ujian belum dapat dimuat."
            onRetry={() => void exams.refetch()}
          />
        ) : null}
        {!exams.isLoading && !exams.isError && exams.data?.length === 0 ? (
          <EmptyState
            title="Belum ada ujian tersedia"
            description="Ujian yang telah dibuka untuk Anda akan muncul di halaman ini."
          />
        ) : null}
        {exams.data?.length ? (
          <section className="record-list" aria-label="Daftar ujian">
            {exams.data.map((exam) => {
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
                <article className="record-row exam-schedule-row" key={exam.id}>
                  <div className="min-w-0">
                    <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
                    <h2 className="mt-3 text-lg font-semibold">{exam.title}</h2>
                    {exam.description ? (
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {exam.description}
                      </p>
                    ) : null}
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Clock3
                        className="mt-1 shrink-0 text-muted"
                        size={16}
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-muted">
                          Durasi pengerjaan
                        </dt>
                        <dd className="mt-1 font-semibold">
                          {exam.duration_minutes} menit
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarDays
                        className="mt-1 shrink-0 text-muted"
                        size={16}
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-muted">Jendela ujian</dt>
                        <dd className="mt-1 text-xs leading-6">
                          {new Date(exam.starts_at).toLocaleString("id-ID")}
                          <br />
                          hingga{" "}
                          {new Date(exam.ends_at).toLocaleString("id-ID")}
                        </dd>
                      </div>
                    </div>
                  </dl>
                  <Button
                    variant={
                      exam.attempt_status === "in_progress"
                        ? "primary"
                        : "secondary"
                    }
                    disabled={
                      start.isPending || exam.attempt_status === "submitted"
                    }
                    onClick={() => {
                      start.reset();
                      setSelectedId(exam.id);
                    }}
                  >
                    {exam.attempt_status === "in_progress"
                      ? "Lanjutkan ujian"
                      : exam.attempt_status === "submitted"
                        ? "Sudah dikumpulkan"
                        : "Mulai ujian"}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Button>
                </article>
              );
            })}
          </section>
        ) : null}
        <ConfirmationDialog
          open={Boolean(selected)}
          onOpenChange={(value) => {
            if (!value) setSelectedId(null);
          }}
          title={
            selected?.attempt_status === "in_progress"
              ? "Lanjutkan sesi ujian?"
              : "Siap memulai ujian?"
          }
          description={
            selected?.title +
            ". Durasi pengerjaan " +
            selected?.duration_minutes +
            " menit. Waktu mengikuti batas sesi dari server dan tidak berhenti ketika halaman ditutup."
          }
          confirmLabel={
            selected?.attempt_status === "in_progress"
              ? "Lanjutkan ujian"
              : "Ya, mulai ujian"
          }
          pendingLabel="Menyiapkan ujian…"
          pending={start.isPending}
          onConfirm={() => {
            if (selected)
              start.mutate(selected.id, {
                onSuccess: (attempt) =>
                  router.push(`/student/attempts/${attempt.attempt_id}`),
              });
          }}
        >
          <AsyncFeedback
            error={start.error}
            isError={start.isError}
            isSuccess={false}
            errorMessage="Ujian belum dapat dimulai. Periksa jadwal, koneksi, lalu coba kembali."
            successMessage=""
          />
        </ConfirmationDialog>
      </div>
    </RoleBoundary>
  );
}
