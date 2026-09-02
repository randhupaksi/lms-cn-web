import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";
import type { Question } from "@/types/lms";

export type QuestionInput = {
  course_id: string;
  type: "single_choice";
  stem: string;
  default_points: number;
  category: string;
  tags: string[];
  options: { content: string; is_correct: boolean }[];
};
export type QuestionFilter = {
  search?: string;
  category?: string;
  tag?: string;
  status?: string;
};
export async function listQuestions(
  courseId: string,
  filter: QuestionFilter = {},
) {
  const { data } = await apiClient.get<PaginatedEnvelope<Question>>(
    "/questions",
    { params: { course_id: courseId, ...filter } },
  );
  return data;
}
export async function createQuestion(input: QuestionInput) {
  const { data } = await apiClient.post<ApiEnvelope<Question>>(
    "/questions",
    input,
  );
  return data.data;
}
export async function updateQuestion(id: string, input: QuestionInput) {
  const { data } = await apiClient.put<ApiEnvelope<Question>>(
    `/questions/${id}`,
    input,
  );
  return data.data;
}
export async function archiveQuestion(id: string) {
  await apiClient.delete(`/questions/${id}`);
}
