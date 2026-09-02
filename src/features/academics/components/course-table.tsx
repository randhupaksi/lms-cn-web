import type { Course } from "@/types/lms";

export function CourseTable({ courses }: Readonly<{ courses: Course[] }>) {
  return (
    <section className="panel overflow-hidden p-0">
      <div className="border-b border-border p-5">
        <h2 className="section-title">Course aktif</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Mata pelajaran</th>
              <th>Kelas</th>
              <th>Tahun ajaran</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((item) => (
              <tr key={item.id}>
                <td className="font-semibold">{item.name}</td>
                <td>{item.subject.name}</td>
                <td>{item.class_group.name}</td>
                <td>{item.academic_year.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
