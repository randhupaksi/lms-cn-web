"use client";
import { useState } from "react";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/data-state";
import { DataTableSkeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/features/academics/use-academics";
import { FilterBar } from "@/components/ui/filter-bar";
const PAGE_SIZE = 20;
export function CourseTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const courses = useCourses({ search, page, per_page: PAGE_SIZE });
  return (
    <DataTableShell>
      <FilterBar>
        <label className="field-label">
          Cari course
          <input
            className="field-input"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Nama course, mata pelajaran, atau kelas"
          />
        </label>
      </FilterBar>
      {courses.isLoading ? (
        <div className="p-5">
          <DataTableSkeleton
            label="Memuat course"
            rows={5}
            columns={[
              { label: "Course", kind: "stack" },
              { label: "Mata pelajaran", kind: "text" },
              { label: "Kelas", kind: "text" },
              { label: "Tahun ajaran", kind: "text" },
            ]}
          />
        </div>
      ) : null}
      {courses.isError ? (
        <div className="p-5">
          <ErrorState
            label="Daftar course belum dapat dimuat."
            onRetry={() => void courses.refetch()}
          />
        </div>
      ) : null}
      {!courses.isLoading &&
      !courses.isError &&
      courses.data?.data.length === 0 ? (
        <div className="p-5">
          <EmptyState
            title={search ? "Course tidak ditemukan" : "Belum ada course"}
            description={
              search
                ? "Coba kata kunci lain untuk menemukan course."
                : "Course aktif akan tampil di sini saat tersedia."
            }
          />
        </div>
      ) : null}
      {courses.data?.data.length ? (
        <DataTable caption="Daftar course sekolah">
          <thead>
            <tr>
              <th>Course</th>
              <th>Mata pelajaran</th>
              <th>Kelas</th>
              <th>Tahun ajaran</th>
            </tr>
          </thead>
          <tbody>
            {courses.data.data.map((item) => (
              <tr key={item.id}>
                <td className="font-semibold">{item.name}</td>
                <td>{item.subject.name}</td>
                <td>{item.class_group.name}</td>
                <td>{item.academic_year.name}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      ) : null}
      {courses.data ? (
        <Pagination
          page={page}
          totalPages={courses.data.meta.total_pages}
          onPageChange={setPage}
        />
      ) : null}
    </DataTableShell>
  );
}
