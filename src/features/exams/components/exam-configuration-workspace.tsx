"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { AsyncFeedback } from "@/components/async-feedback";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useCourseMembers } from "@/features/academics";
import { useConfigureExam, useExam } from "@/features/exams/use-exams";
import { useQuestions } from "@/features/questions";

export function ExamConfigurationWorkspace({ examId }: { examId: string }) {
  const exam = useExam(examId);
  const configuration = useConfigureExam(examId);
  const questions = useQuestions(exam.data?.course_id ?? "");
  const members = useCourseMembers(exam.data?.course_id ?? "");
  const [questionChanges, setQuestionChanges] = useState<Record<string, number> | null>(null);
  const [participantChanges, setParticipantChanges] = useState<string[] | null>(null);

  const questionSelection = questionChanges ?? Object.fromEntries(
    (exam.data?.questions ?? []).map((item) => [item.source_question_id, item.points]),
  );
  const participantSelection = participantChanges ?? exam.data?.participant_ids ?? [];
  const students = members.data?.students ?? [];

  if (exam.isLoading) return <LoadingState label="Memuat konfigurasi ujian…" />;
  if (exam.isError || !exam.data) {
    return <ErrorState label="Konfigurasi ujian belum dapat dimuat." onRetry={() => void exam.refetch()} />;
  }

  return (
    <RoleBoundary allow={["teacher"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Konfigurasi ujian"
          title={exam.data.title}
          description="Perubahan soal dan peserta hanya diizinkan saat ujian masih draft dan belum memiliki attempt."
          icon={Settings2}
          actions={<Link className="button-secondary" href="/teacher/exams">← Kembali</Link>}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="panel" aria-labelledby="exam-question-heading">
            <h2 id="exam-question-heading" className="section-title">Pilih soal</h2>
            {questions.isLoading ? <LoadingState label="Memuat bank soal…" /> : null}
            {questions.isError ? (
              <ErrorState label="Bank soal belum dapat dimuat." onRetry={() => void questions.refetch()} />
            ) : null}
            {!questions.isLoading && !questions.isError && questions.data?.data.length === 0 ? (
              <EmptyState
                title="Belum ada soal siap pakai"
                description="Tambahkan soal pada bank soal course ini sebelum menyusun ujian."
              />
            ) : null}
            <div className="mt-4 space-y-3">
              {questions.data?.data.map((question) => (
                <label className="selection-item flex items-start gap-3 p-3" key={question.id}>
                  <input
                    className="mt-1"
                    type="checkbox"
                    checked={question.id in questionSelection}
                    onChange={(event) => {
                      const next = { ...questionSelection };
                      if (event.target.checked) next[question.id] = question.default_points;
                      else delete next[question.id];
                      setQuestionChanges(next);
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{question.stem}</span>
                    <span className="mt-1 block text-xs text-muted">Poin default: {question.default_points}</span>
                  </span>
                  {question.id in questionSelection ? (
                    <input
                      aria-label={`Poin untuk soal: ${question.stem}`}
                      className="field-input w-20"
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={questionSelection[question.id]}
                      onChange={(event) => setQuestionChanges({ ...questionSelection, [question.id]: Number(event.target.value) })}
                      placeholder={`Default ${question.default_points}`}
                    />
                  ) : null}
                </label>
              ))}
            </div>
            <Button
              className="mt-5"
              onClick={() => configuration.questions.mutate(
                Object.entries(questionSelection).map(([question_id, points]) => ({ question_id, points })),
              )}
              disabled={configuration.questions.isPending || Object.keys(questionSelection).length === 0}
            >
              {configuration.questions.isPending ? "Menyimpan…" : "Simpan susunan soal"}
            </Button>
            <AsyncFeedback
              error={configuration.questions.error}
              isError={configuration.questions.isError}
              isSuccess={configuration.questions.isSuccess}
              errorMessage="Susunan soal belum dapat disimpan."
              successMessage="Susunan soal berhasil disimpan."
            />
          </section>

          <section className="panel" aria-labelledby="exam-participant-heading">
            <h2 id="exam-participant-heading" className="section-title">Pilih peserta</h2>
            {members.isLoading ? <LoadingState label="Memuat peserta course…" /> : null}
            {members.isError ? (
              <ErrorState label="Peserta course belum dapat dimuat." onRetry={() => void members.refetch()} />
            ) : null}
            {!members.isLoading && !members.isError && students.length === 0 ? (
              <EmptyState
                title="Belum ada siswa di course"
                description="Tambahkan siswa ke course sebelum menentukan peserta ujian."
              />
            ) : null}
            <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
              {students.map((student) => (
                <label className="selection-item flex items-center gap-3 p-3 text-sm" key={student.id}>
                  <input
                    type="checkbox"
                    checked={participantSelection.includes(student.id)}
                    onChange={(event) => setParticipantChanges(
                      event.target.checked
                        ? [...participantSelection, student.id]
                        : participantSelection.filter((id) => id !== student.id),
                    )}
                  />
                  <span>
                    <span className="block font-semibold">{student.full_name}</span>
                    <span className="text-xs text-muted">{student.identifier}</span>
                  </span>
                </label>
              ))}
            </div>
            <Button
              className="mt-5"
              onClick={() => configuration.participants.mutate(participantSelection)}
              disabled={configuration.participants.isPending || participantSelection.length === 0}
            >
              {configuration.participants.isPending ? "Menyimpan…" : "Simpan peserta"}
            </Button>
            <AsyncFeedback
              error={configuration.participants.error}
              isError={configuration.participants.isError}
              isSuccess={configuration.participants.isSuccess}
              errorMessage="Daftar peserta belum dapat disimpan."
              successMessage="Daftar peserta berhasil disimpan."
            />
          </section>
        </div>
      </div>
    </RoleBoundary>
  );
}
