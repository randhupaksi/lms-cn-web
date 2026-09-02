"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/attempts.service";
export const attemptKeys = {
  available: ["available-exams"] as const,
  detail: (id: string) => ["attempt", id] as const,
};
export function useAvailableExams() {
  return useQuery({
    queryKey: attemptKeys.available,
    queryFn: service.listAvailableExams,
  });
}
export function useStartExam() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.startExam,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: attemptKeys.available }),
  });
}
export function useAttempt(id: string) {
  return useQuery({
    queryKey: attemptKeys.detail(id),
    queryFn: () => service.resumeAttempt(id),
    enabled: Boolean(id),
    refetchOnWindowFocus: true,
  });
}
export function useSaveAnswer(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      exam_question_id: string;
      selected_option_id: string;
    }) => service.saveAnswer(id, input),
    onSuccess: (answer) =>
      client.setQueryData(
        attemptKeys.detail(id),
        (
          current: ReturnType<typeof service.resumeAttempt> extends Promise<
            infer T
          >
            ? T
            : never,
        ) =>
          current
            ? {
                ...current,
                answers: [
                  ...current.answers.filter(
                    (item) => item.exam_question_id !== answer.exam_question_id,
                  ),
                  answer,
                ],
              }
            : current,
      ),
  });
}
export function useSubmitAttempt(id: string) {
  return useMutation({ mutationFn: () => service.submitAttempt(id) });
}
