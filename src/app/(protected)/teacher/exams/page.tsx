"use client";

import { useState, type FormEvent } from "react";
import { RoleBoundary } from "@/components/role-boundary";
import { useAcademicData } from "@/features/academics/use-academics";
import {
  useCreateExam,
  useExamAction,
  useExams,
} from "@/features/exams/use-exams";
import { publishExam, unpublishExam } from "@/services/exams.service";

export default function ExamsPage() {
  const academics = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const exams = useExams(courseId);
  const create = useCreateExam(courseId);
  const publish = useExamAction(courseId, publishExam);
  const unpublish = useExamAction(courseId, unpublishExam);
  const [form, setForm] = useState({
    title: "",
    description: "",
    starts_at: "",
    ends_at: "",
    duration_minutes: 90,
    allow_back_navigation: true,
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    create.mutate(
      {
        ...form,
        course_id: courseId,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
      },
      {
        onSuccess: () =>
          setForm({
            title: "",
            description: "",
            starts_at: "",
            ends_at: "",
            duration_minutes: 90,
            allow_back_navigation: true,
          }),
      },
    );
  }
  return (
    <RoleBoundary allow={["teacher"]}>
      <div className="space-y-8">
        <header>
          <p className="eyebrow">EXAM AUTHORING</p>
          <h1 className="page-title">Ujian</h1>
          <p className="page-description">
            Siapkan jadwal dan durasi dalam status draft. Soal dan peserta harus
            ditetapkan sebelum ujian dipublikasikan.
          </p>
        </header>
        <label className="field-label max-w-lg">
          Course
          <select
            className="field-input"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Pilih course</option>
            {academics.courses.data?.data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        {courseId && (
          <section className="panel">
            <h2 className="section-title">Buat ujian</h2>
            <form className="form-grid" onSubmit={submit}>
              <label className="field-label md:col-span-2">
                Judul
                <input
                  className="field-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                />
              </label>
              <label className="field-label">
                Mulai
                <input
                  className="field-input"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) =>
                    setForm({ ...form, starts_at: e.target.value })
                  }
                  required
                />
              </label>
              <label className="field-label">
                Selesai
                <input
                  className="field-input"
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) =>
                    setForm({ ...form, ends_at: e.target.value })
                  }
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
              <button className="button-primary md:col-span-2">
                Simpan draft
              </button>
            </form>
          </section>
        )}
        <section className="grid gap-4 md:grid-cols-2">
          {exams.data?.data.map((exam) => (
            <article className="panel" key={exam.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`status-badge ${exam.status === "published" ? "status-active" : ""}`}
                  >
                    {exam.status}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold">{exam.title}</h2>
                </div>
                <p className="text-sm font-bold">
                  {exam.duration_minutes} menit
                </p>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-muted">Soal</dt>
                  <dd className="font-semibold">{exam.question_count}</dd>
                </div>
                <div>
                  <dt className="text-muted">Peserta</dt>
                  <dd className="font-semibold">{exam.participant_count}</dd>
                </div>
                <div>
                  <dt className="text-muted">Poin</dt>
                  <dd className="font-semibold">{exam.total_points}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <a className="button-ghost" href={`/teacher/exams/${exam.id}`}>
                  Atur ujian
                </a>
                {exam.status === "draft" ? (
                  <button
                    className="button-primary"
                    onClick={() => publish.mutate(exam.id)}
                  >
                    Publikasikan
                  </button>
                ) : (
                  <button
                    className="button-ghost"
                    onClick={() => unpublish.mutate(exam.id)}
                  >
                    Batalkan publikasi
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </RoleBoundary>
  );
}
