"use client";

import { useEffect, useState } from "react";
import { EmptyState, ErrorState, LoadingState, SelectionState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useCourses } from "@/features/academics/use-academics";
import {
  useAssignments,
  useSubmitAssignment,
} from "@/features/assignments/use-assignments";
import { PageHeader } from "@/components/ui/page-header";
import { ClipboardList } from "lucide-react";
import { RadixSelectField } from "@/components/ui/radix-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { AsyncFeedback } from "@/components/async-feedback";

const submissionLabel = {
  submitted: "Menunggu penilaian",
  graded: "Sudah dinilai",
  returned: "Dikembalikan",
} as const;

export default function StudentAssignmentsPage() {
  const [now, setNow] = useState(() => Date.now());
  const courses = useCourses();
  const [courseId, setCourseId] = useState("");
  const [activeId, setActiveId] = useState("");
  const [content, setContent] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const assignments = useAssignments(courseId);
  const submit = useSubmitAssignment(courseId);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Course saya"
          title="Tugas"
          description="Lihat instruksi, deadline, status pengumpulan, feedback, dan nilai tugas."
          icon={ClipboardList}
        />
        <label className="field-label max-w-lg">
          Course
          <RadixSelectField
            value={courseId}
            onValueChange={(value) => {
              setCourseId(value);
              setActiveId("");
            }}
            placeholder="Pilih course"
            options={courses.data?.data.map((course) => ({ value: course.id, label: course.name })) ?? []}
          />
        </label>
        {courses.isLoading && <LoadingState label="Memuat daftar course…" />}
        {courses.isError && <ErrorState label="Course belum dapat dimuat." onRetry={() => void courses.refetch()} />}
        {!courses.isLoading && !courses.isError && courses.data?.data.length === 0 && (
          <EmptyState title="Belum ada course" description="Anda belum terdaftar pada course yang memiliki tugas." />
        )}
        {!courseId && courses.data?.data.length ? <SelectionState /> : null}
        {courseId && assignments.isLoading && <LoadingState label="Memuat tugas…" />}
        {courseId && assignments.isError && (
          <ErrorState label="Tugas belum dapat dimuat." onRetry={() => void assignments.refetch()} />
        )}
        {courseId && assignments.data?.length === 0 && (
          <EmptyState
            title="Belum ada tugas"
            description="Guru belum mempublikasikan tugas pada course ini."
          />
        )}
        {courseId && assignments.data?.map((assignment) => {
          const overdue =
            !assignment.submission &&
            new Date(assignment.due_at).getTime() <= now;
          const status = assignment.submission
            ? submissionLabel[assignment.submission.status]
            : overdue
              ? "Terlambat"
              : "Belum dikumpulkan";
          const tone = assignment.submission
            ? assignment.submission.status === "graded"
              ? "success"
              : "warning"
            : overdue
              ? "danger"
              : "warning";
          return (
          <article className="panel panel-interactive" key={assignment.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <StatusBadge tone={tone}>{status}</StatusBadge>
                <h2 className="mt-3 text-lg font-semibold">
                  {assignment.title}
                </h2>
              </div>
              <span className="text-sm font-semibold">
                {assignment.max_score} poin
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
              {assignment.instructions}
            </p>
            <p className="mt-3 text-xs text-muted">
              Deadline {new Date(assignment.due_at).toLocaleString("id-ID")}
            </p>
            {assignment.submission ? (
              <div className="mt-5 border-t border-border pt-4 text-sm">
                <p>
                  <strong>Jawaban:</strong> {assignment.submission.content}
                </p>
                {assignment.submission.score !== null && (
                  <p className="mt-2">
                    <strong>Nilai:</strong> {assignment.submission.score} /{" "}
                    {assignment.max_score}
                  </p>
                )}
                {assignment.submission.feedback && (
                  <p className="mt-2">
                    <strong>Feedback:</strong> {assignment.submission.feedback}
                  </p>
                )}
              </div>
            ) : activeId === assignment.id ? (
              <form
                className="mt-5 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit.mutate(
                    {
                      id: assignment.id,
                      input: { content, attachment_url: attachmentUrl },
                    },
                    {
                      onSuccess: () => {
                        setActiveId("");
                        setContent("");
                        setAttachmentUrl("");
                      },
                    },
                  );
                }}
              >
                <label className="field-label">
                  Jawaban
                  <textarea
                    className="field-input min-h-32"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Tulis jawaban Anda berdasarkan instruksi tugas…"
                    required
                  />
                </label>
                <label className="field-label">
                  Tautan lampiran (opsional)
                  <input
                    className="field-input"
                    type="url"
                    value={attachmentUrl}
                    onChange={(event) => setAttachmentUrl(event.target.value)}
                    placeholder="https://drive.google.com/..."
                  />
                </label>
                <button className="button-primary" disabled={submit.isPending}>
                  Kumpulkan tugas
                </button>
                <AsyncFeedback
                  error={submit.error}
                  isError={submit.isError}
                  isSuccess={false}
                  errorMessage="Tugas belum dapat dikumpulkan. Periksa jawaban dan coba lagi."
                  successMessage=""
                />
              </form>
            ) : (
              <button
                className="button-primary mt-5"
                onClick={() => setActiveId(assignment.id)}
                disabled={overdue}
              >
                {overdue ? "Deadline terlewati" : "Tulis jawaban"}
              </button>
            )}
          </article>
          );
        })}
      </div>
    </RoleBoundary>
  );
}
