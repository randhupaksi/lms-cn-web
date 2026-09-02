"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/assignments.service";

const keys = {
  course: (id: string) => ["assignments", id] as const,
  submissions: (id: string) => ["assignment-submissions", id] as const,
};
export function useAssignments(courseId: string) {
  return useQuery({
    queryKey: keys.course(courseId),
    queryFn: () => service.listAssignments(courseId),
    enabled: Boolean(courseId),
  });
}
export function useSaveAssignment(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id?: string;
      input: service.AssignmentInput;
    }) =>
      id
        ? service.updateAssignment(id, input)
        : service.createAssignment(input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.course(courseId) }),
  });
}
export function usePublishAssignment(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.publishAssignment,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.course(courseId) }),
  });
}
export function useSubmitAssignment(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: service.SubmissionInput;
    }) => service.submitAssignment(id, input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.course(courseId) }),
  });
}
export function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: keys.submissions(assignmentId),
    queryFn: () => service.listSubmissions(assignmentId),
    enabled: Boolean(assignmentId),
  });
}
export function useGradeSubmission(assignmentId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: service.GradeInput }) =>
      service.gradeSubmission(id, input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.submissions(assignmentId) }),
  });
}
