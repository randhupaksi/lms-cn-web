"use client";

import { useRef, useState } from "react";
import { BookOpenText, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useAllCourses } from "@/features/academics/use-academics";
import {
  useCompleteMaterial,
  useMaterials,
} from "@/features/materials/use-materials";
import { RadixSelectField } from "@/components/ui/radix-select";
import { FilterBar } from "@/components/ui/filter-bar";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 20;
export function StudentMaterialsWorkspace() {
  const courses = useAllCourses();
  const [courseFilter, setCourseFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const readerHeading = useRef<HTMLHeadingElement>(null);
  const materials = useMaterials(
    courseFilter === "all" ? undefined : courseFilter,
    { search, status: "published", page, per_page: PAGE_SIZE },
  );
  const complete = useCompleteMaterial();
  const items = materials.data?.data ?? [];
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const courseOptions =
    courses.data?.map((item) => ({ value: item.id, label: item.name })) ?? [];

  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Pembelajaran · Perpustakaan materi"
          title="Satu materi, satu fokus."
          description="Pilih bahan belajar di daftar, baca dengan nyaman, lalu tandai materi yang sudah Anda selesaikan."
          icon={BookOpenText}
        />
        <FilterBar>
          <label className="field-label">
            Cari materi
            <input
              className="field-input"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setSelectedId("");
              }}
              placeholder="Judul atau deskripsi"
            />
          </label>
          <label className="field-label">
            Course
            <RadixSelectField
              value={courseFilter}
              onValueChange={(value) => {
                setCourseFilter(value);
                setPage(1);
                setSelectedId("");
              }}
              placeholder="Semua course"
              options={[
                { value: "all", label: "Semua course" },
                ...courseOptions,
              ]}
            />
          </label>
        </FilterBar>
        {courses.isError ? (
          <ErrorState
            label="Pilihan course belum dapat dimuat."
            onRetry={() => void courses.refetch()}
          />
        ) : null}
        {materials.isLoading ? (
          <LoadingState label="Menyiapkan ruang baca…" />
        ) : null}
        {materials.isError ? (
          <ErrorState
            label="Materi belum dapat dimuat."
            onRetry={() => void materials.refetch()}
          />
        ) : null}
        {!materials.isLoading && !materials.isError && !items.length ? (
          <EmptyState
            title={
              search || courseFilter !== "all"
                ? "Materi tidak ditemukan"
                : "Materi belum tersedia"
            }
            description={
              search || courseFilter !== "all"
                ? "Coba kata pencarian lain atau pilih semua course."
                : "Materi yang dipublikasikan guru akan tersedia di ruang baca ini."
            }
          />
        ) : null}
        {selected ? (
          <div className="reading-workspace">
            <section aria-label="Daftar materi" className="min-w-0">
              <div className="collection-heading mb-4">
                <h2 className="section-title">Daftar materi</h2>
                <span className="count-label">
                  {materials.data?.meta.total} materi
                </span>
              </div>
              <div className="reading-index">
                {items.map((material) => (
                  <button
                    key={material.id}
                    type="button"
                    aria-pressed={selected.id === material.id}
                    className={cn(
                      "reading-index-item",
                      selected.id === material.id &&
                        "reading-index-item-active",
                    )}
                    onClick={() => {
                      setSelectedId(material.id);
                      requestAnimationFrame(() =>
                        readerHeading.current?.focus(),
                      );
                    }}
                  >
                    <span className="text-xs text-muted">
                      {material.course_name ??
                        courses.data?.find(
                          (course) => course.id === material.course_id,
                        )?.name}{" "}
                      · Materi {material.position}
                    </span>
                    <span className="mt-2 block text-sm font-semibold leading-6">
                      {material.title}
                    </span>
                    <span className="mt-3 flex items-center gap-2 text-xs text-primary">
                      {material.completed_at ? (
                        <>
                          <CheckCircle2 aria-hidden="true" size={14} /> Selesai
                          dipelajari
                        </>
                      ) : (
                        <>
                          Baca materi{" "}
                          <ArrowRight aria-hidden="true" size={14} />
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {materials.data ? (
                <Pagination
                  page={page}
                  totalPages={materials.data.meta.total_pages}
                  onPageChange={(value) => {
                    setPage(value);
                    setSelectedId("");
                  }}
                />
              ) : null}
            </section>
            <article className="learning-reader">
              <div className="learning-reader-heading">
                <div>
                  <p className="eyebrow">Materi {selected.position}</p>
                  <h2
                    ref={readerHeading}
                    tabIndex={-1}
                    className="mt-3 text-xl font-semibold leading-8"
                  >
                    {selected.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {selected.description}
                  </p>
                </div>
                {selected.completed_at ? (
                  <StatusBadge tone="success">
                    <CheckCircle2 aria-hidden="true" size={14} /> Selesai
                  </StatusBadge>
                ) : null}
              </div>
              <div className="learning-reader-body">{selected.content}</div>
              <div className="learning-reader-footer">
                <p className="text-xs leading-5 text-muted">
                  {selected.completed_at
                    ? "Materi ini sudah Anda tandai selesai."
                    : "Sudah memahami materi ini? Catat progres belajar Anda."}
                </p>
                {!selected.completed_at ? (
                  <Button
                    onClick={() => complete.mutate(selected.id)}
                    disabled={complete.isPending}
                  >
                    <CheckCircle2 aria-hidden="true" size={16} />
                    {complete.isPending && complete.variables === selected.id
                      ? "Menyimpan…"
                      : "Tandai selesai"}
                  </Button>
                ) : null}
              </div>
              {complete.variables === selected.id ? (
                <div className="px-6 pb-4">
                  <AsyncFeedback
                    error={complete.error}
                    isError={complete.isError}
                    isSuccess={complete.isSuccess}
                    errorMessage="Progres materi belum dapat disimpan."
                    successMessage="Progres belajar berhasil disimpan."
                  />
                </div>
              ) : null}
            </article>
          </div>
        ) : null}
      </div>
    </RoleBoundary>
  );
}
