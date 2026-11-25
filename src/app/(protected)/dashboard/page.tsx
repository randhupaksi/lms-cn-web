"use client";

import { useAuth } from "@/providers/auth-provider";
import { ErrorState } from "@/components/data-state";
import {
  useDashboardInsights,
  useDashboardSummary,
} from "@/features/analytics/use-analytics";
import { DashboardWorkspace } from "@/features/analytics/components/dashboard-workspace";
import { DashboardHeader } from "@/features/analytics/components/dashboard-header";
import { DashboardSectionsSkeleton } from "@/features/analytics/components/dashboard-skeletons";
import { RefreshCw } from "lucide-react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { ActionButton } from "@/components/ui/action-button";
import { ControlCenter } from "@/features/governance";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "superadmin" || user.role === "principal")
    return <ControlCenter />;
  return <StandardDashboard />;
}

function StandardDashboard() {
  const { user } = useAuth();
  const summary = useDashboardSummary();
  const insights = useDashboardInsights();
  const queryClient = useQueryClient();
  const refreshing =
    useIsFetching({ queryKey: ["dashboard-summary"] }) +
      useIsFetching({ queryKey: ["dashboard-insights"] }) >
    0;
  if (!user || user.role === "superadmin" || user.role === "principal")
    return null;
  if (summary.isLoading || insights.isLoading)
    return <DashboardSectionsSkeleton role={user.role} />;
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
          insightsData={insights.data}
          insightsError={insights.isError}
          onRetryInsights={() => void insights.refetch()}
        />
      ) : null}
    </section>
  );
}
