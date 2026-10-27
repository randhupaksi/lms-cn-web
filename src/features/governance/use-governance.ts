"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/governance.service";
import {
  listAcademicYears,
  listClassGroups,
} from "@/services/academics.service";

const root = ["governance"] as const;
export function useGovernanceOverview() {
  return useQuery({
    queryKey: [...root, "overview"],
    queryFn: service.getOverview,
    refetchInterval: 60_000,
  });
}
export function useQuality() {
  return useQuery({
    queryKey: [...root, "quality"],
    queryFn: service.getQuality,
  });
}
export function useReadiness(
  params: { page?: number; search?: string; per_page?: number },
  requestable = false,
) {
  return useQuery({
    queryKey: [...root, "exams", params, requestable],
    queryFn: () => service.getExams(params, requestable),
  });
}
export function useRequests(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: [...root, "requests", params],
    queryFn: () => service.getRequests(params),
  });
}
export function useAgenda(from: string, to: string) {
  return useQuery({
    queryKey: [...root, "agenda", from, to],
    queryFn: () => service.getAgenda(from, to),
  });
}
export function useSchoolSettings() {
  return useQuery({
    queryKey: [...root, "settings"],
    queryFn: service.getSettings,
  });
}
export function useSettingHistory() {
  return useQuery({
    queryKey: [...root, "history"],
    queryFn: service.getSettingHistory,
  });
}
export function useSchoolReports(params: service.ReportFilter) {
  return useQuery({
    queryKey: [...root, "reports", params],
    queryFn: () => service.getReports(params),
  });
}
export function useReportFilters() {
  return {
    years: useQuery({
      queryKey: ["academic-years"],
      queryFn: listAcademicYears,
    }),
    classes: useQuery({
      queryKey: ["class-groups"],
      queryFn: () => listClassGroups(),
    }),
  };
}
function useGovernanceMutation<T>(mutationFn: (input: T) => Promise<unknown>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all(
        [
          root,
          ["school-profile"],
          ["exams"],
          ["dashboard-summary"],
          ["dashboard-insights"],
        ].map((queryKey) => client.invalidateQueries({ queryKey })),
      );
    },
  });
}
export const useCreateScheduleRequest = () =>
  useGovernanceMutation(service.createScheduleRequest);
export const useDecideScheduleRequest = () =>
  useGovernanceMutation(service.decideScheduleRequest);
export const useCancelScheduleRequest = () =>
  useGovernanceMutation(service.cancelScheduleRequest);
export const useSaveSchoolEvent = () =>
  useGovernanceMutation(service.saveEvent);
export const useArchiveSchoolEvent = () =>
  useGovernanceMutation(service.archiveEvent);
export const useSaveSchoolSettings = () =>
  useGovernanceMutation(service.saveSettings);
export function useExportSchoolReports() {
  return useMutation({
    mutationFn: service.exportReports,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "citra-negara-course-report.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  });
}
