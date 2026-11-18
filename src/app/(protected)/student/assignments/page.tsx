import type { Metadata } from "next";
import { StudentAssignmentsWorkspace } from "@/features/assignments/components/student-assignments-workspace";

export const metadata: Metadata = { title: "Tugas · Siswa" };

export default function StudentAssignmentsPage() {
  return <StudentAssignmentsWorkspace />;
}
