"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Clock3, Cloud, CloudOff } from "lucide-react";
import { RoleBoundary } from "@/components/role-boundary";
import {
  useAttempt,
  useSaveAnswer,
  useSubmitAttempt,
} from "@/features/attempts/use-attempts";

function useRemainingSeconds(deadline?: string, serverTime?: string) {
  const anchor = useRef<{ server: number; client: number } | undefined>(
    undefined,
  );
  const [remaining, setRemaining] = useState(0);
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
  return remaining;
}
function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest]
    .map((item) => String(item).padStart(2, "0"))
    .join(":");
}

export default function AttemptPage() {
  const attemptId = useParams<{ attemptId: string }>().attemptId;
  const attempt = useAttempt(attemptId);
  const save = useSaveAnswer(attemptId);
  const submit = useSubmitAttempt(attemptId);
  const router = useRouter();
  const [index, setIndex] = useState(0);
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
    if (
      attempt.data &&
      remaining === 0 &&
      attempt.data.status === "in_progress"
    )
      submit.mutate(undefined, {
        onSuccess: () => router.replace("/student/results"),
      });
  }, [remaining, attempt.data, submit, router]);
  if (attempt.isLoading)
    return <p className="text-sm text-muted">Menyiapkan lembar ujian…</p>;
  if (!attempt.data || !question)
    return (
      <p className="form-error">Attempt tidak tersedia atau sudah berakhir.</p>
    );
  const answered = answerMap.size;
  return (
    <RoleBoundary allow={["student"]}>
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">LEMBAR UJIAN</p>
            <p className="mt-1 text-sm text-muted">
              {answered} dari {attempt.data.questions.length} soal terjawab
            </p>
          </div>
          <div
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 font-mono text-lg font-bold"
            aria-live="polite"
          >
            <Clock3 size={18} />
            {formatTime(remaining)}
          </div>
        </header>
        <div className="grid gap-5 lg:grid-cols-[1fr_17rem]">
          <section className="panel min-h-[28rem]">
            <p className="text-xs font-bold text-muted">
              SOAL {index + 1} DARI {attempt.data.questions.length} ·{" "}
              {question.points} POIN
            </p>
            <h1 className="mt-5 text-lg font-semibold leading-7">
              {question.stem}
            </h1>
            <fieldset className="mt-6 space-y-3">
              {question.options.map((option) => (
                <label
                  className={`answer-option ${answerMap.get(question.id) === option.id ? "answer-option-selected" : ""}`}
                  key={option.id}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={answerMap.get(question.id) === option.id}
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
            <div className="mt-8 flex items-center justify-between">
              <button
                className="button-ghost"
                disabled={index === 0 || !attempt.data.allow_back_navigation}
                onClick={() => setIndex((value) => value - 1)}
              >
                Sebelumnya
              </button>
              <span className="flex items-center gap-2 text-xs text-muted">
                {save.isPending ? (
                  <>
                    <Cloud size={15} /> Menyimpan…
                  </>
                ) : save.isError ? (
                  <>
                    <CloudOff size={15} /> Gagal tersimpan
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} /> Tersimpan
                  </>
                )}
              </span>
              <button
                className="button-primary"
                disabled={index === attempt.data.questions.length - 1}
                onClick={() => setIndex((value) => value + 1)}
              >
                Berikutnya
              </button>
            </div>
          </section>
          <aside className="panel h-fit">
            <h2 className="section-title">Navigasi soal</h2>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {attempt.data.questions.map((item, itemIndex) => (
                <button
                  className={`question-number ${itemIndex === index ? "question-number-current" : ""} ${answerMap.has(item.id) ? "question-number-answered" : ""}`}
                  key={item.id}
                  onClick={() => setIndex(itemIndex)}
                  disabled={
                    !attempt.data.allow_back_navigation && itemIndex < index
                  }
                >
                  {itemIndex + 1}
                </button>
              ))}
            </div>
            <button
              className="button-primary mt-6 w-full"
              disabled={submit.isPending}
              onClick={() => {
                if (
                  window.confirm(
                    `Kumpulkan ujian sekarang? ${attempt.data.questions.length - answered} soal belum dijawab.`,
                  )
                )
                  submit.mutate(undefined, {
                    onSuccess: (receipt) =>
                      router.replace(`/student/receipts/${receipt.attempt_id}`),
                  });
              }}
            >
              Kumpulkan ujian
            </button>
          </aside>
        </div>
      </div>
    </RoleBoundary>
  );
}
