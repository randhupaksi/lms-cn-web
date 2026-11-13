import type { DashboardMetric } from "@/types/lms";

export function MetricGrid({
  metrics,
  layout = "grid",
}: {
  metrics: DashboardMetric[];
  layout?: "grid" | "strip";
}) {
  return (
    <dl className={layout === "strip" ? "metric-strip" : "metric-grid"}>
      {metrics.map((metric) => {
        return (
          <div className="metric-card" key={metric.key}>
            <dt className="text-xs font-semibold text-muted">{metric.label}</dt>
            <dd className="metric-value">
              {metric.value.toLocaleString("id-ID")}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
