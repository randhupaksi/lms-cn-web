import type { Metadata } from "next";
import { StudentExamsWorkspace } from "@/features/attempts/components/student-exams-workspace";

export const metadata: Metadata = { title: "Ujian saya · Siswa" };

export default function StudentExamsPage() {
  return <StudentExamsWorkspace />;
}
