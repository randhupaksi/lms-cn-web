import type { Metadata } from "next";
import { StudentResultsWorkspace } from "@/features/results/components/student-results-workspace";

export const metadata: Metadata = { title: "Hasil ujian · Siswa" };

export default function StudentResultsPage() {
  return <StudentResultsWorkspace />;
}
