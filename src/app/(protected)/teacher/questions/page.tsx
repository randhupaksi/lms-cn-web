"use client";

import { useState, type FormEvent } from "react";
import { RoleBoundary } from "@/components/role-boundary";
import { useAcademicData } from "@/features/academics/use-academics";
import {
  useArchiveQuestion,
  useQuestions,
  useSaveQuestion,
} from "@/features/questions/use-questions";
import type { Question } from "@/types/lms";

const emptyOptions = () =>
  Array.from({ length: 4 }, (_, index) => ({
    content: "",
    is_correct: index === 0,
  }));
export default function QuestionsPage() {
  const academics = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const questions = useQuestions(courseId);
  const save = useSaveQuestion(courseId);
  const archive = useArchiveQuestion(courseId);
  const [editingId, setEditingId] = useState<string>();
  const [stem, setStem] = useState("");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState(emptyOptions);
  function reset() {
    setEditingId(undefined);
    setStem("");
    setPoints(1);
    setOptions(emptyOptions());
  }
  function edit(question: Question) {
    setEditingId(question.id);
    setStem(question.stem);
    setPoints(question.default_points);
    setOptions(
      question.options.map((item) => ({
        content: item.content,
        is_correct: item.is_correct,
      })),
    );
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate(
      {
        id: editingId,
        input: {
          course_id: courseId,
          type: "single_choice",
          stem,
          default_points: points,
          options,
        },
      },
      { onSuccess: reset },
    );
  }
  return (
    <RoleBoundary allow={["teacher"]}>
      <div className="space-y-8">
        <header>
          <p className="eyebrow">QUESTION AUTHORING</p>
          <h1 className="page-title">Bank soal</h1>
          <p className="page-description">
            Soal sumber dikelola per course. Saat dipakai dalam ujian, kontennya
            disalin sebagai snapshot agar tetap konsisten.
          </p>
        </header>
        <label className="field-label max-w-lg">
          Course
          <select
            className="field-input"
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              reset();
            }}
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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,.75fr)]">
            <section className="panel">
              <div className="flex items-center justify-between">
                <h2 className="section-title">
                  {editingId ? "Perbarui soal" : "Buat soal"}
                </h2>
                {editingId && (
                  <button className="button-ghost" onClick={reset}>
                    Batal edit
                  </button>
                )}
              </div>
              <form className="mt-5 space-y-4" onSubmit={submit}>
                <label className="field-label">
                  Pertanyaan
                  <textarea
                    className="field-input min-h-32 resize-y"
                    value={stem}
                    onChange={(e) => setStem(e.target.value)}
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
                        aria-label={`Jadikan pilihan ${index + 1} sebagai jawaban benar`}
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
                        placeholder={`Pilihan ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </fieldset>
                <button className="button-primary" disabled={save.isPending}>
                  {save.isPending
                    ? "Menyimpan…"
                    : editingId
                      ? "Simpan perubahan"
                      : "Tambah soal"}
                </button>
                {save.isError && (
                  <p className="form-error">
                    Soal belum dapat disimpan. Pastikan tepat satu jawaban
                    benar.
                  </p>
                )}
              </form>
            </section>
            <section className="space-y-3">
              <h2 className="section-title">
                Daftar soal ({questions.data?.meta.total ?? 0})
              </h2>
              {questions.data?.data.map((question, index) => (
                <article className="panel" key={question.id}>
                  <p className="text-xs font-bold text-muted">
                    SOAL {index + 1} · {question.default_points} POIN
                  </p>
                  <p className="mt-2 font-semibold leading-6">
                    {question.stem}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="button-ghost"
                      onClick={() => edit(question)}
                    >
                      Edit
                    </button>
                    <button
                      className="button-ghost text-danger"
                      onClick={() => archive.mutate(question.id)}
                    >
                      Arsipkan
                    </button>
                  </div>
                </article>
              ))}
              {!questions.isLoading && questions.data?.data.length === 0 && (
                <div className="panel text-sm text-muted">
                  Belum ada soal pada course ini.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </RoleBoundary>
  );
}
