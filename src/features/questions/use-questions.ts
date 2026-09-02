"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/questions.service";
export const questionKeys = {
  byCourse: (courseId: string) => ["questions", courseId] as const,
  filtered: (courseId: string, filter: service.QuestionFilter) =>
    ["questions", courseId, filter] as const,
};
export function useQuestions(
  courseId: string,
  filter: service.QuestionFilter = {},
) {
  return useQuery({
    queryKey: questionKeys.filtered(courseId, filter),
    queryFn: () => service.listQuestions(courseId, filter),
    enabled: Boolean(courseId),
  });
}
export function useSaveQuestion(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id?: string;
      input: service.QuestionInput;
    }) =>
      id ? service.updateQuestion(id, input) : service.createQuestion(input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: questionKeys.byCourse(courseId) }),
  });
}
export function useArchiveQuestion(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.archiveQuestion,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: questionKeys.byCourse(courseId) }),
  });
}
