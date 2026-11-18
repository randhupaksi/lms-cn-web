import type { Metadata } from "next";
import { TeacherResultsWorkspace } from "@/features/results/components/teacher-results-workspace";

export const metadata: Metadata = { title: "Hasil ujian · Guru" };

export default function TeacherResultsPage() {
  return <TeacherResultsWorkspace />;
}
