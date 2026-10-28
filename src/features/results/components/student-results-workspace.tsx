"use client";
import { useState } from "react";
import { RoleBoundary } from "@/components/role-boundary";
import { useStudentResults } from "@/features/results/use-results";
import { PageHeader } from "@/components/ui/page-header";
import { Trophy } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { Pagination } from "@/components/ui/pagination";
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
          <LoadingState label="Memuat hasil belajar…" />
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
            <div className="flex items-center justify-between gap-4 border-b border-border p-5">
              <h2 className="section-title">Rekap hasil ujian</h2>
              <span className="count-label">
                {results.data.meta.total} hasil dipublikasikan
              </span>
            </div>
            <DataTable className="student-score-table">
              <caption className="sr-only">
                Hasil ujian yang telah dipublikasikan guru
              </caption>
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
                      {new Date(result.graded_at).toLocaleString("id-ID")}
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
