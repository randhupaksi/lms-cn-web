"use client";
import { useState } from "react";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { useCourses } from "@/features/academics/use-academics";
const PAGE_SIZE = 20;
export function CourseTable() {
  const [page, setPage] = useState(1);
  const courses = useCourses({ page, per_page: PAGE_SIZE });
  return (
    <DataTableShell>
      {courses.isLoading ? (
        <div className="p-5">
          <LoadingState label="Memuat course…" />
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
            title="Belum ada course"
            description="Course aktif akan tampil di sini saat tersedia."
          />
        </div>
      ) : null}
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
          {courses.data?.data.map((item) => (
            <tr key={item.id}>
              <td className="font-semibold">{item.name}</td>
              <td>{item.subject.name}</td>
              <td>{item.class_group.name}</td>
              <td>{item.academic_year.name}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
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
