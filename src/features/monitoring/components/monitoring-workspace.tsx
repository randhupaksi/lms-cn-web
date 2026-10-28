"use client";
import { ActionButton } from "@/components/ui/action-button";
import { FilterBar } from "@/components/ui/filter-bar";
import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { MetricGrid } from "@/components/metric-grid";
import { useAllCourses } from "@/features/academics";
import { useExams } from "@/features/exams";
import { useExamMonitoring } from "@/features/monitoring/use-monitoring";
import { PageHeader } from "@/components/ui/page-header";
import { Activity, Radar } from "lucide-react";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { RadixSelectField } from "@/components/ui/radix-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
import type { Exam } from "@/types/lms";
const PAGE_SIZE = 20;
const statusLabels: Record<string, string> = {
  not_started: "Belum mulai",
  in_progress: "Mengerjakan",
  submitted: "Dikumpulkan",
  expired: "Kedaluwarsa",
};
const statusTones = {
  not_started: "neutral",
  in_progress: "warning",
  submitted: "success",
  expired: "danger",
} as const;
export function MonitoringWorkspace() {
  const courses = useAllCourses();
  const [courseFilter, setCourseFilter] = useState("all");
  const [examSearch, setExamSearch] = useState("");
  const [examPage, setExamPage] = useState(1);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [participantSearch, setParticipantSearch] = useState("");
  const [participantPage, setParticipantPage] = useState(1);
  const courseId = courseFilter === "all" ? undefined : courseFilter;
  const exams = useExams(courseId, {
    search: examSearch,
    page: examPage,
    per_page: PAGE_SIZE,
  });
  const monitoring = useExamMonitoring(selectedExam?.id ?? "", {
    search: participantSearch,
    page: participantPage,
    per_page: PAGE_SIZE,
  });
  const courseOptions =
    courses.data?.map((item) => ({ value: item.id, label: item.name })) ?? [];
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operasional · Monitoring"
        title="Monitoring ujian"
        description="Pantau progres pengerjaan dan status peserta. Informasi diperbarui otomatis setiap 10 detik."
        icon={Activity}
      />
      <section className="space-y-4">
        <FilterBar>
          <label className="field-label">
            Cari ujian
            <input
              className="field-input"
              type="search"
              value={examSearch}
              onChange={(e) => {
                setExamSearch(e.target.value);
                setExamPage(1);
                setSelectedExam(null);
              }}
              placeholder="Judul ujian"
            />
          </label>
          <label className="field-label">
            Course
            <RadixSelectField
              value={courseFilter}
              onValueChange={(v) => {
                setCourseFilter(v);
                setExamPage(1);
                setSelectedExam(null);
              }}
              placeholder="Semua course"
              options={[
                { value: "all", label: "Semua course" },
                ...courseOptions,
              ]}
            />
          </label>
        </FilterBar>
        {exams.isLoading ? <LoadingState label="Memuat daftar ujian…" /> : null}
        {exams.isError ? (
          <ErrorState
            label="Daftar ujian belum dapat dimuat."
            onRetry={() => void exams.refetch()}
          />
        ) : null}
        {!exams.isLoading && !exams.isError && exams.data?.data.length === 0 ? (
          <EmptyState
            title="Belum ada ujian"
            description="Belum ada ujian yang sesuai dengan filter ini."
          />
        ) : null}
        {exams.data?.data.length ? (
          <DataTableShell>
            <div className="overflow-x-auto">
              <DataTable className="monitoring-table">
                <thead>
                  <tr>
                    <th>Ujian</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Jadwal</th>
                    <th className="action-column">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.data.data.map((exam) => (
                    <tr
                      key={exam.id}
                      data-selected={selectedExam?.id === exam.id}
                    >
                      <td className="font-semibold">{exam.title}</td>
                      <td>
                        {exam.course_name ??
                          courses.data?.find(
                            (item) => item.id === exam.course_id,
                          )?.name}
                      </td>
                      <td>
                        <StatusBadge
                          tone={
                            exam.status === "published" ? "success" : "neutral"
                          }
                        >
                          {exam.status}
                        </StatusBadge>
                      </td>
                      <td>
                        {new Date(exam.starts_at).toLocaleString("id-ID")}
                      </td>
                      <td>
                        <ActionButton
                          icon={Radar}
                          label={
                            selectedExam?.id === exam.id
                              ? "Ujian sedang dipantau"
                              : `Pantau peserta ${exam.title}`
                          }
                          aria-pressed={selectedExam?.id === exam.id}
                          onClick={() => {
                            setSelectedExam(exam);
                            setParticipantSearch("");
                            setParticipantPage(1);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
            <Pagination
              page={examPage}
              totalPages={exams.data.meta.total_pages}
              onPageChange={setExamPage}
            />
          </DataTableShell>
        ) : null}
      </section>
      {selectedExam ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title">{selectedExam.title}</h2>
              <p className="mt-1 text-sm text-muted">
                {selectedExam.course_name ??
                  courses.data?.find(
                    (item) => item.id === selectedExam.course_id,
                  )?.name}
              </p>
            </div>
            <label className="field-label">
              Cari peserta
              <input
                className="field-input"
                type="search"
                value={participantSearch}
                onChange={(e) => {
                  setParticipantSearch(e.target.value);
                  setParticipantPage(1);
                }}
                placeholder="Nama atau identifier"
              />
            </label>
          </div>
          {monitoring.isLoading ? (
            <LoadingState label="Memuat status peserta…" />
          ) : null}
          {monitoring.isError ? (
            <ErrorState
              label="Monitoring ujian belum dapat dimuat."
              onRetry={() => void monitoring.refetch()}
            />
          ) : null}
          {monitoring.data ? (
            <>
              <MetricGrid
                layout="strip"
                metrics={[
                  {
                    key: "total",
                    label: "Total peserta",
                    value: monitoring.data.data.total,
                  },
                  {
                    key: "not_started",
                    label: "Belum mulai",
                    value: monitoring.data.data.not_started,
                  },
                  {
                    key: "in_progress",
                    label: "Mengerjakan",
                    value: monitoring.data.data.in_progress,
                  },
                  {
                    key: "submitted",
                    label: "Dikumpulkan",
                    value: monitoring.data.data.submitted,
                  },
                ]}
              />
              {monitoring.data.data.participants.length === 0 ? (
                <EmptyState
                  title="Belum ada peserta"
                  description="Tidak ada peserta yang sesuai dengan pencarian saat ini."
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
                          <th className="numeric-cell">Terjawab</th>
                          <th>Aktivitas terakhir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monitoring.data.data.participants.map(
                          (participant) => (
                            <tr key={participant.student_id}>
                              <td className="font-semibold">
                                {participant.student_name}
                              </td>
                              <td>{participant.identifier}</td>
                              <td>
                                <StatusBadge
                                  tone={statusTones[participant.status]}
                                >
                                  {statusLabels[participant.status] ??
                                    participant.status}
                                </StatusBadge>
                              </td>
                              <td className="numeric-cell">
                                {participant.answered_count}
                              </td>
                              <td>
                                {participant.last_activity_at
                                  ? new Date(
                                      participant.last_activity_at,
                                    ).toLocaleString("id-ID")
                                  : "—"}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </DataTable>
                  </div>
                  <Pagination
                    page={participantPage}
                    totalPages={monitoring.data.meta.total_pages}
                    onPageChange={setParticipantPage}
                  />
                </DataTableShell>
              )}
            </>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
