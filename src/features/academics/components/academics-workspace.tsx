"use client";

import { useState, type FormEvent } from "react";
import { RoleBoundary } from "@/components/role-boundary";
import {
  useAcademicData,
  useCreateAcademicYear,
  useCreateClassGroup,
  useCreateCourse,
  useCreateSubject,
} from "@/features/academics/use-academics";
import { CourseAssignments } from "@/features/academics/components/course-assignments";
import { CourseTable } from "@/features/academics/components/course-table";
import { PageHeader } from "@/components/ui/page-header";
import { School } from "lucide-react";
import { DatePickerField } from "@/components/ui/date-picker";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";

export function AcademicsWorkspace() {
  const data = useAcademicData();
  const createYear = useCreateAcademicYear();
  const createClass = useCreateClassGroup();
  const createSubject = useCreateSubject();
  const createCourse = useCreateCourse();
  const [year, setYear] = useState({
    name: "",
    starts_on: "",
    ends_on: "",
    status: "active",
  });
  const [group, setGroup] = useState({
    academic_year_id: "",
    name: "",
    grade_level: 12,
  });
  const [subject, setSubject] = useState({ code: "", name: "" });
  const [course, setCourse] = useState({
    academic_year_id: "",
    class_group_id: "",
    subject_id: "",
    name: "",
  });
  const submit = (action: () => void) => (event: FormEvent) => {
    event.preventDefault();
    action();
  };
  return (
    <RoleBoundary allow={["admin"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Struktur akademik"
          title="Akademik"
          description="Susun tahun ajaran, kelas, mata pelajaran, dan course sebagai fondasi seluruh aktivitas LMS."
          icon={School}
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="panel">
            <h2 className="section-title">Tahun ajaran</h2>
            <form
              className="form-grid"
              onSubmit={submit(() => createYear.mutate(year))}
            >
              <label className="field-label md:col-span-2">
                Nama
                <input
                  className="field-input"
                  value={year.name}
                  onChange={(e) => setYear({ ...year, name: e.target.value })}
                  placeholder="Contoh: Tahun Ajaran 2026/2027"
                  required
                />
              </label>
              <label className="field-label">
                Mulai
                <DatePickerField
                  value={year.starts_on}
                  onChange={(value) => setYear({ ...year, starts_on: value })}
                  required
                />
              </label>
              <label className="field-label">
                Selesai
                <DatePickerField
                  value={year.ends_on}
                  onChange={(value) => setYear({ ...year, ends_on: value })}
                  required
                />
              </label>
              <button
                className="button-primary md:col-span-2"
                disabled={
                  createYear.isPending ||
                  !year.name ||
                  !year.starts_on ||
                  !year.ends_on
                }
              >
                {createYear.isPending ? "Menyimpan…" : "Simpan tahun ajaran"}
              </button>
              <div className="md:col-span-2">
                <AsyncFeedback
                  error={createYear.error}
                  isError={createYear.isError}
                  isSuccess={createYear.isSuccess}
                  errorMessage="Tahun ajaran belum dapat disimpan."
                  successMessage="Tahun ajaran berhasil disimpan."
                />
              </div>
            </form>
          </section>
          <section className="panel">
            <h2 className="section-title">Kelas</h2>
            <form
              className="form-grid"
              onSubmit={submit(() => createClass.mutate(group))}
            >
              <label className="field-label md:col-span-2">
                Tahun ajaran
                <RadixSelectField
                  value={group.academic_year_id}
                  onValueChange={(value) => setGroup({ ...group, academic_year_id: value })}
                  placeholder="Pilih tahun ajaran"
                  options={data.years.data?.map((item) => ({ value: item.id, label: item.name })) ?? []}
                />
              </label>
              <label className="field-label">
                Nama kelas
                <input
                  className="field-input"
                  value={group.name}
                  onChange={(e) => setGroup({ ...group, name: e.target.value })}
                  placeholder="Contoh: XII IPA 1"
                  required
                />
              </label>
              <label className="field-label">
                Tingkat
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  max={12}
                  value={group.grade_level}
                  onChange={(e) =>
                    setGroup({ ...group, grade_level: Number(e.target.value) })
                  }
                  placeholder="Contoh: 12"
                  required
                />
              </label>
              <button
                className="button-primary md:col-span-2"
                disabled={
                  createClass.isPending ||
                  !group.academic_year_id ||
                  !group.name
                }
              >
                {createClass.isPending ? "Menyimpan…" : "Simpan kelas"}
              </button>
              <div className="md:col-span-2">
                <AsyncFeedback
                  error={createClass.error}
                  isError={createClass.isError}
                  isSuccess={createClass.isSuccess}
                  errorMessage="Kelas belum dapat disimpan."
                  successMessage="Kelas berhasil disimpan."
                />
              </div>
            </form>
          </section>
          <section className="panel">
            <h2 className="section-title">Mata pelajaran</h2>
            <form
              className="form-grid"
              onSubmit={submit(() => createSubject.mutate(subject))}
            >
              <label className="field-label">
                Kode
                <input
                  className="field-input"
                  value={subject.code}
                  onChange={(e) =>
                    setSubject({ ...subject, code: e.target.value })
                  }
                  placeholder="Contoh: MAT-XII"
                  required
                />
              </label>
              <label className="field-label">
                Nama
                <input
                  className="field-input"
                  value={subject.name}
                  onChange={(e) =>
                    setSubject({ ...subject, name: e.target.value })
                  }
                  placeholder="Contoh: Matematika"
                  required
                />
              </label>
              <button
                className="button-primary md:col-span-2"
                disabled={createSubject.isPending || !subject.code || !subject.name}
              >
                {createSubject.isPending ? "Menyimpan…" : "Simpan mata pelajaran"}
              </button>
              <div className="md:col-span-2">
                <AsyncFeedback
                  error={createSubject.error}
                  isError={createSubject.isError}
                  isSuccess={createSubject.isSuccess}
                  errorMessage="Mata pelajaran belum dapat disimpan."
                  successMessage="Mata pelajaran berhasil disimpan."
                />
              </div>
            </form>
          </section>
          <section className="panel">
            <h2 className="section-title">Course</h2>
            <form
              className="form-grid"
              onSubmit={submit(() => createCourse.mutate(course))}
            >
              <label className="field-label md:col-span-2">
                Nama course
                <input
                  className="field-input"
                  value={course.name}
                  onChange={(e) =>
                    setCourse({ ...course, name: e.target.value })
                  }
                  placeholder="Contoh: Matematika XII IPA 1"
                  required
                />
              </label>
              <label className="field-label">
                Tahun ajaran
                <RadixSelectField
                  value={course.academic_year_id}
                  onValueChange={(value) => setCourse({ ...course, academic_year_id: value })}
                  placeholder="Pilih tahun ajaran"
                  options={data.years.data?.map((item) => ({ value: item.id, label: item.name })) ?? []}
                />
              </label>
              <label className="field-label">
                Kelas
                <RadixSelectField
                  value={course.class_group_id}
                  onValueChange={(value) => setCourse({ ...course, class_group_id: value })}
                  placeholder="Pilih kelas"
                  options={data.classes.data?.map((item) => ({ value: item.id, label: item.name })) ?? []}
                />
              </label>
              <label className="field-label md:col-span-2">
                Mata pelajaran
                <RadixSelectField
                  value={course.subject_id}
                  onValueChange={(value) => setCourse({ ...course, subject_id: value })}
                  placeholder="Pilih mata pelajaran"
                  options={data.subjects.data?.map((item) => ({ value: item.id, label: `${item.code} — ${item.name}` })) ?? []}
                />
              </label>
              <button
                className="button-primary md:col-span-2"
                disabled={
                  createCourse.isPending ||
                  !course.name ||
                  !course.academic_year_id ||
                  !course.class_group_id ||
                  !course.subject_id
                }
              >
                {createCourse.isPending ? "Menyimpan…" : "Simpan course"}
              </button>
              <div className="md:col-span-2">
                <AsyncFeedback
                  error={createCourse.error}
                  isError={createCourse.isError}
                  isSuccess={createCourse.isSuccess}
                  errorMessage="Course belum dapat disimpan."
                  successMessage="Course berhasil disimpan."
                />
              </div>
            </form>
          </section>
        </div>
        <CourseAssignments />
        <CourseTable courses={data.courses.data?.data ?? []} />
      </div>
    </RoleBoundary>
  );
}
