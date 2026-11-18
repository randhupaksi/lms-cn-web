import type { Metadata } from "next";
import { ExamAuthoringWorkspace } from "@/features/exams/components/exam-authoring-workspace";

export const metadata: Metadata = { title: "Kelola ujian · Guru" };

export default function ExamsPage() {
  return <ExamAuthoringWorkspace />;
}
