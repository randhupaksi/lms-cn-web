"use client";

import { useState } from "react";
import {
  useAcademicData,
  useAssignCourseMembers,
  useCourseMembers,
} from "@/features/academics/use-academics";
import { useUsers } from "@/features/users/use-users";

export function CourseAssignments() {
  const data = useAcademicData();
  const [courseId, setCourseId] = useState("");
  const members = useCourseMembers(courseId);
  const assignments = useAssignCourseMembers(courseId);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const teachers = useUsers({
    role: "teacher",
    search: teacherSearch,
    per_page: 100,
  });
  const students = useUsers({
    role: "student",
    search: studentSearch,
    per_page: 100,
  });
  const [teacherChanges, setTeacherChanges] = useState<string[] | null>(null);
  const [studentChanges, setStudentChanges] = useState<string[] | null>(null);
  const selectedTeachers =
    teacherChanges ?? members.data?.teachers.map((item) => item.id) ?? [];
  const selectedStudents =
    studentChanges ?? members.data?.students.map((item) => item.id) ?? [];

  return (
    <section className="panel">
      <h2 className="section-title">Assignment course</h2>
      <p className="mt-2 text-sm text-muted">
        Tetapkan guru pengelola dan siswa peserta sebelum membuat soal atau
        ujian.
      </p>
      <label className="field-label mt-5 max-w-lg">
        Course
        <select
          className="field-input"
          value={courseId}
          onChange={(event) => {
            setCourseId(event.target.value);
            setTeacherChanges(null);
            setStudentChanges(null);
          }}
        >
          <option value="">Pilih course</option>
          {data.courses.data?.data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {courseId && (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <MemberSelector
            title="Guru pengelola"
            placeholder="Cari guru…"
            search={teacherSearch}
            onSearch={setTeacherSearch}
            users={teachers.data?.data ?? []}
            selected={selectedTeachers}
            onChange={setTeacherChanges}
          />
          <MemberSelector
            title="Siswa peserta"
            placeholder="Cari siswa…"
            search={studentSearch}
            onSearch={setStudentSearch}
            users={students.data?.data ?? []}
            selected={selectedStudents}
            onChange={setStudentChanges}
          />
        </div>
      )}
      {courseId && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="button-primary"
            disabled={
              assignments.teachers.isPending || selectedTeachers.length === 0
            }
            onClick={() => assignments.teachers.mutate(selectedTeachers)}
          >
            Simpan guru
          </button>
          <button
            className="button-primary"
            disabled={
              assignments.students.isPending || selectedStudents.length === 0
            }
            onClick={() => assignments.students.mutate(selectedStudents)}
          >
            Simpan siswa
          </button>
        </div>
      )}
    </section>
  );
}

type Member = { id: string; full_name: string; identifier: string };
function MemberSelector({
  title,
  placeholder,
  search,
  onSearch,
  users,
  selected,
  onChange,
}: Readonly<{
  title: string;
  placeholder: string;
  search: string;
  onSearch: (value: string) => void;
  users: Member[];
  selected: string[];
  onChange: (ids: string[]) => void;
}>) {
  return (
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      <input
        className="field-input mt-3"
        type="search"
        placeholder={placeholder}
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
        {users.map((user) => (
          <label
            className="selection-item flex items-center gap-3 p-3 text-sm"
            key={user.id}
          >
            <input
              type="checkbox"
              checked={selected.includes(user.id)}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...selected, user.id]
                    : selected.filter((id) => id !== user.id),
                )
              }
            />
            <span>
              <span className="block font-semibold">{user.full_name}</span>
              <span className="text-xs text-muted">{user.identifier}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
