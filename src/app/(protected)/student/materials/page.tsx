import type { Metadata } from "next";
import { StudentMaterialsWorkspace } from "@/features/materials/components/student-materials-workspace";

export const metadata: Metadata = { title: "Materi pembelajaran · Siswa" };

export default function StudentMaterialsPage() {
  return <StudentMaterialsWorkspace />;
}
