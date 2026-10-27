import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";

export type ExamReadiness = {
  id: string;
  title: string;
  course_id: string;
  course_name: string;
  class_name: string;
  status: string;
  lifecycle: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  question_count: number;
  participant_count: number;
  inactive_participants: number;
  teacher_count: number;
  attempt_count: number;
  conflict_count: number;
  issues: string[];
};
export type QualityGroup = {
  key: string;
  title: string;
  description: string;
  count: number;
  samples: { id: string; label: string }[];
};
export type SchoolEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  starts_at: string;
  ends_at: string;
  status: string;
  version: number;
};
export type EventInput = Pick<
  SchoolEvent,
  "title" | "description" | "category" | "starts_at" | "ends_at" | "version"
>;
export type SchoolSettings = {
  school_name: string;
  motto: string;
  contact_email: string;
  support_message: string;
  passing_reference: number;
  version: number;
  updated_at: string;
};
export type SettingsInput = Omit<SchoolSettings, "updated_at"> & {
  reason: string;
};
export type SettingChange = {
  id: string;
  actor_name: string;
  reason: string;
  version: number;
  created_at: string;
  snapshot: SchoolSettings;
};
export type GovernanceOverview = {
  generated_at: string;
  roles: { role: string; active: number; inactive: number }[];
  courses: number;
  classes: number;
  active_attempts: number;
  pending_requests: number;
  draft_results: number;
  exams: ExamReadiness[];
  exam_states: { key: string; count: number }[];
  quality: QualityGroup[];
  agenda: SchoolEvent[];
};
export type ScheduleRequest = {
  id: string;
  exam_id: string;
  exam_title: string;
  course_name: string;
  requester_id: string;
  requester_name: string;
  reviewer_name: string;
  reason: string;
  proposed_starts_at: string;
  proposed_ends_at: string;
  original_starts_at: string;
  original_ends_at: string;
  status: string;
  decision_note: string;
  created_at: string;
  decided_at: string | null;
};
export type ScheduleInput = {
  exam_id: string;
  reason: string;
  proposed_starts_at: string;
  proposed_ends_at: string;
};
export type CourseReport = {
  id: string;
  name: string;
  class_name: string;
  year_name: string;
  students: number;
  teachers: number;
  exams: number;
  submitted_attempts: number;
  published_results: number;
  average_score: number | null;
  below_reference: number;
  passing_reference: number;
  assignments: number;
  pending_grading: number;
};
export type ReportFilter = {
  year_id?: string;
  class_id?: string;
  page?: number;
};

async function get<T>(path: string, params?: object) {
  const { data } = await apiClient.get<ApiEnvelope<T>>(`/governance/${path}`, {
    params,
  });
  return data.data;
}
async function list<T>(path: string, params?: object) {
  const { data } = await apiClient.get<PaginatedEnvelope<T>>(
    `/governance/${path}`,
    { params },
  );
  return data;
}
export const getOverview = () => get<GovernanceOverview>("overview");
export const getQuality = () => get<QualityGroup[]>("quality");
export const getExams = (
  params: { page?: number; search?: string; per_page?: number },
  requestable = false,
) => list<ExamReadiness>(requestable ? "request-exams" : "exams", params);
export const getRequests = (params: { page?: number; status?: string }) =>
  list<ScheduleRequest>("requests", params);
export const getAgenda = (from: string, to: string) =>
  get<SchoolEvent[]>("events", { from, to });
export const getSettings = () => get<SchoolSettings>("settings");
export const getSettingHistory = () => get<SettingChange[]>("settings/history");
export const getReports = (params: ReportFilter) =>
  list<CourseReport>("reports", params);
export async function createScheduleRequest(input: ScheduleInput) {
  await apiClient.post("/governance/requests", input);
}
export async function decideScheduleRequest(input: {
  id: string;
  decision: "approved" | "rejected";
  note: string;
}) {
  const { id, ...body } = input;
  await apiClient.post(`/governance/requests/${id}/decision`, body);
}
export async function cancelScheduleRequest(id: string) {
  await apiClient.post(`/governance/requests/${id}/cancel`);
}
export async function saveEvent(input: { id?: string; body: EventInput }) {
  if (input.id)
    await apiClient.put(`/governance/events/${input.id}`, input.body);
  else await apiClient.post("/governance/events", input.body);
}
export async function archiveEvent(input: { id: string; version: number }) {
  await apiClient.post(`/governance/events/${input.id}/archive`, {
    version: input.version,
  });
}
export async function saveSettings(input: SettingsInput) {
  await apiClient.put("/governance/settings", input);
}
export async function exportReports(params: ReportFilter) {
  const { data } = await apiClient.get<Blob>("/governance/reports/export", {
    params,
    responseType: "blob",
  });
  return data;
}
