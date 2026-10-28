"use client";
import { useState } from "react";
import { Radar, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { ActionLink } from "@/components/ui/action-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useReadiness } from "../use-governance";
import {
  CheckLine,
  GovernanceBadge,
  QueryState,
  schoolTime,
  WorkspaceLink,
} from "./governance-shared";

export function ReadinessWorkspace() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useReadiness({ search, page, per_page: 15 });
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow="Operasi ujian"
        title="Kesiapan sebelum pelaksanaan"
        description="Periksa kelengkapan, benturan jadwal kelas, dan status ujian dalam satu daftar."
        actions={
          <WorkspaceLink href="/governance/requests">
            Tinjau pengajuan jadwal
          </WorkspaceLink>
        }
      />
      <div className="governance-guidance">
        <Radar size={22} aria-hidden="true" />
        <p>
          Pemeriksaan kesiapan membantu koordinasi dengan guru. Jadwal ujian
          terkunci setelah ada siswa yang memulai pengerjaan.
        </p>
      </div>
      <section className="governance-section">
        <div className="governance-toolbar">
          <label className="governance-search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Cari ujian atau course"
              placeholder="Cari ujian atau course…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <span className="text-sm text-muted">
            {query.data?.meta.total ?? "—"} ujian
          </span>
        </div>
        <QueryState query={query} />
        {query.data && (
          <>
            <div className="table-scroll">
              <table className="data-table readiness-table">
                <caption className="sr-only">
                  Kelengkapan dan kesiapan setiap ujian
                </caption>
                <thead>
                  <tr>
                    <th>Ujian & jadwal</th>
                    <th>Siklus</th>
                    <th>Kelengkapan</th>
                    <th>Kesiapan</th>
                    <th>
                      <span className="sr-only">Tindakan</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((exam) => (
                    <tr key={exam.id}>
                      <td>
                        <strong>{exam.title}</strong>
                        <p className="text-xs text-muted mt-1">
                          {exam.class_name} · {exam.course_name}
                        </p>
                        <p className="text-xs text-muted mt-2">
                          {schoolTime(exam.starts_at)} WIB
                        </p>
                      </td>
                      <td>
                        <GovernanceBadge value={exam.lifecycle} />
                        <p className="text-xs text-muted mt-2">
                          {exam.attempt_count} sesi
                        </p>
                      </td>
                      <td>
                        <span className="text-sm">
                          {exam.question_count} soal · {exam.participant_count}{" "}
                          peserta
                        </span>
                        <p className="text-xs text-muted mt-2">
                          {exam.teacher_count} guru aktif ·{" "}
                          {exam.duration_minutes} menit
                        </p>
                      </td>
                      <td>
                        {exam.issues.length ? (
                          <details className="readiness-details">
                            <summary>
                              <StatusBadge tone="warning">
                                {exam.issues.length} perlu ditinjau
                              </StatusBadge>
                            </summary>
                            <div className="mt-3 space-y-2">
                              {exam.issues.map((issue) => (
                                <CheckLine key={issue} ok={false}>
                                  {issue}
                                </CheckLine>
                              ))}
                            </div>
                          </details>
                        ) : (
                          <CheckLine ok>Lengkap</CheckLine>
                        )}
                      </td>
                      <td>
                        <ActionLink
                          href="/admin/monitoring"
                          icon={Radar}
                          label={`Buka monitoring untuk meninjau ${exam.title}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {query.data.data.length === 0 && (
              <p className="governance-empty">
                Tidak ada ujian yang sesuai pencarian.
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
