"use client";
import { useState } from "react";
import { RoleBoundary } from "@/components/role-boundary";
import { useStudentResults } from "@/features/results/use-results";
import { PageHeader } from "@/components/ui/page-header";
import { Trophy } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/data-state";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { DataTableSkeleton } from "@/components/ui/skeleton";
import { FilterBar } from "@/components/ui/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { formatWibDateTime } from "@/lib/date-time";
const PAGE_SIZE = 20;
export function StudentResultsWorkspace() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const results = useStudentResults({ search, page, per_page: PAGE_SIZE });
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Evaluasi · Rekap nilai"
          title="Hasil belajar"
          description="Hanya hasil yang telah ditinjau dan dipublikasikan guru yang ditampilkan."
          icon={Trophy}
        />
        <FilterBar>
          <label className="field-label">
            Cari ujian
            <input
              className="field-input"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Judul ujian"
            />
          </label>
        </FilterBar>
        {results.isLoading ? (
          <DataTableShell>
            <DataTableSkeleton
              label="Memuat hasil belajar"
              className="student-score-table"
              rows={6}
              columns={[
                { label: "Ujian", kind: "stack" },
                { label: "Nilai (%)", kind: "numeric", align: "right" },
                { label: "Poin", kind: "numeric", align: "right" },
                { label: "Waktu penilaian", kind: "text" },
              ]}
            />
          </DataTableShell>
        ) : null}
        {results.isError ? (
          <ErrorState
            label="Hasil belajar belum dapat dimuat."
            onRetry={() => void results.refetch()}
          />
        ) : null}
        {!results.isLoading &&
        !results.isError &&
        results.data?.data.length === 0 ? (
          <EmptyState
            title="Belum ada hasil dipublikasikan"
            description="Hasil yang telah ditinjau guru akan muncul di halaman ini."
          />
        ) : null}
        {results.data?.data.length ? (
          <DataTableShell>
            <DataTable caption="Hasil ujian yang telah dipublikasikan guru" className="student-score-table">
              <thead>
                <tr>
                  <th>Ujian</th>
                  <th className="numeric-cell">Nilai (%)</th>
                  <th className="numeric-cell">Poin</th>
                  <th>Waktu penilaian</th>
                </tr>
              </thead>
              <tbody>
                {results.data.data.map((result) => (
                  <tr key={result.id}>
                    <td className="cell-wrap">
                      <h3 className="font-semibold">{result.exam_title}</h3>
                      <p className="mt-1 text-xs text-muted">
                        {result.course_name}
                      </p>
                    </td>
                    <td className="numeric-cell">
                      <span className="text-xl font-semibold text-primary">
                        {result.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="numeric-cell">
                      {result.score} / {result.max_score}
                    </td>
                    <td className="text-xs text-muted">
                      {formatWibDateTime(result.graded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </DataTableShell>
        ) : null}
        {results.data ? (
          <Pagination
            page={page}
            totalPages={results.data.meta.total_pages}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </RoleBoundary>
  );
}
