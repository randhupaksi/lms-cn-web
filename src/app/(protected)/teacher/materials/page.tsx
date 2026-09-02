"use client";

import { useState, type FormEvent } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAcademicData } from "@/features/academics/use-academics";
import {
  useMaterials,
  usePublishMaterial,
  useSaveMaterial,
} from "@/features/materials/use-materials";
import type { CourseMaterial } from "@/types/lms";

const emptyForm = { title: "", description: "", content: "", position: 1 };

export default function TeacherMaterialsPage() {
  const academics = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const [editingId, setEditingId] = useState<string>();
  const [form, setForm] = useState(emptyForm);
  const materials = useMaterials(courseId);
  const save = useSaveMaterial(courseId);
  const publish = usePublishMaterial(courseId);
  function edit(material: CourseMaterial) {
    setEditingId(material.id);
    setForm({
      title: material.title,
      description: material.description,
      content: material.content,
      position: material.position,
    });
  }
  function reset() {
    setEditingId(undefined);
    setForm(emptyForm);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate(
      { id: editingId, input: { ...form, course_id: courseId } },
      { onSuccess: reset },
    );
  }
  return (
    <RoleBoundary allow={["teacher"]}>
      <div className="space-y-8">
        <header>
          <p className="eyebrow">COURSE CONTENT</p>
          <h1 className="page-title">Materi pembelajaran</h1>
          <p className="page-description">
            Susun materi sebagai draft, lalu publikasikan ketika kontennya siap
            dipelajari siswa.
          </p>
        </header>
        <label className="field-label max-w-lg">
          Course
          <select
            className="field-input"
            value={courseId}
            onChange={(event) => {
              setCourseId(event.target.value);
              reset();
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
          <div className="grid gap-6 xl:grid-cols-[minmax(22rem,.8fr)_minmax(0,1.2fr)]">
            <section className="panel">
              <div className="flex items-center justify-between">
                <h2 className="section-title">
                  {editingId ? "Perbarui materi" : "Buat materi"}
                </h2>
                {editingId && (
                  <button className="button-ghost" onClick={reset}>
                    Batal
                  </button>
                )}
              </div>
              <form className="mt-5 space-y-4" onSubmit={submit}>
                <label className="field-label">
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
                <label className="field-label">
                  Ringkasan
                  <textarea
                    className="field-input min-h-20"
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                  />
                </label>
                <label className="field-label">
                  Konten
                  <textarea
                    className="field-input min-h-48"
                    value={form.content}
                    onChange={(event) =>
                      setForm({ ...form, content: event.target.value })
                    }
                    required
                  />
                </label>
                <label className="field-label max-w-32">
                  Urutan
                  <input
                    className="field-input"
                    type="number"
                    min={1}
                    value={form.position}
                    onChange={(event) =>
                      setForm({ ...form, position: Number(event.target.value) })
                    }
                  />
                </label>
                <button className="button-primary" disabled={save.isPending}>
                  {save.isPending ? "Menyimpan…" : "Simpan draft"}
                </button>
                {save.isError && (
                  <p className="form-error">Materi belum dapat disimpan.</p>
                )}
              </form>
            </section>
            <section className="space-y-3">
              {materials.isLoading && <LoadingState />}
              {materials.isError && (
                <ErrorState label="Materi belum dapat dimuat." />
              )}
              {materials.data?.length === 0 && (
                <EmptyState
                  title="Belum ada materi"
                  description="Buat materi pertama untuk course ini."
                />
              )}
              {materials.data?.map((material) => (
                <article className="panel" key={material.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`status-badge ${material.status === "published" ? "status-active" : ""}`}
                      >
                        {material.status}
                      </span>
                      <h2 className="mt-3 text-lg font-semibold">
                        {material.position}. {material.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {material.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="button-ghost"
                      onClick={() => edit(material)}
                      disabled={material.status !== "draft"}
                    >
                      Edit
                    </button>
                    {material.status === "draft" && (
                      <button
                        className="button-primary"
                        onClick={() => publish.mutate(material.id)}
                        disabled={publish.isPending}
                      >
                        Publikasikan
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </div>
    </RoleBoundary>
  );
}
