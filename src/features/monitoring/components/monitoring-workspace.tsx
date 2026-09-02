"use client";

import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { MetricGrid } from "@/components/metric-grid";
import { useAcademicData } from "@/features/academics/use-academics";
import { useExams } from "@/features/exams/use-exams";
import { useExamMonitoring } from "@/features/monitoring/use-monitoring";

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
      <header>
        <p className="eyebrow">LIVE EXAM OPERATIONS</p>
        <h1 className="page-title">Monitoring ujian</h1>
        <p className="page-description">
          Status peserta diperbarui otomatis setiap 10 detik dan tetap mengikuti
          status attempt di server.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Course
          <select
            className="field-input"
            value={courseId}
            onChange={(event) => {
              setCourseId(event.target.value);
              setExamId("");
            }}
          >
            <option value="">Pilih course</option>
            {academics.courses.data?.data.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Ujian
          <select
            className="field-input"
            value={examId}
            onChange={(event) => setExamId(event.target.value)}
            disabled={!courseId}
          >
            <option value="">Pilih ujian</option>
            {exams.data?.data.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
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
            <section className="panel overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
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
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
