"use client";
import { ActionButton } from "@/components/ui/action-button";
import { useState, type FormEvent } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics";
import {
  useMaterials,
  useDeleteMaterialAttachment,
  usePublishMaterial,
  useSaveMaterial,
  useUploadMaterialAttachment,
} from "@/features/materials/use-materials";
import type { CourseMaterial, MaterialAttachment } from "@/types/lms";
import { PageHeader } from "@/components/ui/page-header";
import { BookOpenText, Plus, Pencil, Send } from "lucide-react";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { FormDialog } from "@/components/ui/form-dialog";
import { FilterBar } from "@/components/ui/filter-bar";
import { MaterialAttachments } from "@/features/materials/components/material-attachments";
const PAGE_SIZE = 20;
const MAX_ATTACHMENT_COUNT = 5;
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const MAX_ATTACHMENT_TOTAL_BYTES = 20 * 1024 * 1024;
const emptyForm = { title: "", description: "", content: "", position: 1 };
export function TeacherMaterialsWorkspace() {
  const [editorOpen, setEditorOpen] = useState(false);
  const courses = useAllCourses();
  const [courseFilter, setCourseFilter] = useState("all");
  const [targetCourseId, setTargetCourseId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string>();
  const [form, setForm] = useState(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<MaterialAttachment[]>([]);
  const [attachmentSelectionError, setAttachmentSelectionError] = useState("");
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);
  const materials = useMaterials(
    courseFilter === "all" ? undefined : courseFilter,
    {
      search,
      status: status === "all" ? undefined : status,
      page,
      per_page: PAGE_SIZE,
    },
  );
  const save = useSaveMaterial();
  const publish = usePublishMaterial();
  const uploadAttachment = useUploadMaterialAttachment();
  const deleteAttachment = useDeleteMaterialAttachment();
  function edit(item: CourseMaterial) {
    setEditorOpen(true);
    save.reset();
    uploadAttachment.reset();
    setEditingId(item.id);
    setTargetCourseId(item.course_id);
    setAttachments(item.attachments ?? []);
    setSelectedFiles([]);
    setAttachmentSelectionError("");
    setForm({
      title: item.title,
      description: item.description,
      content: item.content,
      position: item.position,
    });
  }
  function reset() {
    setEditingId(undefined);
    setForm(emptyForm);
    setAttachments([]);
    setSelectedFiles([]);
    setAttachmentSelectionError("");
    uploadAttachment.reset();
    setEditorOpen(false);
  }
  function closeEditor() {
    if (save.isPending || isUploadingAttachments) return;
    reset();
  }
  function selectFiles(files: File[]) {
    setSelectedFiles(files);
    uploadAttachment.reset();
    if (files.length + attachments.length > MAX_ATTACHMENT_COUNT) {
      setAttachmentSelectionError("Satu materi maksimal memiliki 5 lampiran.");
      return;
    }
    if (files.some((file) => file.size > MAX_ATTACHMENT_BYTES)) {
      setAttachmentSelectionError("Ukuran setiap lampiran maksimal 8 MiB.");
      return;
    }
    const currentBytes = attachments.reduce((total, file) => total + file.size_bytes, 0);
    const selectedBytes = files.reduce((total, file) => total + file.size, 0);
    if (currentBytes + selectedBytes > MAX_ATTACHMENT_TOTAL_BYTES) {
      setAttachmentSelectionError("Total ukuran lampiran satu materi maksimal 20 MiB.");
      return;
    }
    setAttachmentSelectionError("");
  }
  function removeAttachment(materialId: string, attachmentId: string) {
    deleteAttachment.mutate(
      { materialId, attachmentId },
      {
        onSuccess: () => {
          if (materialId === editingId) {
            setAttachments((current) => current.filter((item) => item.id !== attachmentId));
          }
        },
      },
    );
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!targetCourseId || attachmentSelectionError) return;
    const pendingFiles = [...selectedFiles];
    save.mutate(
      { id: editingId, input: { ...form, course_id: targetCourseId } },
      {
        onSuccess: async (material) => {
          setEditingId(material.id);
          setTargetCourseId(material.course_id);
          setForm({
            title: material.title,
            description: material.description,
            content: material.content,
            position: material.position,
          });
          setAttachments(material.attachments ?? []);
          if (pendingFiles.length === 0) {
            reset();
            return;
          }

          setIsUploadingAttachments(true);
          let remainingFiles = pendingFiles;
          try {
            for (const file of pendingFiles) {
              const uploaded = await uploadAttachment.mutateAsync({
                materialId: material.id,
                file,
              });
              remainingFiles = remainingFiles.filter((candidate) => candidate !== file);
              setSelectedFiles(remainingFiles);
              setAttachments((current) =>
                current.some((item) => item.id === uploaded.id)
                  ? current
                  : [...current, uploaded],
              );
            }
            reset();
          } catch {
            // Keep the draft and remaining files in the dialog so the teacher can retry.
          } finally {
            setIsUploadingAttachments(false);
          }
        },
      },
    );
  }
  const courseOptions =
    courses.data?.map((item) => ({ value: item.id, label: item.name })) ?? [];
  return (
    <RoleBoundary allow={["teacher", "curriculum"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Pembelajaran · Materi"
          title="Materi pembelajaran"
          description="Susun materi sebagai draft, lalu publikasikan ketika kontennya siap dipelajari siswa."
          icon={BookOpenText}
          actions={
            <Button
              id="material-editor-trigger"
              aria-haspopup="dialog"
              aria-expanded={editorOpen}
              aria-controls={editorOpen ? "material-editor" : undefined}
              onClick={() => {
                if (editingId) reset();
                setEditorOpen(true);
              }}
            >
              <Plus size={17} aria-hidden="true" /> Buat materi
            </Button>
          }
        />
        {editorOpen ? (
          <FormDialog
            id="material-editor"
            title={editingId ? "Perbarui materi" : "Buat materi baru"}
            description="Susun isi materi dan tambahkan gambar atau dokumen. Draft serta lampirannya tersedia bagi siswa setelah dipublikasikan."
            onClose={closeEditor}
          >
            <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
              <label className="field-label md:col-span-2">
                Course untuk materi
                <RadixSelectField
                  value={targetCourseId}
                  onValueChange={setTargetCourseId}
                  placeholder="Pilih course"
                  options={courseOptions}
                />
              </label>
              <label className="field-label md:col-span-2">
                Judul
                <input
                  className="field-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Persamaan Kuadrat"
                  required
                />
              </label>
              <label className="field-label md:col-span-2">
                Ringkasan
                <textarea
                  className="field-input min-h-20"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Ringkasan singkat materi untuk siswa…"
                />
              </label>
              <label className="field-label md:col-span-2">
                Konten
                <textarea
                  className="field-input min-h-48"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="Tulis materi pembelajaran, contoh, dan penjelasan utama…"
                  required
                />
              </label>
              <label className="field-label md:col-span-2">
                Lampiran gambar atau dokumen
                <input
                  className="field-input file:mr-3 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:font-semibold file:text-primary"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.docx"
                  multiple
                  onChange={(event) => selectFiles(Array.from(event.currentTarget.files ?? []))}
                  disabled={save.isPending || isUploadingAttachments || attachments.length >= MAX_ATTACHMENT_COUNT}
                />
                <span className="mt-1 block text-xs font-normal leading-5 text-muted">
                  JPG, PNG, PDF, atau DOCX · maksimal 8 MiB per file · 5 file dan total 20 MiB per materi.
                </span>
              </label>
              {selectedFiles.length ? (
                <ul className="space-y-1 text-xs leading-5 text-muted md:col-span-2" aria-label="File yang akan diunggah">
                  {selectedFiles.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`} className="break-all">
                      {file.name} · {(file.size / (1024 * 1024)).toFixed(1)} MiB
                    </li>
                  ))}
                </ul>
              ) : null}
              {attachmentSelectionError ? (
                <p className="text-sm text-danger md:col-span-2" role="alert">
                  {attachmentSelectionError}
                </p>
              ) : null}
              <AsyncFeedback
                error={uploadAttachment.error}
                isError={uploadAttachment.isError}
                isSuccess={false}
                errorMessage="Sebagian lampiran belum dapat diunggah. Draft dan file yang belum terkirim tetap tersedia untuk dicoba kembali."
                successMessage=""
              />
              {attachments.length ? (
                <MaterialAttachments
                  materialId={editingId ?? "new-material"}
                  attachments={attachments}
                  onRemove={editingId ? (attachmentId) => removeAttachment(editingId, attachmentId) : undefined}
                  removingAttachmentId={deleteAttachment.isPending ? deleteAttachment.variables?.attachmentId : undefined}
                  className="md:col-span-2"
                />
              ) : null}
              <label className="field-label max-w-32">
                Urutan
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: Number(e.target.value) })
                  }
                />
              </label>
              <div className="self-end">
                <Button
                  type="submit"
                  disabled={save.isPending || isUploadingAttachments || !targetCourseId || Boolean(attachmentSelectionError)}
                >
                  {isUploadingAttachments
                    ? "Mengunggah lampiran…"
                    : save.isPending
                      ? "Menyimpan…"
                      : "Simpan draft"}
                </Button>
              </div>
            </form>
          </FormDialog>
        ) : null}
        <AsyncFeedback
          error={save.error}
          isError={save.isError}
          isSuccess={save.isSuccess}
          errorMessage="Materi belum dapat disimpan."
          successMessage="Draft materi berhasil disimpan."
        />
        <AsyncFeedback
          error={deleteAttachment.error}
          isError={deleteAttachment.isError}
          isSuccess={deleteAttachment.isSuccess}
          errorMessage="Lampiran belum dapat dihapus."
          successMessage="Lampiran berhasil dihapus."
        />

        <section className="space-y-4">
          <FilterBar>
            <label className="field-label">
              Cari materi
              <input
                className="field-input"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Judul atau deskripsi"
              />
            </label>
            <label className="field-label">
              Course
              <RadixSelectField
                value={courseFilter}
                onValueChange={(v) => {
                  setCourseFilter(v);
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
                onValueChange={(v) => {
                  setStatus(v);
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
          {courses.isError ? (
            <ErrorState
              label="Daftar course belum dapat dimuat."
              onRetry={() => void courses.refetch()}
            />
          ) : null}
          {materials.isLoading ? <LoadingState label="Memuat materi…" /> : null}
          {materials.isError ? (
            <ErrorState
              label="Materi belum dapat dimuat."
              onRetry={() => void materials.refetch()}
            />
          ) : null}
          {!materials.isLoading &&
          !materials.isError &&
          materials.data?.data.length === 0 ? (
            <EmptyState
              title="Belum ada materi"
              description="Belum ada materi yang sesuai dengan filter ini."
            />
          ) : null}
          <div className="record-list">
            {materials.data?.data.map((item) => (
              <article className="record-row" key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={
                        "status-badge " +
                        (item.status === "published" ? "status-active" : "")
                      }
                    >
                      {item.status}
                    </span>
                    <h2 className="mt-3 text-lg font-semibold">
                      {item.position}. {item.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      {item.course_name ??
                        courses.data?.find((c) => c.id === item.course_id)
                          ?.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
                <MaterialAttachments
                  materialId={item.id}
                  attachments={item.attachments ?? []}
                  onRemove={item.status === "draft" ? (attachmentId) => removeAttachment(item.id, attachmentId) : undefined}
                  removingAttachmentId={
                    deleteAttachment.isPending && deleteAttachment.variables?.materialId === item.id
                      ? deleteAttachment.variables?.attachmentId
                      : undefined
                  }
                  className="mt-4"
                />
                <div className="mt-4 flex gap-2">
                  <ActionButton
                    icon={Pencil}
                    label={`Edit ${item.title}`}
                    onClick={() => edit(item)}
                    disabled={item.status !== "draft"}
                  />
                  {item.status === "draft" ? (
                    <ActionButton
                      icon={Send}
                      label={`Publikasikan ${item.title}`}
                      pending={publish.isPending}
                      onClick={() => publish.mutate(item.id)}
                      disabled={publish.isPending}
                    />
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          {materials.data ? (
            <Pagination
              page={page}
              totalPages={materials.data.meta.total_pages}
              onPageChange={setPage}
            />
          ) : null}
          <AsyncFeedback
            error={publish.error}
            isError={publish.isError}
            isSuccess={publish.isSuccess}
            errorMessage="Materi belum dapat dipublikasikan."
            successMessage="Materi berhasil dipublikasikan."
          />
        </section>
      </div>
    </RoleBoundary>
  );
}
