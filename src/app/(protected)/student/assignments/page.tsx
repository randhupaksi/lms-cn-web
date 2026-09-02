"use client";

import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useCourses } from "@/features/academics/use-academics";
import {
  useAssignments,
  useSubmitAssignment,
} from "@/features/assignments/use-assignments";
import { PageHeader } from "@/components/ui/page-header";
import { ClipboardList } from "lucide-react";

export default function StudentAssignmentsPage() {
  const [renderedAt] = useState(() => Date.now());
  const courses = useCourses();
  const [courseId, setCourseId] = useState("");
  const [activeId, setActiveId] = useState("");
  const [content, setContent] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const assignments = useAssignments(courseId);
  const submit = useSubmitAssignment(courseId);
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
          <select
            className="field-input"
            value={courseId}
            onChange={(event) => {
              setCourseId(event.target.value);
              setActiveId("");
            }}
          >
            <option value="">Pilih course</option>
            {courses.data?.data.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        {assignments.isLoading && <LoadingState />}
        {assignments.isError && (
          <ErrorState label="Tugas belum dapat dimuat." />
        )}
        {assignments.data?.length === 0 && (
          <EmptyState
            title="Belum ada tugas"
            description="Guru belum mempublikasikan tugas pada course ini."
          />
        )}
        {assignments.data?.map((assignment) => (
          <article className="panel panel-interactive" key={assignment.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span
                  className={`status-badge ${assignment.submission ? "status-active" : ""}`}
                >
                  {assignment.submission?.status ?? "Belum dikumpulkan"}
                </span>
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
                  />
                </label>
                <button className="button-primary" disabled={submit.isPending}>
                  Kumpulkan tugas
                </button>
              </form>
            ) : (
              <button
                className="button-primary mt-5"
                onClick={() => setActiveId(assignment.id)}
                disabled={new Date(assignment.due_at).getTime() <= renderedAt}
              >
                Tulis jawaban
              </button>
            )}
          </article>
        ))}
      </div>
    </RoleBoundary>
  );
}
