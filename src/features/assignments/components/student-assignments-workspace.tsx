"use client";
import { FilterBar } from "@/components/ui/filter-bar";
import { useEffect, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics";
import {
  useAssignments,
  useSubmitAssignment,
} from "@/features/assignments/use-assignments";
import { PageHeader } from "@/components/ui/page-header";
import { ClipboardList } from "lucide-react";
import { RadixSelectField } from "@/components/ui/radix-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
const PAGE_SIZE = 20;
const submissionLabel = {
  submitted: "Menunggu penilaian",
  graded: "Sudah dinilai",
  returned: "Dikembalikan",
} as const;
export function StudentAssignmentsWorkspace() {
  const [now, setNow] = useState(() => Date.now());
  const courses = useAllCourses();
  const [courseFilter, setCourseFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState("");
  const [drafts, setDrafts] = useState<
    Record<string, { content: string; attachment_url: string }>
  >({});
  const draft = drafts[activeId] ?? { content: "", attachment_url: "" };
  const assignments = useAssignments(
    courseFilter === "all" ? undefined : courseFilter,
    { search, page, per_page: PAGE_SIZE },
  );
  const submit = useSubmitAssignment();
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const courseOptions =
    courses.data?.map((item) => ({ value: item.id, label: item.name })) ?? [];
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Pembelajaran · Tugas"
          title="Tugas"
          description="Lihat instruksi, deadline, status pengumpulan, feedback, dan nilai tugas."
          icon={ClipboardList}
        />
        <FilterBar>
          <label className="field-label">
            Cari tugas
            <input
              className="field-input"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setActiveId("");
              }}
              placeholder="Judul atau instruksi"
            />
          </label>
          <label className="field-label">
            Course
            <RadixSelectField
              value={courseFilter}
              onValueChange={(v) => {
                setCourseFilter(v);
                setPage(1);
                setActiveId("");
              }}
              placeholder="Semua course"
              options={[
                { value: "all", label: "Semua course" },
                ...courseOptions,
              ]}
            />
          </label>
        </FilterBar>
        {assignments.isLoading ? <LoadingState label="Memuat tugas…" /> : null}
        {assignments.isError ? (
          <ErrorState
            label="Tugas belum dapat dimuat."
            onRetry={() => void assignments.refetch()}
          />
        ) : null}
        {!assignments.isLoading &&
        !assignments.isError &&
        assignments.data?.data.length === 0 ? (
          <EmptyState
            title="Belum ada tugas"
            description="Belum ada tugas yang sesuai dengan filter ini."
          />
        ) : null}
        {assignments.data?.data.map((assignment) => {
          const overdue =
            !assignment.submission &&
            new Date(assignment.due_at).getTime() <= now;
          const label = assignment.submission
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
            <article className="assignment-card" key={assignment.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <StatusBadge tone={tone}>{label}</StatusBadge>
                  <h2 className="mt-3 text-lg font-semibold">
                    {assignment.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    {assignment.course_name ??
                      courses.data?.find((c) => c.id === assignment.course_id)
                        ?.name}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {assignment.max_score} poin
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
                {assignment.instructions}
              </p>
              <p className="mt-3 text-xs text-muted">
                Batas pengumpulan{" "}
                {new Date(assignment.due_at).toLocaleString("id-ID")}
              </p>
              {assignment.submission ? (
                <div className="mt-5 border-t border-border pt-4 text-sm">
                  <p>
                    <strong>Jawaban:</strong> {assignment.submission.content}
                  </p>
                  {assignment.submission.score !== null ? (
                    <p className="mt-2">
                      <strong>Nilai:</strong> {assignment.submission.score} /{" "}
                      {assignment.max_score}
                    </p>
                  ) : null}
                  {assignment.submission.feedback ? (
                    <p className="mt-2">
                      <strong>Feedback:</strong>{" "}
                      {assignment.submission.feedback}
                    </p>
                  ) : null}
                </div>
              ) : activeId === assignment.id ? (
                <form
                  className="mt-5 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit.mutate(
                      { id: assignment.id, input: draft },
                      {
                        onSuccess: () => {
                          setActiveId("");
                          setDrafts((previous) => {
                            const next = { ...previous };
                            delete next[assignment.id];
                            return next;
                          });
                        },
                      },
                    );
                  }}
                >
                  <label className="field-label">
                    Jawaban
                    <textarea
                      className="field-input min-h-32"
                      value={draft.content}
                      onChange={(e) =>
                        setDrafts({
                          ...drafts,
                          [activeId]: { ...draft, content: e.target.value },
                        })
                      }
                      placeholder="Tulis jawaban Anda berdasarkan instruksi tugas…"
                      required
                    />
                  </label>
                  <label className="field-label">
                    Tautan lampiran (opsional)
                    <input
                      className="field-input"
                      type="url"
                      value={draft.attachment_url}
                      onChange={(e) =>
                        setDrafts({
                          ...drafts,
                          [activeId]: {
                            ...draft,
                            attachment_url: e.target.value,
                          },
                        })
                      }
                      placeholder="https://drive.google.com/..."
                    />
                  </label>
                  <div className="record-actions">
                    <Button type="submit" disabled={submit.isPending}>
                      {submit.isPending ? "Mengumpulkan…" : "Kumpulkan tugas"}
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={submit.isPending}
                      onClick={() => setActiveId("")}
                    >
                      Tutup jawaban
                    </Button>
                  </div>
                  <p className="text-xs leading-5 text-muted">
                    Draft tetap tersedia selama Anda berada di halaman ini. Muat
                    ulang halaman akan menghapus draft yang belum dikumpulkan.
                  </p>
                  <AsyncFeedback
                    error={submit.error}
                    isError={submit.isError}
                    isSuccess={false}
                    errorMessage="Tugas belum dapat dikumpulkan. Periksa jawaban dan coba lagi."
                    successMessage=""
                  />
                </form>
              ) : (
                <Button
                  className="mt-5"
                  onClick={() => setActiveId(assignment.id)}
                  disabled={overdue}
                >
                  {overdue ? "Deadline terlewati" : "Tulis jawaban"}
                </Button>
              )}
            </article>
          );
        })}
        {assignments.data ? (
          <Pagination
            page={page}
            totalPages={assignments.data.meta.total_pages}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </RoleBoundary>
  );
}
