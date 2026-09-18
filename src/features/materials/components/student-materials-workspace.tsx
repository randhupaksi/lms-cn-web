"use client";

import { useState } from "react";
import { BookOpenText, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState, SelectionState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useCourses } from "@/features/academics";
import {
  useCompleteMaterial,
  useMaterials,
} from "@/features/materials/use-materials";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export function StudentMaterialsWorkspace() {
  const courses = useCourses();
  const [courseId, setCourseId] = useState("");
  const materials = useMaterials(courseId);
  const complete = useCompleteMaterial(courseId);
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Course saya"
          title="Materi pembelajaran"
          description="Pelajari materi yang telah dipublikasikan dan tandai ketika selesai."
          icon={BookOpenText}
        />
        <label className="field-label max-w-lg">
          Course
          <RadixSelectField
            value={courseId}
            onValueChange={setCourseId}
            placeholder="Pilih course"
            options={courses.data?.data.map((course) => ({ value: course.id, label: course.name })) ?? []}
          />
        </label>
        {courses.isLoading && <LoadingState label="Memuat daftar course…" />}
        {courses.isError && <ErrorState label="Course belum dapat dimuat." onRetry={() => void courses.refetch()} />}
        {!courses.isLoading && !courses.isError && courses.data?.data.length === 0 && (
          <EmptyState title="Belum ada course" description="Anda belum terdaftar pada course yang memiliki materi." />
        )}
        {!courseId && courses.data?.data.length ? <SelectionState /> : null}
        {courseId && materials.isLoading && <LoadingState label="Memuat materi…" />}
        {courseId && materials.isError && <ErrorState label="Materi belum dapat dimuat." onRetry={() => void materials.refetch()} />}
        {courseId && materials.data?.length === 0 && (
          <EmptyState
            title="Belum ada materi"
            description="Guru belum mempublikasikan materi pada course ini."
          />
        )}
        {courseId && materials.data?.map((material) => (
          <article className="panel panel-interactive" key={material.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-muted">
                  MATERI {material.position}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{material.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {material.description}
                </p>
              </div>
              {material.completed_at && (
                <StatusBadge tone="success">
                  <CheckCircle2 aria-hidden="true" size={14} /> Selesai
                </StatusBadge>
              )}
            </div>
            <div className="mt-5 whitespace-pre-wrap text-sm leading-7">
              {material.content}
            </div>
            {!material.completed_at && (
              <div>
                <Button
                  className="mt-5"
                  onClick={() => complete.mutate(material.id)}
                  disabled={complete.isPending}
                >
                  {complete.isPending && complete.variables === material.id
                    ? "Menyimpan…"
                    : "Tandai selesai"}
                </Button>
                {complete.variables === material.id ? (
                  <AsyncFeedback
                    error={complete.error}
                    isError={complete.isError}
                    isSuccess={false}
                    errorMessage="Progres materi belum dapat disimpan."
                    successMessage=""
                  />
                ) : null}
              </div>
            )}
          </article>
        ))}
      </div>
    </RoleBoundary>
  );
}
