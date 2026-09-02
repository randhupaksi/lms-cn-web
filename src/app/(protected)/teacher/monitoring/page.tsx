"use client";
import { RoleBoundary } from "@/components/role-boundary";
import { MonitoringWorkspace } from "@/features/monitoring/components/monitoring-workspace";
export default function TeacherMonitoringPage() {
  return (
    <RoleBoundary allow={["teacher"]}>
      <MonitoringWorkspace />
    </RoleBoundary>
  );
}
