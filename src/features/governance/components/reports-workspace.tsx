"use client";
import { useState } from "react";
import { Download, ChartNoAxesCombined } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { RadixSelectField } from "@/components/ui/radix-select";
import { Pagination } from "@/components/ui/pagination";
import {
  useExportSchoolReports,
  useReportFilters,
  useSchoolReports,
} from "../use-governance";
import { MutationFeedback, QueryState } from "./governance-shared";

export function ReportsWorkspace() {
  const [year, setYear] = useState("");
  const [classId, setClassId] = useState("");
  const [page, setPage] = useState(1);
  const filters = useReportFilters();
  const params = { year_id: year || undefined, class_id: classId || undefined };
  const query = useSchoolReports({ ...params, page });
  const download = useExportSchoolReports();
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow="Laporan sekolah"
        title="Pembelajaran dalam angka"
        description="Bandingkan partisipasi, pengumpulan, dan hasil yang telah dipublikasikan di setiap course."
        actions={
          <Button
            variant="secondary"
            disabled={download.isPending || !query.data?.meta.total}
            onClick={() => download.mutate(params)}
          >
            <Download size={17} aria-hidden="true" />
            {download.isPending ? "Menyiapkan…" : "Ekspor CSV"}
          </Button>
        }
      />
      <div className="governance-guidance">
        <ChartNoAxesCombined size={23} aria-hidden="true" />
        <p>
          Rerata menggunakan persentase hasil ujian yang sudah dipublikasikan.
          Tanda — berarti belum ada hasil yang dapat dihitung. Ekspor mencakup
          seluruh course sesuai filter.
        </p>
      </div>
      <section className="governance-section">
        <div className="governance-toolbar report-filter">
          <label className="field-label">
            Tahun ajaran
            <RadixSelectField
              placeholder="Pilih opsi"
              value={year || "all"}
              onValueChange={(value) => {
                setYear(value === "all" ? "" : value);
                setClassId("");
                setPage(1);
              }}
              options={[
                { value: "all", label: "Semua tahun ajaran" },
                ...(filters.years.data ?? []).map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />
          </label>
          <label className="field-label">
            Kelas
            <RadixSelectField
              placeholder="Pilih opsi"
              value={classId || "all"}
              onValueChange={(value) => {
                setClassId(value === "all" ? "" : value);
                setPage(1);
              }}
              options={[
                { value: "all", label: "Semua kelas" },
                ...(filters.classes.data ?? [])
                  .filter((item) => !year || item.academic_year_id === year)
                  .map((item) => ({ value: item.id, label: item.name })),
              ]}
            />
          </label>
          <span className="text-sm text-muted">
            {query.data?.meta.total ?? "—"} course
          </span>
        </div>
        <QueryState query={filters.years} />
        <QueryState query={filters.classes} />
        <QueryState query={query} />
        <MutationFeedback
          mutation={download}
          success="Laporan CSV siap diunduh."
        />
        {query.data && (
          <>
            <div className="table-scroll">
              <table className="data-table report-table">
                <thead>
                  <tr>
                    <th>Course / kelas</th>
                    <th>Siswa</th>
                    <th>Guru</th>
                    <th>Ujian</th>
                    <th>Attempt selesai</th>
                    <th>Hasil publik</th>
                    <th>Rerata</th>
                    <th>Di bawah referensi</th>
                    <th>Tugas</th>
                    <th>Perlu dinilai</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.name}</strong>
                        <p className="text-xs text-muted mt-1">
                          {row.class_name} · {row.year_name}
                        </p>
                      </td>
                      <td>{row.students}</td>
                      <td>{row.teachers}</td>
                      <td>{row.exams}</td>
                      <td>{row.submitted_attempts}</td>
                      <td>{row.published_results}</td>
                      <td>
                        <span className="report-score">
                          {row.average_score === null
                            ? "—"
                            : `${row.average_score.toFixed(1)}%`}
                        </span>
                      </td>
                      <td>
                        {row.below_reference}{" "}
                        <span className="text-xs text-muted">
                          (&lt;{row.passing_reference}%)
                        </span>
                      </td>
                      <td>{row.assignments}</td>
                      <td>{row.pending_grading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {query.data.data.length === 0 && (
              <p className="governance-empty">
                Belum ada course untuk filter ini.
              </p>
            )}
            <Pagination
              page={page}
              totalPages={query.data.meta.total_pages}
              onPageChange={setPage}
              disabled={query.isFetching}
            />
          </>
        )}
      </section>
    </div>
  );
}
