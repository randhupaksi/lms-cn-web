"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleBoundary } from "@/components/role-boundary";
import { useConfigureExam, useExam } from "@/features/exams/use-exams";
import { useQuestions } from "@/features/questions/use-questions";
import { useCourseMembers } from "@/features/academics/use-academics";

export default function ConfigureExamPage() {
  const examId = useParams<{ examId: string }>().examId;
  const exam = useExam(examId);
  const configuration = useConfigureExam(examId);
  const questions = useQuestions(exam.data?.course_id ?? "");
  const members = useCourseMembers(exam.data?.course_id ?? "");
  const [questionChanges, setQuestionChanges] = useState<Record<
    string,
    number
  > | null>(null);
  const [participantChanges, setParticipantChanges] = useState<string[] | null>(
    null,
  );

  const questionSelection =
    questionChanges ??
    Object.fromEntries(
      (exam.data?.questions ?? []).map((item) => [
        item.source_question_id,
        item.points,
      ]),
    );
  const participantSelection =
    participantChanges ?? exam.data?.participant_ids ?? [];
  const students = members.data?.students ?? [];

  if (exam.isLoading)
    return <p className="text-sm text-muted">Memuat konfigurasi ujian…</p>;

  return (
    <RoleBoundary allow={["teacher"]}>
      <div className="space-y-8">
        <header>
          <Link className="button-ghost -ml-3" href="/teacher/exams">
            ← Kembali
          </Link>
          <p className="eyebrow mt-3">EXAM CONFIGURATION</p>
          <h1 className="page-title">{exam.data?.title}</h1>
          <p className="page-description">
            Perubahan soal dan peserta hanya diizinkan saat ujian masih draft
            dan belum memiliki attempt.
          </p>
        </header>
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="panel">
            <h2 className="section-title">Pilih soal</h2>
            <div className="mt-4 space-y-3">
              {questions.data?.data.map((question) => (
                <label
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                  key={question.id}
                >
                  <input
                    className="mt-1"
                    type="checkbox"
                    checked={question.id in questionSelection}
                    onChange={(event) => {
                      const next = { ...questionSelection };
                      if (event.target.checked)
                        next[question.id] = question.default_points;
                      else delete next[question.id];
                      setQuestionChanges(next);
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {question.stem}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      Poin default: {question.default_points}
                    </span>
                  </span>
                  {question.id in questionSelection && (
                    <input
                      aria-label="Poin soal"
                      className="field-input w-20"
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={questionSelection[question.id]}
                      onChange={(event) =>
                        setQuestionChanges({
                          ...questionSelection,
                          [question.id]: Number(event.target.value),
                        })
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            <button
              className="button-primary mt-5"
              onClick={() =>
                configuration.questions.mutate(
                  Object.entries(questionSelection).map(
                    ([question_id, points]) => ({ question_id, points }),
                  ),
                )
              }
              disabled={
                configuration.questions.isPending ||
                Object.keys(questionSelection).length === 0
              }
            >
              Simpan susunan soal
            </button>
          </section>
          <section className="panel">
            <h2 className="section-title">Pilih peserta</h2>
            <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
              {students.map((student) => (
                <label
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"
                  key={student.id}
                >
                  <input
                    type="checkbox"
                    checked={participantSelection.includes(student.id)}
                    onChange={(event) =>
                      setParticipantChanges(
                        event.target.checked
                          ? [...participantSelection, student.id]
                          : participantSelection.filter(
                              (id) => id !== student.id,
                            ),
                      )
                    }
                  />
                  <span>
                    <span className="block font-semibold">
                      {student.full_name}
                    </span>
                    <span className="text-xs text-muted">
                      {student.identifier}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <button
              className="button-primary mt-5"
              onClick={() =>
                configuration.participants.mutate(participantSelection)
              }
              disabled={
                configuration.participants.isPending ||
                participantSelection.length === 0
              }
            >
              Simpan peserta
            </button>
          </section>
        </div>
      </div>
    </RoleBoundary>
  );
}
