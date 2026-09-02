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

export default function AcademicsPage() {
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
                  required
                />
              </label>
              <label className="field-label">
                Mulai
                <input
                  className="field-input"
                  type="date"
                  value={year.starts_on}
                  onChange={(e) =>
                    setYear({ ...year, starts_on: e.target.value })
                  }
                  required
                />
              </label>
              <label className="field-label">
                Selesai
                <input
                  className="field-input"
                  type="date"
                  value={year.ends_on}
                  onChange={(e) =>
                    setYear({ ...year, ends_on: e.target.value })
                  }
                  required
                />
              </label>
              <button className="button-primary md:col-span-2">
                Simpan tahun ajaran
              </button>
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
                <select
                  className="field-input"
                  value={group.academic_year_id}
                  onChange={(e) =>
                    setGroup({ ...group, academic_year_id: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih tahun ajaran</option>
                  {data.years.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Nama kelas
                <input
                  className="field-input"
                  value={group.name}
                  onChange={(e) => setGroup({ ...group, name: e.target.value })}
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
                  required
                />
              </label>
              <button className="button-primary md:col-span-2">
                Simpan kelas
              </button>
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
                  required
                />
              </label>
              <button className="button-primary md:col-span-2">
                Simpan mata pelajaran
              </button>
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
                  required
                />
              </label>
              <label className="field-label">
                Tahun ajaran
                <select
                  className="field-input"
                  value={course.academic_year_id}
                  onChange={(e) =>
                    setCourse({ ...course, academic_year_id: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih</option>
                  {data.years.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Kelas
                <select
                  className="field-input"
                  value={course.class_group_id}
                  onChange={(e) =>
                    setCourse({ ...course, class_group_id: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih</option>
                  {data.classes.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label md:col-span-2">
                Mata pelajaran
                <select
                  className="field-input"
                  value={course.subject_id}
                  onChange={(e) =>
                    setCourse({ ...course, subject_id: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih</option>
                  {data.subjects.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} — {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="button-primary md:col-span-2">
                Simpan course
              </button>
            </form>
          </section>
        </div>
        <CourseAssignments />
        <CourseTable courses={data.courses.data?.data ?? []} />
      </div>
    </RoleBoundary>
  );
}
