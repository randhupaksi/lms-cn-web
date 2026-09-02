import { apiClient } from "@/services/api/client";
import type { ApiEnvelope } from "@/types/api";
import type {
  Attempt,
  AttemptAnswer,
  AvailableExam,
  Receipt,
} from "@/types/lms";

const idempotencyHeaders = () => ({ "Idempotency-Key": crypto.randomUUID() });
export async function listAvailableExams() {
  const { data } =
    await apiClient.get<ApiEnvelope<AvailableExam[]>>("/student/exams");
  return data.data;
}
export async function startExam(examId: string) {
  const { data } = await apiClient.post<ApiEnvelope<Attempt>>(
    `/student/exams/${examId}/start`,
    undefined,
    { headers: idempotencyHeaders() },
  );
  return data.data;
}
export async function resumeAttempt(attemptId: string) {
  const { data } = await apiClient.get<ApiEnvelope<Attempt>>(
    `/student/attempts/${attemptId}`,
  );
  return data.data;
}
export async function saveAnswer(
  attemptId: string,
  input: { exam_question_id: string; selected_option_id: string },
) {
  const { data } = await apiClient.put<ApiEnvelope<AttemptAnswer>>(
    `/student/attempts/${attemptId}/answers`,
    input,
    { headers: idempotencyHeaders() },
  );
  return data.data;
}
export async function submitAttempt(attemptId: string) {
  const { data } = await apiClient.post<ApiEnvelope<Receipt>>(
    `/student/attempts/${attemptId}/submit`,
    undefined,
    { headers: idempotencyHeaders() },
  );
  return data.data;
}
