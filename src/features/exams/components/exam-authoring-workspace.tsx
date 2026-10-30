"use client";
import { ActionButton, ActionLink } from "@/components/ui/action-button";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics";
import {
  useCreateExam,
  useExamAction,
  useExams,
} from "@/features/exams/use-exams";
import { publishExam, unpublishExam } from "@/services/exams.service";
import { PageHeader } from "@/components/ui/page-header";
import { GraduationCap, Plus, Settings2, Send, Undo2 } from "lucide-react";
import { RadixSelectField } from "@/components/ui/radix-select";
import { DateTimePickerField } from "@/components/ui/date-picker";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EditorPanel } from "@/components/ui/editor-panel";
import { FilterBar } from "@/components/ui/filter-bar";
const PAGE_SIZE = 20;
const emptyForm = {
  title: "",
  description: "",
  starts_at: "",
  ends_at: "",
  duration_minutes: 90,
  allow_back_navigation: true,
  randomize_questions: false,
  randomize_options: false,
};

export function ExamAuthoringWorkspace() {
  const [editorOpen, setEditorOpen] = useState(false);
  const courses = useAllCourses();
  const [courseFilter, setCourseFilter] = useState("all");
  const [targetCourseId, setTargetCourseId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const selectedCourse = courseFilter === "all" ? undefined : courseFilter;
  const filterStatus = status === "all" ? undefined : status;
  const exams = useExams(selectedCourse, {
    search,
    status: filterStatus,
    page,
    per_page: PAGE_SIZE,
  });
  const create = useCreateExam();
  const publish = useExamAction(publishExam);
  const unpublish = useExamAction(unpublishExam);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!targetCourseId) return;
    create.mutate(
      {
        ...form,
        course_id: targetCourseId,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
      },
      {
        onSuccess: () => {
          setForm(emptyForm);
          setEditorOpen(false);
        },
      },
    );
  }
  const scheduleInvalid =
    Boolean(form.starts_at && form.ends_at) &&
    new Date(form.ends_at).getTime() <= new Date(form.starts_at).getTime();
  const courseOptions =
    courses.data?.map((item) => ({ value: item.id, label: item.name })) ?? [];
  return (
    <RoleBoundary allow={["teacher", "curriculum"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Evaluasi · Ujian"
          title="Ujian"
          description="Siapkan jadwal dan durasi dalam status draft. Soal dan peserta harus ditetapkan sebelum ujian dipublikasikan."
          icon={GraduationCap}
          actions={
            <Button
              id="exam-editor-trigger"
              aria-expanded={editorOpen}
              aria-controls={editorOpen ? "exam-editor" : undefined}
              disabled={editorOpen}
              onClick={() => {
                create.reset();
                setEditorOpen(true);
              }}
            >
              <Plus size={17} aria-hidden="true" /> Buat ujian
            </Button>
          }
        />
        {editorOpen ? (
          <EditorPanel
            id="exam-editor"
            title={"Buat ujian baru"}
            description="Tentukan identitas dan jadwal ujian. Tambahkan soal serta peserta setelah draft tersimpan."
            onClose={() => setEditorOpen(false)}
          >
            <form className="form-grid" onSubmit={submit}>
              <label className="field-label md:col-span-2">
                Course
                <RadixSelectField
                  value={targetCourseId}
                  onValueChange={setTargetCourseId}
                  placeholder="Pilih course untuk ujian"
                  options={courseOptions}
                />
              </label>
              <label className="field-label md:col-span-2">
                Judul
                <input
                  className="field-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Ujian Akhir Semester Matematika"
                  required
                />
              </label>
              <label className="field-label md:col-span-2">
                Deskripsi
                <textarea
                  className="field-input min-h-24"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Jelaskan cakupan materi dan instruksi ujian…"
                />
              </label>
              <label className="field-label">
                Mulai
                <DateTimePickerField
                  value={form.starts_at}
                  onChange={(value) => setForm({ ...form, starts_at: value })}
                  required
                />
              </label>
              <label className="field-label">
                Selesai
                <DateTimePickerField
                  value={form.ends_at}
                  onChange={(value) => setForm({ ...form, ends_at: value })}
                  required
                />
              </label>
              <label className="field-label">
                Durasi (menit)
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  value={form.duration_minutes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration_minutes: Number(e.target.value),
                    })
                  }
                  required
                />
              </label>
              <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.allow_back_navigation}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      allow_back_navigation: e.target.checked,
                    })
                  }
                />{" "}
                Izinkan kembali ke soal sebelumnya
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.randomize_questions}
                  onChange={(e) =>
                    setForm({ ...form, randomize_questions: e.target.checked })
                  }
                />{" "}
                Acak urutan soal per attempt
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.randomize_options}
                  onChange={(e) =>
                    setForm({ ...form, randomize_options: e.target.checked })
                  }
                />{" "}
                Acak opsi jawaban per attempt
              </label>
              <Button
                type="submit"
                className="md:col-span-2"
                disabled={
                  create.isPending ||
                  !targetCourseId ||
                  !form.starts_at ||
                  !form.ends_at ||
                  scheduleInvalid
                }
              >
                {create.isPending ? "Menyimpan…" : "Simpan draft"}
              </Button>
              {scheduleInvalid ? (
                <p className="form-error md:col-span-2" role="alert">
                  Waktu selesai harus setelah waktu mulai.
                </p>
              ) : null}
            </form>
          </EditorPanel>
        ) : null}
        <AsyncFeedback
          error={create.error}
          isError={create.isError}
          isSuccess={create.isSuccess}
          errorMessage="Draft ujian belum dapat disimpan."
          successMessage="Draft ujian berhasil disimpan. Lanjutkan dengan menetapkan soal dan peserta."
        />

        <section className="space-y-4">
          <FilterBar>
            <label className="field-label">
              Cari ujian
              <input
                className="field-input"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Judul ujian"
              />
            </label>
            <label className="field-label">
              Course
              <RadixSelectField
                value={courseFilter}
                onValueChange={(value) => {
                  setCourseFilter(value);
                  setPage(1);
                }}
                placeholder="Semua course"
                options={[
                  { value: "all", label: "Semua course" },
                  ...courseOptions,
                ]}
              />
            </label>
            <label className="field-label">
              Status
              <RadixSelectField
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
                placeholder="Semua status"
                options={[
                  { value: "all", label: "Semua status" },
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Dipublikasikan" },
                ]}
              />
            </label>
          </FilterBar>
          <h2 className="section-title">
            Daftar ujian ({exams.data?.meta.total ?? "—"})
          </h2>
          {courses.isError ? (
            <ErrorState
              label="Course belum dapat dimuat."
              onRetry={() => void courses.refetch()}
            />
          ) : null}
          {exams.isLoading ? <LoadingState label="Memuat ujian…" /> : null}
          {exams.isError ? (
            <ErrorState
              label="Ujian belum dapat dimuat."
              onRetry={() => void exams.refetch()}
            />
          ) : null}
          {!exams.isLoading &&
          !exams.isError &&
          exams.data?.data.length === 0 ? (
            <EmptyState
              title="Belum ada ujian"
              description="Belum ada ujian yang sesuai dengan filter ini."
            />
          ) : null}
          {exams.data?.data.length ? (
            <DataTableShell>
              <DataTable>
                <caption className="sr-only">
                  Daftar ujian, jadwal, kelengkapan, dan tindakan publikasi
                </caption>
                <thead>
                  <tr>
                    <th>Ujian & course</th>
                    <th>Jadwal</th>
                    <th>Kelengkapan</th>
                    <th>Status</th>
                    <th className="action-column">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.data.data.map((exam) => (
                    <tr key={exam.id}>
                      <td className="cell-wrap">
                        <Link
                          href={`/teacher/exams/${exam.id}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {exam.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {exam.course_name ??
                            courses.data?.find(
                              (item) => item.id === exam.course_id,
                            )?.name}
                        </p>
                      </td>
                      <td>
                        <p>
                          {new Date(exam.starts_at).toLocaleString("id-ID")}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {exam.duration_minutes} menit · hingga{" "}
                          {new Date(exam.ends_at).toLocaleString("id-ID")}
                        </p>
                      </td>
                      <td>
                        <p>
                          {exam.question_count} soal · {exam.participant_count}{" "}
                          peserta
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {exam.total_points} poin
                        </p>
                      </td>
                      <td>
                        <StatusBadge
                          tone={
                            exam.status === "published" ? "success" : "neutral"
                          }
                        >
                          {exam.status === "published"
                            ? "Dipublikasikan"
                            : "Draft"}
                        </StatusBadge>
                      </td>
                      <td>
                        <div className="record-actions">
                          <ActionLink
                            icon={Settings2}
                            label={`Atur ${exam.title}`}
                            href={`/teacher/exams/${exam.id}`}
                          />
                          {exam.status === "draft" ? (
                            <ActionButton
                              icon={Send}
                              label={`Publikasikan ${exam.title}`}
                              pending={publish.isPending}
                              disabled={publish.isPending}
                              onClick={() => publish.mutate(exam.id)}
                            />
                          ) : (
                            <ActionButton
                              icon={Undo2}
                              label={`Batalkan publikasi ${exam.title}`}
                              pending={unpublish.isPending}
                              disabled={unpublish.isPending}
                              onClick={() => unpublish.mutate(exam.id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
              <Pagination
                page={page}
                totalPages={exams.data.meta.total_pages}
                onPageChange={setPage}
              />
            </DataTableShell>
          ) : null}
          <AsyncFeedback
            error={publish.error}
            isError={publish.isError}
            isSuccess={publish.isSuccess}
            errorMessage="Ujian belum dapat dipublikasikan. Pastikan soal dan peserta sudah lengkap."
            successMessage="Ujian berhasil dipublikasikan."
          />
          <AsyncFeedback
            error={unpublish.error}
            isError={unpublish.isError}
            isSuccess={unpublish.isSuccess}
            errorMessage="Publikasi ujian belum dapat dibatalkan."
            successMessage="Publikasi ujian berhasil dibatalkan."
          />
        </section>
      </div>
    </RoleBoundary>
  );
}
