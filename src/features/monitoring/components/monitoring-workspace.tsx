"use client";

import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { MetricGrid } from "@/components/metric-grid";
import { useAcademicData } from "@/features/academics/use-academics";
import { useExams } from "@/features/exams/use-exams";
import { useExamMonitoring } from "@/features/monitoring/use-monitoring";
import { PageHeader } from "@/components/ui/page-header";
import { Activity } from "lucide-react";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { RadixSelectField } from "@/components/ui/radix-select";

const statusLabels: Record<string, string> = {
  not_started: "Belum mulai",
  in_progress: "Mengerjakan",
  submitted: "Submitted",
  expired: "Kedaluwarsa",
};

export function MonitoringWorkspace() {
  const academics = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const [examId, setExamId] = useState("");
  const exams = useExams(courseId);
  const monitoring = useExamMonitoring(examId);
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Live exam operations"
        title="Monitoring ujian"
        description="Status peserta diperbarui otomatis setiap 10 detik dan tetap mengikuti status attempt di server."
        icon={Activity}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Course
          <RadixSelectField
            value={courseId}
            onValueChange={(value) => {
              setCourseId(value);
              setExamId("");
            }}
            placeholder="Pilih course"
            options={academics.courses.data?.data.map((course) => ({ value: course.id, label: course.name })) ?? []}
          />
        </label>
        <label className="field-label">
          Ujian
          <RadixSelectField
            value={examId}
            onValueChange={setExamId}
            placeholder="Pilih ujian"
            options={exams.data?.data.map((exam) => ({ value: exam.id, label: exam.title })) ?? []}
            disabled={!courseId}
          />
        </label>
      </div>
      {monitoring.isLoading && <LoadingState label="Memuat status peserta…" />}
      {monitoring.isError && (
        <ErrorState label="Monitoring ujian belum dapat dimuat." />
      )}
      {monitoring.data && (
        <>
          <MetricGrid
            metrics={[
              {
                key: "total",
                label: "Total peserta",
                value: monitoring.data.total,
              },
              {
                key: "not_started",
                label: "Belum mulai",
                value: monitoring.data.not_started,
              },
              {
                key: "in_progress",
                label: "Mengerjakan",
                value: monitoring.data.in_progress,
              },
              {
                key: "submitted",
                label: "Submitted",
                value: monitoring.data.submitted,
              },
            ]}
          />
          {monitoring.data.participants.length === 0 ? (
            <EmptyState
              title="Belum ada peserta"
              description="Tambahkan peserta pada konfigurasi ujian terlebih dahulu."
            />
          ) : (
            <DataTableShell>
              <div className="overflow-x-auto">
                <DataTable>
                  <thead>
                    <tr>
                      <th>Peserta</th>
                      <th>Identitas</th>
                      <th>Status</th>
                      <th>Terjawab</th>
                      <th>Aktivitas terakhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitoring.data.participants.map((participant) => (
                      <tr key={participant.student_id}>
                        <td className="font-semibold">
                          {participant.student_name}
                        </td>
                        <td>{participant.identifier}</td>
                        <td>
                          <span
                            className={`status-badge ${participant.status === "submitted" || participant.status === "in_progress" ? "status-active" : ""}`}
                          >
                            {statusLabels[participant.status] ??
                              participant.status}
                          </span>
                        </td>
                        <td>{participant.answered_count}</td>
                        <td>
                          {participant.last_activity_at
                            ? new Date(
                                participant.last_activity_at,
                              ).toLocaleString("id-ID")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </div>
            </DataTableShell>
          )}
        </>
      )}
    </div>
  );
}
