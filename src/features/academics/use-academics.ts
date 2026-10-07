"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/academics.service";
import type { Course } from "@/types/lms";
export const academicKeys = {
  years: ["academic-years"] as const,
  classes: ["class-groups"] as const,
  subjects: ["subjects"] as const,
  courses: ["courses"] as const,
  members: (courseId: string) => ["courses", courseId, "members"] as const,
};
export function useAcademicData() {
  return {
    years: useQuery({
      queryKey: academicKeys.years,
      queryFn: service.listAcademicYears,
    }),
    classes: useQuery({
      queryKey: academicKeys.classes,
      queryFn: () => service.listClassGroups(),
    }),
    subjects: useQuery({
      queryKey: academicKeys.subjects,
      queryFn: service.listSubjects,
    }),
    courses: useQuery({
      queryKey: [...academicKeys.courses, { page: 1, per_page: 20 }],
      queryFn: () => service.listCourses({ page: 1, per_page: 20 }),
    }),
  };
}
export function useCourses(params: service.CourseListFilter = {}) {
  return useQuery({
    queryKey: [...academicKeys.courses, params],
    queryFn: () => service.listCourses(params),
  });
}
export function useAllCourses() {
  return useQuery({
    queryKey: [...academicKeys.courses, "all"],
    queryFn: async () => {
      const courses: Course[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const result = await service.listCourses({ page, per_page: 100 });
        courses.push(...result.data);
        totalPages = result.meta.total_pages;
        page += 1;
      } while (page <= totalPages);
      return courses;
    },
  });
}
function useInvalidatingMutation<T>(
  mutationFn: (input: T) => Promise<unknown>,
  key: readonly string[],
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
}
export function useCreateAcademicYear() {
  return useInvalidatingMutation(
    service.createAcademicYear,
    academicKeys.years,
  );
}
export function useCreateClassGroup() {
  return useInvalidatingMutation(
    service.createClassGroup,
    academicKeys.classes,
  );
}
export function useCreateSubject() {
  return useInvalidatingMutation(service.createSubject, academicKeys.subjects);
}
export function useCreateCourse() {
  return useInvalidatingMutation(service.createCourse, academicKeys.courses);
}

export function useCourseMembers(courseId: string) {
  return useQuery({
    queryKey: academicKeys.members(courseId),
    queryFn: () => service.getCourseMembers(courseId),
    enabled: Boolean(courseId),
  });
}

export function useAssignCourseMembers(courseId: string) {
  const client = useQueryClient();
  const refresh = () =>
    client.invalidateQueries({ queryKey: academicKeys.members(courseId) });
  return {
    teachers: useMutation({
      mutationFn: (ids: string[]) => service.assignTeachers(courseId, ids),
      onSuccess: refresh,
    }),
    students: useMutation({
      mutationFn: (ids: string[]) => service.assignStudents(courseId, ids),
      onSuccess: refresh,
    }),
  };
}
