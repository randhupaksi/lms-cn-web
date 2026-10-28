"use client";
import { ActionButton } from "@/components/ui/action-button";

import { useState, type FormEvent } from "react";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics";
import {
  useArchiveQuestion,
  useQuestions,
  useSaveQuestion,
} from "@/features/questions/use-questions";
import type { Question } from "@/types/lms";
import { PageHeader } from "@/components/ui/page-header";
import { BookOpenCheck, Plus, Pencil, Archive } from "lucide-react";
import { RadixSelectField } from "@/components/ui/radix-select";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

import { EditorPanel } from "@/components/ui/editor-panel";
import { FilterBar } from "@/components/ui/filter-bar";

const emptyOptions = () =>
  Array.from({ length: 4 }, (_, index) => ({
    content: "",
    is_correct: index === 0,
  }));
const PAGE_SIZE = 20;

export function QuestionBankWorkspace() {
  const courses = useAllCourses();
  const [editorOpen, setEditorOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");
  const [targetCourseId, setTargetCourseId] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(1);
  const selectedCourse = courseFilter === "all" ? undefined : courseFilter;
  const questions = useQuestions(selectedCourse, {
    search,
    category: filterCategory,
    status: "active",
    page,
    per_page: PAGE_SIZE,
  });
  const save = useSaveQuestion();
  const archive = useArchiveQuestion();
  const [editingId, setEditingId] = useState<string>();
  const [stem, setStem] = useState("");
  const [points, setPoints] = useState(1);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [options, setOptions] = useState(emptyOptions);

  function reset() {
    setEditingId(undefined);
    setStem("");
    setPoints(1);
    setCategory("");
    setTags("");
    setOptions(emptyOptions());
    setEditorOpen(false);
  }
  function edit(question: Question) {
    setEditorOpen(true);
    save.reset();
    setEditingId(question.id);
    setTargetCourseId(question.course_id);
    setStem(question.stem);
    setPoints(question.default_points);
    setCategory(question.category);
    setTags(question.tags.join(", "));
    setOptions(
      question.options.map((item) => ({
        content: item.content,
        is_correct: item.is_correct,
      })),
    );
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!targetCourseId) return;
    save.mutate(
      {
        id: editingId,
        input: {
          course_id: targetCourseId,
          type: "single_choice",
          stem,
          default_points: points,
          category,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          options,
        },
      },
      { onSuccess: reset },
    );
  }

  const courseOptions =
    courses.data?.map((course) => ({ value: course.id, label: course.name })) ??
    [];
  return (
    <RoleBoundary allow={["teacher"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Pembelajaran · Bank soal"
          title="Bank soal"
          description="Bangun koleksi pertanyaan, kelompokkan per mata pelajaran, dan gunakan kembali dalam ujian."
          icon={BookOpenCheck}
          actions={
            <Button
              id="question-editor-trigger"
              aria-expanded={editorOpen}
              aria-controls={editorOpen ? "question-editor" : undefined}
              disabled={editorOpen}
              onClick={() => {
                if (editingId) reset();
                save.reset();
                setEditorOpen(true);
              }}
            >
              <Plus size={17} aria-hidden="true" /> Buat soal
            </Button>
          }
        />
        <div className="space-y-6">
          {editorOpen ? (
            <EditorPanel
              focusKey={editingId ?? "new"}
              id="question-editor"
              title={editingId ? "Perbarui soal" : "Buat soal baru"}
              description="Tulis pertanyaan dan pilih tepat satu jawaban benar. Soal yang sudah digunakan tidak mengubah isi ujian sebelumnya."
              onClose={() => setEditorOpen(false)}
            >
              <form className="mt-5 space-y-4" onSubmit={submit}>
                <label className="field-label">
                  Course untuk soal
                  <RadixSelectField
                    value={targetCourseId}
                    onValueChange={setTargetCourseId}
                    placeholder="Pilih course"
                    options={courseOptions}
                  />
                </label>
                <label className="field-label">
                  Pertanyaan
                  <textarea
                    className="field-input min-h-32 resize-y"
                    value={stem}
                    onChange={(e) => setStem(e.target.value)}
                    placeholder="Tulis pertanyaan yang ingin diberikan kepada siswa…"
                    required
                  />
                </label>
                <label className="field-label max-w-40">
                  Poin
                  <input
                    className="field-input"
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field-label">
                    Kategori
                    <input
                      className="field-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Contoh: Aljabar"
                    />
                  </label>
                  <label className="field-label">
                    Tag
                    <input
                      className="field-input"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="bab-1, dasar"
                    />
                  </label>
                </div>
                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold">
                    Pilihan jawaban
                  </legend>
                  {options.map((option, index) => (
                    <div className="flex items-center gap-3" key={index}>
                      <input
                        type="radio"
                        name="correct"
                        checked={option.is_correct}
                        onChange={() =>
                          setOptions(
                            options.map((item, itemIndex) => ({
                              ...item,
                              is_correct: itemIndex === index,
                            })),
                          )
                        }
                        aria-label={
                          "Jadikan pilihan " +
                          (index + 1) +
                          " sebagai jawaban benar"
                        }
                      />
                      <input
                        className="field-input"
                        value={option.content}
                        onChange={(e) =>
                          setOptions(
                            options.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, content: e.target.value }
                                : item,
                            ),
                          )
                        }
                        aria-label={"Isi pilihan " + (index + 1)}
                        placeholder={"Pilihan " + (index + 1)}
                        required
                      />
                    </div>
                  ))}
                </fieldset>
                <Button
                  type="submit"
                  disabled={save.isPending || !targetCourseId}
                >
                  {save.isPending
                    ? "Menyimpan…"
                    : editingId
                      ? "Simpan perubahan"
                      : "Tambah soal"}
                </Button>
              </form>
            </EditorPanel>
          ) : null}
          <AsyncFeedback
            error={save.error}
            isError={save.isError}
            isSuccess={save.isSuccess}
            errorMessage="Soal belum dapat disimpan. Pastikan tepat satu jawaban benar."
            successMessage="Soal berhasil disimpan di bank soal."
          />

          <section className="space-y-4">
            <h2 className="section-title">
              Daftar soal ({questions.data?.meta.total ?? "—"})
            </h2>
            <FilterBar>
              <label className="field-label">
                Cari soal
                <input
                  className="field-input"
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari isi pertanyaan"
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
                Filter kategori
                <input
                  className="field-input"
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Semua kategori"
                />
              </label>
            </FilterBar>
            {courses.isError ? (
              <ErrorState
                label="Daftar course belum dapat dimuat."
                onRetry={() => void courses.refetch()}
              />
            ) : null}
            {questions.isLoading ? (
              <LoadingState label="Memuat bank soal…" />
            ) : null}
            {questions.isError ? (
              <ErrorState
                label="Bank soal belum dapat dimuat."
                onRetry={() => void questions.refetch()}
              />
            ) : null}
            <div className="record-list">
              {questions.data?.data.map((question, index) => (
                <article className="record-row" key={question.id}>
                  <p className="text-xs font-bold text-muted">
                    SOAL {(page - 1) * PAGE_SIZE + index + 1} ·{" "}
                    {question.default_points} POIN ·{" "}
                    {courses.data?.find(
                      (course) => course.id === question.course_id,
                    )?.name ?? "Course"}
                  </p>
                  {question.category || question.tags.length > 0 ? (
                    <p className="mt-2 text-xs text-muted">
                      {[question.category, ...question.tags]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  ) : null}
                  <p className="mt-2 font-semibold leading-6">
                    {question.stem}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <ActionButton
                      icon={Pencil}
                      label="Edit soal"
                      onClick={() => edit(question)}
                    />
                    <ActionButton
                      icon={Archive}
                      label="Arsipkan soal"
                      tone="danger"
                      pending={archive.isPending}
                      onClick={() => archive.mutate(question.id)}
                    />
                  </div>
                </article>
              ))}
            </div>
            {!questions.isLoading &&
            !questions.isError &&
            questions.data?.data.length === 0 ? (
              <EmptyState
                title="Belum ada soal"
                description={
                  search || filterCategory || selectedCourse
                    ? "Coba ubah kata pencarian, kategori, atau course yang dipilih."
                    : "Mulai dengan membuat soal pertama untuk mata pelajaran Anda."
                }
                action={
                  <Button
                    variant="secondary"
                    onClick={() => setEditorOpen(true)}
                  >
                    Buat soal
                  </Button>
                }
              />
            ) : null}
            {questions.data ? (
              <Pagination
                page={page}
                totalPages={questions.data.meta.total_pages}
                onPageChange={setPage}
              />
            ) : null}
            <AsyncFeedback
              error={archive.error}
              isError={archive.isError}
              isSuccess={archive.isSuccess}
              errorMessage="Soal belum dapat diarsipkan."
              successMessage="Soal berhasil diarsipkan."
            />
          </section>
        </div>
      </div>
    </RoleBoundary>
  );
}
