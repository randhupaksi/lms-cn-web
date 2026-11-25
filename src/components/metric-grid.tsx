import type { DashboardMetric } from "@/types/lms";
import type { LucideIcon } from "lucide-react";

export function MetricGrid({
  metrics,
  layout = "grid",
  iconByKey,
}: {
  metrics: DashboardMetric[];
  layout?: "grid" | "strip";
  iconByKey?: Record<string, LucideIcon>;
}) {
  return (
    <dl className={layout === "strip" ? "metric-strip" : "metric-grid"}>
      {metrics.map((metric) => {
        const Icon = iconByKey?.[metric.key];

        return (
          <div className="metric-card" key={metric.key}>
            <dt
              className={`text-xs font-semibold text-muted ${Icon ? "metric-card-label-with-icon" : ""}`}
            >
              <span>{metric.label}</span>
              {Icon ? (
                <span className="dashboard-kpi-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
              ) : null}
            </dt>
            <dd className="metric-value">
              {metric.value.toLocaleString("id-ID")}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
