"use client";

import { useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { AsyncFeedback } from "@/components/async-feedback";
import { EmptyState, ErrorState, LoadingState, SelectionState } from "@/components/data-state";
import { MetricGrid } from "@/components/metric-grid";
import { RoleBoundary } from "@/components/role-boundary";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { RadixSelectField } from "@/components/ui/radix-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAcademicData } from "@/features/academics";
import { useExamAnalytics } from "@/features/analytics";
import { useExams } from "@/features/exams";
import { useExamResults, usePublishResults } from "@/features/results/use-results";
import { exportExamResults } from "@/services/results.service";

const resultStatus = {
  draft: { label: "Draft", tone: "neutral" as const },
  reviewed: { label: "Sudah ditinjau", tone: "warning" as const },
  published: { label: "Dipublikasikan", tone: "success" as const },
};

export function TeacherResultsWorkspace() {
  const academics = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const [examId, setExamId] = useState("");
  const [exportState, setExportState] = useState<{
    error: unknown;
    isError: boolean;
    isSuccess: boolean;
    isPending: boolean;
  }>({ error: null, isError: false, isSuccess: false, isPending: false });
  const exams = useExams(courseId);
  const results = useExamResults(examId);
  const publish = usePublishResults(examId);
  const analytics = useExamAnalytics(examId);

  async function downloadExport() {
    setExportState({ error: null, isError: false, isSuccess: false, isPending: true });
    try {
      const blob = await exportExamResults(examId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "hasil-ujian.csv";
      anchor.click();
      URL.revokeObjectURL(url);
      setExportState({ error: null, isError: false, isSuccess: true, isPending: false });
    } catch (error) {
      setExportState({ error, isError: true, isSuccess: false, isPending: false });
    }
  }

  return (
    <RoleBoundary allow={["teacher", "admin"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Penilaian dan hasil"
          title="Hasil ujian"
          description="Nilai objektif dihitung server secara deterministik. Siswa hanya dapat melihat hasil setelah dipublikasikan."
          icon={ChartNoAxesCombined}
        />

        {academics.courses.isLoading ? <LoadingState label="Memuat daftar course…" /> : null}
        {academics.courses.isError ? (
          <ErrorState label="Daftar course belum dapat dimuat." onRetry={() => void academics.courses.refetch()} />
        ) : null}
        {!academics.courses.isLoading && !academics.courses.isError ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field-label">
              Course
              <RadixSelectField
                value={courseId}
                onValueChange={(value) => {
                  setCourseId(value);
                  setExamId("");
                }}
                placeholder="Pilih course yang akan ditinjau"
                options={academics.courses.data?.data.map((item) => ({ value: item.id, label: item.name })) ?? []}
              />
            </label>
            <label className="field-label">
              Ujian
              <RadixSelectField
                value={examId}
                onValueChange={setExamId}
                placeholder={courseId ? "Pilih ujian dari course ini" : "Pilih course terlebih dahulu"}
                disabled={!courseId || exams.isLoading}
                options={exams.data?.data.map((item) => ({ value: item.id, label: item.title })) ?? []}
              />
            </label>
          </div>
        ) : null}

        {!courseId ? (
          <SelectionState
            title="Pilih course untuk meninjau hasil"
            description="Daftar ujian, nilai peserta, dan analisis butir akan tampil setelah course dipilih."
          />
        ) : null}
        {courseId && exams.isLoading ? <LoadingState label="Memuat ujian course…" /> : null}
        {courseId && exams.isError ? (
          <ErrorState label="Daftar ujian belum dapat dimuat." onRetry={() => void exams.refetch()} />
        ) : null}
        {courseId && !exams.isLoading && !exams.isError && exams.data?.data.length === 0 ? (
          <EmptyState title="Belum ada ujian" description="Course ini belum memiliki ujian yang dapat ditinjau." />
        ) : null}

        {examId ? (
          <div className="space-y-6">
            {analytics.isLoading ? <LoadingState label="Menghitung analisis ujian…" /> : null}
            {analytics.isError ? (
              <ErrorState label="Analisis ujian belum dapat dimuat." onRetry={() => void analytics.refetch()} />
            ) : null}
            {analytics.data ? (
              <MetricGrid
                metrics={[
                  { key: "participants", label: "Peserta", value: analytics.data.participant_count },
                  { key: "submitted", label: "Dikumpulkan", value: analytics.data.submitted_count },
                  { key: "average", label: "Rata-rata", value: Number(analytics.data.average_score.toFixed(2)) },
                  { key: "average_percent", label: "Rata-rata (%)", value: Number(analytics.data.average_percent.toFixed(2)) },
                ]}
              />
            ) : null}

            {results.isLoading ? <LoadingState label="Memuat daftar nilai…" /> : null}
            {results.isError ? (
              <ErrorState label="Daftar nilai belum dapat dimuat." onRetry={() => void results.refetch()} />
            ) : null}
            {results.data ? (
              <DataTableShell>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
                  <div>
                    <h2 className="section-title">Daftar nilai</h2>
                    <p className="mt-1 text-xs text-muted">{results.data.meta.total} hasil</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => void downloadExport()} disabled={exportState.isPending || !results.data.data.length}>
                      {exportState.isPending ? "Menyiapkan…" : "Export CSV"}
                    </Button>
                    <Button disabled={publish.isPending || !results.data.data.length} onClick={() => publish.mutate()}>
                      {publish.isPending ? "Mempublikasikan…" : "Publikasikan hasil"}
                    </Button>
                  </div>
                </div>
                <AsyncFeedback
                  error={publish.error}
                  isError={publish.isError}
                  isSuccess={publish.isSuccess}
                  errorMessage="Hasil belum dapat dipublikasikan."
                  successMessage="Hasil berhasil dipublikasikan kepada siswa."
                />
                <AsyncFeedback
                  error={exportState.error}
                  isError={exportState.isError}
                  isSuccess={exportState.isSuccess}
                  errorMessage="File hasil belum dapat diunduh."
                  successMessage="File hasil berhasil disiapkan."
                />
                <DataTable>
                  <thead>
                    <tr><th>Siswa</th><th>Identitas</th><th>Nilai</th><th>Persentase</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {results.data.data.map((item) => {
                      const status = resultStatus[item.status as keyof typeof resultStatus] ?? { label: item.status, tone: "neutral" as const };
                      return (
                        <tr key={item.id}>
                          <td className="font-semibold">{item.student_name}</td>
                          <td>{item.identifier}</td>
                          <td>{item.score} / {item.max_score}</td>
                          <td>{item.percentage.toFixed(1)}%</td>
                          <td><StatusBadge tone={status.tone}>{status.label}</StatusBadge></td>
                        </tr>
                      );
                    })}
                    {results.data.data.length === 0 ? (
                      <tr><td className="empty-cell" colSpan={5}>Belum ada hasil ujian.</td></tr>
                    ) : null}
                  </tbody>
                </DataTable>
              </DataTableShell>
            ) : null}

            {analytics.data && analytics.data.items.length > 0 ? (
              <DataTableShell>
                <div className="border-b border-border p-5">
                  <h2 className="section-title">Analisis butir soal</h2>
                  <p className="mt-1 text-xs text-muted">Akurasi dihitung dari jawaban attempt yang tersimpan.</p>
                </div>
                <DataTable>
                  <thead><tr><th>Soal</th><th>Dijawab</th><th>Benar</th><th>Akurasi</th></tr></thead>
                  <tbody>
                    {analytics.data.items.map((item) => (
                      <tr key={item.question_id}>
                        <td className="max-w-xl whitespace-normal font-semibold">{item.stem}</td>
                        <td>{item.answered_count}</td>
                        <td>{item.correct_count}</td>
                        <td>{item.accuracy.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </DataTableShell>
            ) : null}
          </div>
        ) : null}
      </div>
    </RoleBoundary>
  );
}
