"use client";

import { useState, type FormEvent } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAcademicData } from "@/features/academics/use-academics";
import {
  useAssignments,
  useGradeSubmission,
  usePublishAssignment,
  useSaveAssignment,
  useSubmissions,
} from "@/features/assignments/use-assignments";
import type { AssignmentSubmission } from "@/types/lms";
import { PageHeader } from "@/components/ui/page-header";
import { ClipboardList } from "lucide-react";
import { DataTable, DataTableShell } from "@/components/ui/data-table";

const emptyForm = { title: "", instructions: "", due_at: "", max_score: 100 };

export default function TeacherAssignmentsPage() {
  const academics = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const assignments = useAssignments(courseId);
  const save = useSaveAssignment(courseId);
  const publish = usePublishAssignment(courseId);
  const submissions = useSubmissions(assignmentId);
  const grade = useGradeSubmission(assignmentId);

  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate(
      {
        input: {
          ...form,
          course_id: courseId,
          due_at: new Date(form.due_at).toISOString(),
        },
      },
      { onSuccess: () => setForm(emptyForm) },
    );
  }

  const selectedAssignment = assignments.data?.find(
    (item) => item.id === assignmentId,
  );

  return (
    <RoleBoundary allow={["teacher"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Course assessment"
          title="Tugas"
          description="Kelola tugas non-ujian, pengumpulan siswa, feedback, dan nilai dalam scope course."
          icon={ClipboardList}
        />
        <label className="field-label max-w-lg">
          Course
          <select
            className="field-input"
            value={courseId}
            onChange={(event) => {
              setCourseId(event.target.value);
              setAssignmentId("");
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
        {courseId && (
          <>
            <section className="panel">
              <h2 className="section-title">Buat tugas</h2>
              <form className="form-grid" onSubmit={submit}>
                <label className="field-label md:col-span-2">
                  Judul
                  <input
                    className="field-input"
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    required
                  />
                </label>
                <label className="field-label md:col-span-2">
                  Instruksi
                  <textarea
                    className="field-input min-h-32"
                    value={form.instructions}
                    onChange={(event) =>
                      setForm({ ...form, instructions: event.target.value })
                    }
                    required
                  />
                </label>
                <label className="field-label">
                  Batas pengumpulan
                  <input
                    className="field-input"
                    type="datetime-local"
                    value={form.due_at}
                    onChange={(event) =>
                      setForm({ ...form, due_at: event.target.value })
                    }
                    required
                  />
                </label>
                <label className="field-label">
                  Skor maksimal
                  <input
                    className="field-input"
                    type="number"
                    min={1}
                    value={form.max_score}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        max_score: Number(event.target.value),
                      })
                    }
                    required
                  />
                </label>
                <button
                  className="button-primary md:col-span-2"
                  disabled={save.isPending}
                >
                  {save.isPending ? "Menyimpan…" : "Simpan draft"}
                </button>
              </form>
            </section>
            {assignments.isLoading && <LoadingState />}
            {assignments.isError && (
              <ErrorState label="Tugas belum dapat dimuat." />
            )}
            {assignments.data?.length === 0 && (
              <EmptyState
                title="Belum ada tugas"
                description="Buat tugas pertama untuk course ini."
              />
            )}
            <section className="grid gap-4 md:grid-cols-2">
              {assignments.data?.map((assignment) => (
                <article className="panel panel-interactive" key={assignment.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`status-badge ${assignment.status === "published" ? "status-active" : ""}`}
                      >
                        {assignment.status}
                      </span>
                      <h2 className="mt-3 text-lg font-semibold">
                        {assignment.title}
                      </h2>
                    </div>
                    <span className="text-sm font-semibold">
                      {assignment.max_score} poin
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Deadline{" "}
                    {new Date(assignment.due_at).toLocaleString("id-ID")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {assignment.status === "draft" && (
                      <button
                        className="button-primary"
                        onClick={() => publish.mutate(assignment.id)}
                      >
                        Publikasikan
                      </button>
                    )}
                    <button
                      className="button-ghost"
                      onClick={() => setAssignmentId(assignment.id)}
                    >
                      Lihat pengumpulan
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
        {assignmentId && (
          <DataTableShell>
            <div className="border-b border-border p-5">
              <h2 className="section-title">Pengumpulan siswa</h2>
            </div>
            {submissions.isLoading && (
              <div className="p-5">
                <LoadingState />
              </div>
            )}
            {submissions.data?.length === 0 && (
              <div className="p-5">
                <EmptyState
                  title="Belum ada pengumpulan"
                  description="Siswa belum mengumpulkan tugas ini."
                />
              </div>
            )}
            <div className="overflow-x-auto">
              <DataTable>
                <thead>
                  <tr>
                    <th>Siswa</th>
                    <th>Jawaban</th>
                    <th>Nilai</th>
                    <th>Feedback</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.data?.map((submission) => (
                    <SubmissionRow
                      key={submission.id}
                      submission={submission}
                      maxScore={selectedAssignment?.max_score ?? 100}
                      onGrade={(score, feedback) =>
                        grade.mutate({
                          id: submission.id,
                          input: { score, feedback },
                        })
                      }
                    />
                  ))}
                </tbody>
              </DataTable>
            </div>
          </DataTableShell>
        )}
      </div>
    </RoleBoundary>
  );
}

function SubmissionRow({
  submission,
  maxScore,
  onGrade,
}: {
  submission: AssignmentSubmission;
  maxScore: number;
  onGrade: (score: number, feedback: string) => void;
}) {
  const [score, setScore] = useState(submission.score ?? 0);
  const [feedback, setFeedback] = useState(submission.feedback);
  return (
    <tr>
      <td className="font-semibold">{submission.student_name}</td>
      <td className="max-w-sm whitespace-normal">{submission.content}</td>
      <td>
        <input
          aria-label="Nilai"
          className="field-input w-24"
          type="number"
          min={0}
          max={maxScore}
          value={score}
          onChange={(event) => setScore(Number(event.target.value))}
        />
      </td>
      <td>
        <input
          aria-label="Feedback"
          className="field-input min-w-56"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
      </td>
      <td>
        <button
          className="button-primary"
          onClick={() => onGrade(score, feedback)}
        >
          Simpan nilai
        </button>
      </td>
    </tr>
  );
}
