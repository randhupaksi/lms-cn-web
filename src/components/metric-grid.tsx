import type { DashboardMetric } from "@/types/lms";

export function MetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div className="panel" key={metric.key}>
          <dt className="text-sm text-muted">{metric.label}</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight">
            {metric.value.toLocaleString("id-ID")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
