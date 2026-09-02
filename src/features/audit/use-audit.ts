"use client";
import { useQuery } from "@tanstack/react-query";
import { listAuditEvents, type AuditFilter } from "@/services/audit.service";
export function useAuditEvents(filter: AuditFilter) {
  return useQuery({
    queryKey: ["audit-events", filter],
    queryFn: () => listAuditEvents(filter),
  });
}
