"use client";
import { RoleBoundary } from "@/components/role-boundary";
import { MonitoringWorkspace } from "@/features/monitoring/components/monitoring-workspace";
export default function AdminMonitoringPage() {
  return (
    <RoleBoundary allow={["admin"]}>
      <MonitoringWorkspace />
    </RoleBoundary>
  );
}
