"use client";

import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAuditEvents } from "@/features/audit/use-audit";
import { PageHeader } from "@/components/ui/page-header";
import { ShieldCheck } from "lucide-react";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";

export default function AuditPage() {
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [page, setPage] = useState(1);
  const events = useAuditEvents({ action, entity_type: entityType, page });
  return (
    <RoleBoundary allow={["admin"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Governance"
          title="Audit aktivitas"
          description="Jejak tindakan sensitif bersifat read-only dan diurutkan dari aktivitas terbaru."
          icon={ShieldCheck}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-label">
            Action
            <input
              className="field-input"
              value={action}
              onChange={(event) => {
                setAction(event.target.value);
                setPage(1);
              }}
              placeholder="Contoh: exam.published"
            />
          </label>
          <label className="field-label">
            Jenis entitas
            <input
              className="field-input"
              value={entityType}
              onChange={(event) => {
                setEntityType(event.target.value);
                setPage(1);
              }}
              placeholder="Contoh: exam atau assignment"
            />
          </label>
        </div>
        {events.isLoading && <LoadingState />}
        {events.isError && (
          <ErrorState label="Audit aktivitas belum dapat dimuat." onRetry={() => void events.refetch()} />
        )}
        {events.data?.data.length === 0 && (
          <EmptyState
            title="Tidak ada aktivitas"
            description="Belum ada event yang sesuai dengan filter tersebut."
          />
        )}
        {events.data && events.data.data.length > 0 && (
          <DataTableShell>
            <DataTable>
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Aktor</th>
                    <th>Action</th>
                    <th>Entitas</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {events.data.data.map((event) => (
                    <tr key={event.id}>
                      <td>
                        {new Date(event.created_at).toLocaleString("id-ID")}
                      </td>
                      <td>{event.actor_name || "Sistem"}</td>
                      <td className="font-semibold">{event.action}</td>
                      <td>{event.entity_type}</td>
                      <td className="font-mono text-xs">
                        {event.entity_id ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
            </DataTable>
            <Pagination
              page={events.data.meta.page}
              totalPages={events.data.meta.total_pages}
              onPageChange={setPage}
              disabled={events.isFetching}
              label="Navigasi halaman audit aktivitas"
            />
          </DataTableShell>
        )}
      </div>
    </RoleBoundary>
  );
}
