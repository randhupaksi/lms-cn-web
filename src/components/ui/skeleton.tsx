import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SkeletonBlock({ className }: { className?: string }) {
  const variants = className
    ?.split(/\s+/)
    .filter((name) => name && name !== "skeleton");
  return <span className={cn("skeleton", variants)} />;
}

export function SkeletonRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("skeleton-region", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div className="skeleton-stage" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

export type SkeletonTableColumn = {
  label: string;
  kind?: "text" | "stack" | "badge" | "numeric" | "progress" | "actions";
  align?: "left" | "center" | "right";
};

function TableCellSkeleton({
  kind = "text",
}: {
  kind?: SkeletonTableColumn["kind"];
}) {
  if (kind === "actions") {
    return (
      <span className="skeleton-action-group">
        <SkeletonBlock className="skeleton-action-icon" />
        <SkeletonBlock className="skeleton-action-icon" />
      </span>
    );
  }
  if (kind === "stack") {
    return (
      <span className="skeleton-cell-stack">
        <SkeletonBlock className="skeleton-cell-text" />
        <SkeletonBlock className="skeleton-cell-text-short" />
      </span>
    );
  }
  return (
    <SkeletonBlock
      className={
        kind === "badge"
          ? "skeleton-cell-badge"
          : kind === "numeric"
            ? "skeleton-cell-numeric"
            : kind === "progress"
              ? "skeleton-cell-progress"
              : "skeleton-cell-text"
      }
    />
  );
}

export function DataTableSkeleton({
  label,
  columns,
  rows = 5,
  className,
}: {
  label: string;
  columns: SkeletonTableColumn[];
  rows?: number;
  className?: string;
}) {
  return (
    <SkeletonRegion label={label}>
      <div className="min-w-0">
        <div className="table-scroll">
          <table className={cn("data-table skeleton-data-table", className)}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.label}
                    className={
                      column.align === "right"
                        ? "numeric-cell"
                        : column.align === "center"
                          ? "skeleton-align-center"
                          : undefined
                    }
                  >
                    <SkeletonBlock className="skeleton-table-heading" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }, (_, row) => (
                <tr key={row}>
                  {columns.map((column) => (
                    <td
                      key={`${row}-${column.label}`}
                      className={
                        column.align === "right"
                          ? "numeric-cell"
                          : column.align === "center"
                            ? "skeleton-align-center"
                            : undefined
                      }
                    >
                      <TableCellSkeleton kind={column.kind} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SkeletonRegion>
  );
}
