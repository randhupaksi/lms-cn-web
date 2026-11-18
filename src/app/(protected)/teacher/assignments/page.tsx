import type { Metadata } from "next";
import { TeacherAssignmentsWorkspace } from "@/features/assignments/components/teacher-assignments-workspace";

export const metadata: Metadata = { title: "Tugas · Guru" };

export default function TeacherAssignmentsPage() {
  return <TeacherAssignmentsWorkspace />;
}
