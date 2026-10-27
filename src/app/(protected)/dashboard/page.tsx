"use client";

import { useAuth } from "@/providers/auth-provider";
import { ErrorState, LoadingState } from "@/components/data-state";
import { useDashboardSummary } from "@/features/analytics/use-analytics";
import { DashboardWorkspace } from "@/features/analytics/components/dashboard-workspace";
import { DashboardHeader } from "@/features/analytics/components/dashboard-header";
import { RefreshCw } from "lucide-react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { ActionButton } from "@/components/ui/action-button";
import { ControlCenter } from "@/features/governance";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "superadmin") return <ControlCenter />;
  return <StandardDashboard />;
}

function StandardDashboard() {
  const { user } = useAuth();
  const summary = useDashboardSummary();
  const queryClient = useQueryClient();
  const refreshing =
    useIsFetching({ queryKey: ["dashboard-summary"] }) +
      useIsFetching({ queryKey: ["dashboard-insights"] }) >
    0;
  if (!user || user.role === "superadmin") return null;
  return (
    <section className="space-y-8">
      <DashboardHeader
        role={user.role}
        name={user.full_name}
        refreshAction={
          <ActionButton
            icon={RefreshCw}
            label="Perbarui data dashboard"
            pending={refreshing}
            onClick={() => {
              void Promise.all([
                queryClient.invalidateQueries({
                  queryKey: ["dashboard-summary"],
                }),
                queryClient.invalidateQueries({
                  queryKey: ["dashboard-insights"],
                }),
              ]);
            }}
          />
        }
      />
      {summary.isLoading && <LoadingState label="Menyiapkan ringkasan…" />}
      {summary.isError && (
        <ErrorState
          label="Ringkasan belum dapat dimuat."
          onRetry={() => void summary.refetch()}
        />
      )}
      {summary.data && user ? (
        <DashboardWorkspace
          role={user.role}
          metrics={summary.data.metrics}
          tasks={summary.data.tasks ?? []}
        />
      ) : null}
    </section>
  );
}
