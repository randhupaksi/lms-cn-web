"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, Cloud, CloudOff } from "lucide-react";
import { RoleBoundary } from "@/components/role-boundary";
import { ErrorState, LoadingState } from "@/components/data-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  useAttempt,
  useSaveAnswer,
  useSubmitAttempt,
} from "@/features/attempts/use-attempts";

function useRemainingSeconds(deadline?: string, serverTime?: string) {
  const anchor = useRef<{ server: number; client: number } | undefined>(
    undefined,
  );
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline || !serverTime) return;
    anchor.current = {
      server: new Date(serverTime).getTime(),
      client: performance.now(),
    };
    const update = () => {
      const current = anchor.current!;
      const estimatedServerNow =
        current.server + performance.now() - current.client;
      setRemaining(
        Math.max(
          0,
          Math.ceil((new Date(deadline).getTime() - estimatedServerNow) / 1000),
        ),
      );
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, serverTime]);

  return deadline && serverTime ? remaining : null;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest]
    .map((item) => String(item).padStart(2, "0"))
    .join(":");
}

export function AttemptWorkspace({ attemptId }: { attemptId: string }) {
  const attempt = useAttempt(attemptId);
  const save = useSaveAnswer(attemptId);
  const submit = useSubmitAttempt(attemptId);
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const autoSubmitStarted = useRef(false);
  const remaining = useRemainingSeconds(
    attempt.data?.deadline_at,
    attempt.data?.server_time,
  );
  const answerMap = useMemo(
    () =>
      new Map(
        attempt.data?.answers.map((item) => [
          item.exam_question_id,
          item.selected_option_id,
        ]),
      ),
    [attempt.data?.answers],
  );
  const question = attempt.data?.questions[index];

  useEffect(() => {
    questionHeading.current?.focus();
  }, [question?.id]);

  useEffect(() => {
    if (
      attempt.data &&
      remaining === 0 &&
      attempt.data.status === "in_progress" &&
      !autoSubmitStarted.current
    ) {
      autoSubmitStarted.current = true;
      submit.mutate(undefined, {
        onSuccess: (receipt) =>
          router.replace(`/student/receipts/${receipt.attempt_id}`),
      });
    }
  }, [remaining, attempt.data, submit, router]);

  if (attempt.isLoading)
    return <LoadingState label="Menyiapkan lembar ujian…" />;
  if (!attempt.data || !question) {
    return (
      <ErrorState
        label="Attempt tidak tersedia atau sudah berakhir."
        onRetry={() => void attempt.refetch()}
      />
    );
  }

  const answered = answerMap.size;
  const timeExpired = remaining === 0;

  return (
    <RoleBoundary allow={["student"]}>
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="exam-toolbar">
          <div>
            <p className="eyebrow">LEMBAR UJIAN</p>
            <p className="mt-1 text-sm text-muted" id="exam-progress-label">
              {answered} dari {attempt.data.questions.length} soal terjawab
            </p>
            <progress
              className="exam-progress mt-3"
              value={answered}
              max={attempt.data.questions.length}
              aria-labelledby="exam-progress-label"
            />
          </div>
          <div
            className={`exam-timer ${remaining !== null && remaining <= 300 ? "exam-timer-urgent" : ""}`}
            role="timer"
            aria-label="Sisa waktu ujian"
          >
            <Clock3 aria-hidden="true" size={18} />
            <div>
              <p className="text-xs font-medium">Sisa waktu</p>
              <p className="font-mono text-xl font-semibold">
                {remaining === null ? "--:--:--" : formatTime(remaining)}
              </p>
            </div>
          </div>
        </header>

        <div className="exam-layout">
          <section className="panel exam-question">
            <p className="text-xs font-bold text-muted">
              SOAL {index + 1} DARI {attempt.data.questions.length} ·{" "}
              {question.points} POIN
            </p>
            <h1
              ref={questionHeading}
              tabIndex={-1}
              className="mt-5 text-lg font-semibold leading-7"
            >
              {question.stem}
            </h1>
            <fieldset className="mt-6 space-y-3">
              <legend className="sr-only">
                Pilihan jawaban soal {index + 1}
              </legend>
              {question.options.map((option) => (
                <label
                  className={`answer-option ${answerMap.get(question.id) === option.id ? "answer-option-selected" : ""}`}
                  key={option.id}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={answerMap.get(question.id) === option.id}
                    disabled={timeExpired || submit.isPending}
                    onChange={() =>
                      save.mutate({
                        exam_question_id: question.id,
                        selected_option_id: option.id,
                      })
                    }
                  />
                  <span>{option.content}</span>
                </label>
              ))}
            </fieldset>

            <div className="exam-question-footer">
              <Button
                variant="ghost"
                disabled={index === 0 || !attempt.data.allow_back_navigation}
                onClick={() => setIndex((value) => value - 1)}
              >
                Sebelumnya
              </Button>
              <span
                className="flex items-center gap-2 text-xs text-muted"
                aria-live="polite"
              >
                {save.isPending ? (
                  <>
                    <Cloud aria-hidden="true" size={15} /> Menyimpan…
                  </>
                ) : save.isError ? (
                  <>
                    <CloudOff aria-hidden="true" size={15} /> Gagal tersimpan
                  </>
                ) : answerMap.has(question.id) ? (
                  <>
                    <CheckCircle2 aria-hidden="true" size={15} /> Tersimpan
                  </>
                ) : (
                  "Belum dijawab"
                )}
              </span>
              <Button
                disabled={index === attempt.data.questions.length - 1}
                onClick={() => setIndex((value) => value + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </section>

          <aside className="panel exam-navigation" aria-label="Navigasi soal">
            <h2 className="section-title">Navigasi soal</h2>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {attempt.data.questions.map((item, itemIndex) => (
                <button
                  type="button"
                  className={`question-number ${itemIndex === index ? "question-number-current" : ""} ${answerMap.has(item.id) ? "question-number-answered" : ""}`}
                  key={item.id}
                  aria-current={itemIndex === index ? "step" : undefined}
                  aria-label={`Buka soal ${itemIndex + 1}${answerMap.has(item.id) ? ", sudah dijawab" : ", belum dijawab"}`}
                  onClick={() => setIndex(itemIndex)}
                  disabled={
                    !attempt.data.allow_back_navigation && itemIndex < index
                  }
                >
                  {itemIndex + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
              <span>Hijau: sudah dijawab</span>
              <span>Putih: belum dijawab</span>
            </div>

            <Button
              className="mt-6 w-full"
              disabled={submit.isPending}
              onClick={() => setConfirmSubmit(true)}
            >
              {timeExpired ? "Coba kumpulkan kembali" : "Kumpulkan ujian"}
            </Button>
            {submit.isError && !confirmSubmit ? (
              <p className="form-error" role="alert">
                Ujian belum dapat dikumpulkan. Periksa koneksi dan coba lagi.
              </p>
            ) : null}
            <ConfirmationDialog
              open={confirmSubmit}
              onOpenChange={setConfirmSubmit}
              title="Akhiri dan kumpulkan ujian?"
              description={
                attempt.data.questions.length -
                answered +
                " soal belum dijawab. Jawaban tidak dapat diubah setelah dikumpulkan."
              }
              confirmLabel="Ya, kumpulkan"
              pendingLabel="Mengumpulkan…"
              pending={submit.isPending}
              onConfirm={() =>
                submit.mutate(undefined, {
                  onSuccess: (receipt) =>
                    router.replace(`/student/receipts/${receipt.attempt_id}`),
                })
              }
            >
              {submit.isError ? (
                <p className="form-error" role="alert">
                  Ujian belum dapat dikumpulkan. Periksa koneksi dan coba lagi.
                </p>
              ) : null}
            </ConfirmationDialog>
          </aside>
        </div>
      </div>
    </RoleBoundary>
  );
}
