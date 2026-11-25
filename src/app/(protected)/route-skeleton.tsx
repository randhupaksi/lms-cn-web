import type { CSSProperties } from "react";
import {
  AcademicStructureSkeleton,
  AssignmentCardsSkeleton,
  ExamConfigurationSkeleton,
  ExamScheduleSkeleton,
  ExamSheetSkeleton,
  ReadingWorkspaceSkeleton,
  ReceiptSkeleton,
} from "@/components/ui/skeleton-patterns";
import {
  SkeletonBlock,
  SkeletonRegion,
  type SkeletonTableColumn,
} from "@/components/ui/skeleton";
import { DashboardSectionsSkeleton } from "@/features/analytics/components/dashboard-skeletons";
import {
  CalendarWorkspaceSkeleton,
  DecisionListSkeleton,
  QualityWorkspaceSkeleton,
  ReportsTableSkeleton,
  SettingsHistorySkeleton,
  SettingsFormSkeleton,
} from "@/features/governance/components/governance-skeletons";

type RouteTableColumn = SkeletonTableColumn & { width?: string };

function ProtectedPageHeaderSkeleton({
  withAction = false,
}: {
  withAction?: boolean;
}) {
  return (
    <header
      className="page-header protected-page-skeleton-header"
      aria-hidden="true"
    >
      <div className="protected-page-skeleton-heading">
        <SkeletonBlock className="protected-page-skeleton-eyebrow" />
        <SkeletonBlock className="protected-page-skeleton-title" />
        <SkeletonBlock className="record-skeleton-line" />
        <SkeletonBlock className="record-skeleton-line-short" />
      </div>
      <div className="protected-page-skeleton-tools">
        <SkeletonBlock className="protected-page-skeleton-icon" />
        {withAction ? (
          <SkeletonBlock className="protected-page-skeleton-action" />
        ) : null}
      </div>
    </header>
  );
}

function FilterFieldsSkeleton({ count }: { count: number }) {
  return (
    <section className="filter-bar" aria-hidden="true">
      <div className="filter-bar-label">
        <SkeletonBlock className="protected-filter-skeleton-icon" />
        <SkeletonBlock className="protected-filter-skeleton-caption" />
      </div>
      <div className="filter-bar-fields">
        {Array.from({ length: count }, (_, field) => (
          <span className="protected-filter-skeleton-field" key={field}>
            <SkeletonBlock className="protected-filter-skeleton-label" />
            <SkeletonBlock className="protected-filter-skeleton-control" />
          </span>
        ))}
      </div>
    </section>
  );
}

function TableCellSkeleton({
  kind = "text",
  compact = false,
}: {
  kind?: SkeletonTableColumn["kind"];
  compact?: boolean;
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
  if (kind === "badge")
    return <SkeletonBlock className="skeleton-cell-badge" />;
  if (kind === "numeric")
    return <SkeletonBlock className="skeleton-cell-numeric" />;
  if (kind === "progress")
    return <SkeletonBlock className="skeleton-cell-progress" />;
  return (
    <SkeletonBlock
      className={compact ? "protected-table-cell-short" : "skeleton-cell-text"}
    />
  );
}

function RouteTableSkeleton({
  columns,
  rows = 6,
  className,
}: {
  columns: RouteTableColumn[];
  rows?: number;
  className?: string;
}) {
  const template = columns
    .map((column) => column.width ?? "minmax(0, 1fr)")
    .join(" ");
  const gridStyle: CSSProperties = { gridTemplateColumns: template };

  return (
    <div
      className={`protected-table-skeleton ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="protected-table-skeleton-header" style={gridStyle}>
        {columns.map((column) => (
          <span data-align={column.align} key={column.label}>
            <SkeletonBlock className="skeleton-table-heading" />
          </span>
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div className="protected-table-skeleton-row" key={row} style={gridStyle}>
          {columns.map((column, cell) => (
            <span
              className="protected-table-skeleton-cell"
              data-align={column.align}
              key={`${row}-${column.label}`}
            >
              <TableCellSkeleton
                kind={column.kind}
                compact={(row + cell) % 3 === 2}
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <div className="protected-page-skeleton-pagination" aria-hidden="true">
      <SkeletonBlock className="protected-pagination-summary" />
      <span>
        <SkeletonBlock className="protected-pagination-control" />
        <SkeletonBlock className="protected-pagination-control" />
      </span>
    </div>
  );
}

function TablePageSkeleton({
  label,
  filterCount,
  columns,
  rows = 6,
  withAction = false,
  tableClass,
}: {
  label: string;
  filterCount: number;
  columns: RouteTableColumn[];
  rows?: number;
  withAction?: boolean;
  tableClass?: string;
}) {
  return (
    <SkeletonRegion label={label}>
      <div className="protected-data-page-skeleton">
        <ProtectedPageHeaderSkeleton withAction={withAction} />
        <FilterFieldsSkeleton count={filterCount} />
        <RouteTableSkeleton
          columns={columns}
          rows={rows}
          className={tableClass}
        />
        <PaginationSkeleton />
      </div>
    </SkeletonRegion>
  );
}

function CollectionPageSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label}>
      <div className="protected-collection-skeleton">
        <ProtectedPageHeaderSkeleton withAction />
        <FilterFieldsSkeleton count={3} />
        <div className="record-list" aria-hidden="true">
          {Array.from({ length: 5 }, (_, row) => (
            <article className="record-row" key={row}>
              <div className="record-skeleton-content">
                <div className="record-skeleton-heading">
                  <SkeletonBlock className="skeleton-cell-badge" />
                  <SkeletonBlock className="record-skeleton-title" />
                </div>
                <SkeletonBlock className="record-skeleton-meta" />
                <div className="record-skeleton-copy">
                  <SkeletonBlock className="record-skeleton-line" />
                  <SkeletonBlock className="record-skeleton-line-short" />
                </div>
              </div>
              <div className="record-skeleton-actions">
                <SkeletonBlock className="skeleton-action-icon" />
                <SkeletonBlock className="skeleton-action-icon" />
              </div>
            </article>
          ))}
        </div>
        <PaginationSkeleton />
      </div>
    </SkeletonRegion>
  );
}

function QuestionWorkspaceSkeleton() {
  return (
    <SkeletonRegion label="Menyiapkan bank soal">
      <div className="protected-data-page-skeleton">
        <ProtectedPageHeaderSkeleton withAction />
        <FilterFieldsSkeleton count={3} />
        <div className="record-list" aria-hidden="true">
          {[0, 1, 2, 3].map((item) => (
            <article className="record-row question-skeleton-row" key={item}>
              <SkeletonBlock className="record-skeleton-meta" />
              <SkeletonBlock className="record-skeleton-meta question-skeleton-tags" />
              <SkeletonBlock className="record-skeleton-title question-skeleton-stem" />
              <SkeletonBlock className="record-skeleton-line" />
              <div className="record-skeleton-actions question-skeleton-actions">
                <SkeletonBlock className="skeleton-action-icon" />
                <SkeletonBlock className="skeleton-action-icon" />
              </div>
            </article>
          ))}
        </div>
        <PaginationSkeleton />
      </div>
    </SkeletonRegion>
  );
}

function AccessWorkspaceSkeleton() {
  return (
    <SkeletonRegion label="Menyiapkan tata kelola akses pengguna">
      <div className="protected-data-page-skeleton">
        <ProtectedPageHeaderSkeleton withAction />
        <section
          className="panel protected-access-guidance-skeleton"
          aria-hidden="true"
        >
          <SkeletonBlock className="protected-page-skeleton-icon" />
          <span>
            <SkeletonBlock className="record-skeleton-line" />
            <SkeletonBlock className="record-skeleton-line-short" />
          </span>
        </section>
        <div className="protected-access-tabs-skeleton" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((tab) => (
            <SkeletonBlock className="protected-access-tab" key={tab} />
          ))}
        </div>
        <div className="protected-access-skeleton-layout">
          <RouteTableSkeleton
            className="protected-access-table-skeleton"
            rows={6}
            columns={[
              { label: "Pengguna", kind: "stack", width: "1.6fr" },
              { label: "Peran", kind: "badge" },
              { label: "Status", kind: "badge" },
              { label: "Aksi", kind: "actions", align: "center" },
            ]}
          />
          <aside className="panel protected-inspector-skeleton" aria-hidden="true">
            <SkeletonBlock className="protected-page-skeleton-eyebrow" />
            <SkeletonBlock className="protected-page-skeleton-title" />
            <SkeletonBlock className="record-skeleton-line" />
            <div>
              {[0, 1, 2, 3].map((row) => (
                <span key={row}>
                  <SkeletonBlock className="record-skeleton-meta" />
                  <SkeletonBlock className="record-skeleton-line" />
                </span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function ProtectedRouteSkeleton({ pathname }: { pathname: string }) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/dashboard") return <DashboardSectionsSkeleton role="admin" />;
  if (path.startsWith("/student/attempts/")) return <ExamSheetSkeleton />;
  if (path.startsWith("/student/receipts/")) return <ReceiptSkeleton />;
  if (path.startsWith("/teacher/exams/")) return <ExamConfigurationSkeleton />;
  if (path === "/admin/academics")
    return (
      <>
        <ProtectedPageHeaderSkeleton withAction />
        <AcademicStructureSkeleton />
      </>
    );
  if (path.endsWith("/calendar"))
    return (
      <>
        <ProtectedPageHeaderSkeleton />
        <CalendarWorkspaceSkeleton />
      </>
    );
  if (path.endsWith("/quality"))
    return (
      <>
        <ProtectedPageHeaderSkeleton />
        <QualityWorkspaceSkeleton />
      </>
    );
  if (path.endsWith("/reports"))
    return (
      <>
        <ProtectedPageHeaderSkeleton withAction />
        <FilterFieldsSkeleton count={2} />
        <ReportsTableSkeleton />
      </>
    );
  if (path.endsWith("/settings"))
    return (
      <>
        <ProtectedPageHeaderSkeleton withAction />
        <SettingsFormSkeleton />
        <SettingsHistorySkeleton />
      </>
    );
  if (path === "/governance/requests")
    return (
      <>
        <ProtectedPageHeaderSkeleton />
        <DecisionListSkeleton />
      </>
    );
  if (path === "/admin/users")
    return (
      <TablePageSkeleton
        label="Menyiapkan direktori pengguna"
        filterCount={2}
        withAction
        tableClass="user-directory-table"
        columns={[
          { label: "Nama", kind: "stack", width: "1.4fr" },
          { label: "Identitas", kind: "text", width: "1.1fr" },
          { label: "Peran", kind: "badge" },
          { label: "Status", kind: "badge" },
          { label: "Aksi", kind: "actions", align: "center" },
        ]}
      />
    );
  if (path === "/principal/users" || path === "/superadmin/users")
    return <AccessWorkspaceSkeleton />;
  if (path.includes("/monitoring"))
    return (
      <TablePageSkeleton
        label="Menyiapkan monitoring ujian"
        filterCount={2}
        tableClass="monitoring-table"
        columns={[
          { label: "Ujian", kind: "stack", width: "1.5fr" },
          { label: "Course", kind: "text" },
          { label: "Status", kind: "badge" },
          { label: "Jadwal", kind: "text" },
          { label: "Aksi", kind: "actions", align: "center" },
        ]}
        rows={5}
      />
    );
  if (path === "/student/results")
    return (
      <TablePageSkeleton
        label="Menyiapkan hasil belajar siswa"
        filterCount={1}
        tableClass="student-score-table"
        columns={[
          { label: "Ujian", kind: "stack", width: "1.5fr" },
          { label: "Nilai", kind: "numeric" },
          { label: "Poin", kind: "numeric" },
          { label: "Waktu", kind: "text" },
        ]}
      />
    );
  if (path === "/teacher/results")
    return (
      <TablePageSkeleton
        label="Menyiapkan rekap hasil ujian"
        filterCount={3}
        tableClass="gradebook-table"
        columns={[
          { label: "Ujian", kind: "stack", width: "1.3fr" },
          { label: "Siswa", kind: "stack", width: "1.2fr" },
          { label: "Identitas", kind: "text" },
          { label: "Nilai", kind: "numeric" },
          { label: "Persentase", kind: "numeric" },
          { label: "Status", kind: "badge" },
        ]}
      />
    );
  if (path === "/admin/audit")
    return (
      <TablePageSkeleton
        label="Menyiapkan riwayat audit aktivitas"
        filterCount={2}
        tableClass="audit-table"
        columns={[
          { label: "Waktu", kind: "text" },
          { label: "Aktor", kind: "stack" },
          { label: "Tindakan", kind: "stack" },
          { label: "Entitas", kind: "text" },
          { label: "ID", kind: "text" },
        ]}
      />
    );
  if (path.endsWith("/assignments"))
    return (
      <>
        <ProtectedPageHeaderSkeleton withAction />
        <FilterFieldsSkeleton count={2} />
        <AssignmentCardsSkeleton
          label={
            path.startsWith("/student/")
              ? "Menyiapkan daftar tugas belajar"
              : "Menyiapkan ruang tugas dan penilaian"
          }
          rows={3}
        />
      </>
    );
  if (path === "/student/materials")
    return (
      <>
        <ProtectedPageHeaderSkeleton />
        <ReadingWorkspaceSkeleton label="Menyiapkan ruang belajar" />
      </>
    );
  if (path.endsWith("/exams"))
    return (
      <>
        <ProtectedPageHeaderSkeleton withAction />
        <FilterFieldsSkeleton count={2} />
        <ExamScheduleSkeleton label="Menyiapkan jadwal ujian" rows={4} />
      </>
    );
  if (path === "/teacher/questions") return <QuestionWorkspaceSkeleton />;
  if (path.endsWith("/materials"))
    return <CollectionPageSkeleton label="Menyiapkan daftar materi" />;
  if (path.endsWith("/users")) return <AccessWorkspaceSkeleton />;
  return <CollectionPageSkeleton label="Menyiapkan ruang kerja" />;
}
