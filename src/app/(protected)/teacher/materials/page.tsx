import type { Metadata } from "next";
import { TeacherMaterialsWorkspace } from "@/features/materials/components/teacher-materials-workspace";

export const metadata: Metadata = { title: "Materi pembelajaran · Guru" };

export default function TeacherMaterialsPage() {
  return <TeacherMaterialsWorkspace />;
}
