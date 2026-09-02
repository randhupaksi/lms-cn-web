import { apiClient } from "@/services/api/client";
import type { PaginatedEnvelope } from "@/types/api";
import type { AuditEvent } from "@/types/lms";

export type AuditFilter = { action?: string; entity_type?: string };
export async function listAuditEvents(filter: AuditFilter = {}) {
  const { data } = await apiClient.get<PaginatedEnvelope<AuditEvent>>(
    "/audit-logs",
    { params: filter },
  );
  return data;
}
