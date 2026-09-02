"use client";

import { useState } from "react";
import { BookOpenText, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { RoleBoundary } from "@/components/role-boundary";
import { useCourses } from "@/features/academics/use-academics";
import {
  useCompleteMaterial,
  useMaterials,
} from "@/features/materials/use-materials";

export default function StudentMaterialsPage() {
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
          <select
            className="field-input"
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
          >
            <option value="">Pilih course</option>
            {courses.data?.data.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        {materials.isLoading && <LoadingState />}
        {materials.isError && <ErrorState label="Materi belum dapat dimuat." />}
        {materials.data?.length === 0 && (
          <EmptyState
            title="Belum ada materi"
            description="Guru belum mempublikasikan materi pada course ini."
          />
        )}
        {materials.data?.map((material) => (
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
                <span className="status-badge status-active">
                  <CheckCircle2 size={14} /> Selesai
                </span>
              )}
            </div>
            <div className="mt-5 whitespace-pre-wrap text-sm leading-7">
              {material.content}
            </div>
            {!material.completed_at && (
              <button
                className="button-primary mt-5"
                onClick={() => complete.mutate(material.id)}
                disabled={complete.isPending}
              >
                Tandai selesai
              </button>
            )}
          </article>
        ))}
      </div>
    </RoleBoundary>
  );
}
