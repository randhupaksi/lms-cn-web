import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";

export type Action = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignee_name: string;
  due_at: string | null;
  latest_note: string;
  overdue: boolean;
  version: number;
};
export type Assignee = { id: string; full_name: string; role: string };
export type Update = {
  id: string;
  actor_name: string;
  to_status: string;
  note: string;
  created_at: string;
};
export async function listActions(page: number) {
  const { data } = await apiClient.get<PaginatedEnvelope<Action>>(
    "/governance/actions",
    { params: { page, per_page: 20 } },
  );
  return data;
}
export async function actionSummary() {
  const { data } = await apiClient.get<
    ApiEnvelope<{ open: number; overdue: number }>
  >("/governance/actions/summary");
  return data.data;
}
export async function listAssignees() {
  const { data } = await apiClient.get<ApiEnvelope<Assignee[]>>(
    "/governance/actions/assignees",
  );
  return data.data;
}
export async function listUpdates(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<Update[]>>(
    `/governance/actions/${id}/updates`,
  );
  return data.data;
}
export async function createAction(input: {
  title: string;
  description: string;
  category: string;
  priority: string;
  assignee_id: string;
  due_at: string | null;
}) {
  await apiClient.post("/governance/actions", input);
}
export async function updateAction(input: {
  id: string;
  status: string;
  note: string;
  version: number;
}) {
  const { id, ...body } = input;
  await apiClient.patch(`/governance/actions/${id}/status`, body);
}
