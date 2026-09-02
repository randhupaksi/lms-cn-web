"use client";

import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAuditEvents } from "@/features/audit/use-audit";

export default function AuditPage() {
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const events = useAuditEvents({ action, entity_type: entityType });
  return (
    <RoleBoundary allow={["admin"]}>
      <div className="space-y-8">
        <header>
          <p className="eyebrow">GOVERNANCE</p>
          <h1 className="page-title">Audit aktivitas</h1>
          <p className="page-description">
            Jejak tindakan sensitif bersifat read-only dan diurutkan dari
            aktivitas terbaru.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-label">
            Action
            <input
              className="field-input"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              placeholder="contoh: exam.published"
            />
          </label>
          <label className="field-label">
            Jenis entitas
            <input
              className="field-input"
              value={entityType}
              onChange={(event) => setEntityType(event.target.value)}
              placeholder="contoh: exam"
            />
          </label>
        </div>
        {events.isLoading && <LoadingState />}
        {events.isError && (
          <ErrorState label="Audit aktivitas belum dapat dimuat." />
        )}
        {events.data?.data.length === 0 && (
          <EmptyState
            title="Tidak ada aktivitas"
            description="Belum ada event yang sesuai dengan filter tersebut."
          />
        )}
        {events.data && events.data.data.length > 0 && (
          <section className="panel overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
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
              </table>
            </div>
          </section>
        )}
      </div>
    </RoleBoundary>
  );
}
