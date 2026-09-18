"use client";

import { useParams } from "next/navigation";
import { ExamConfigurationWorkspace } from "@/features/exams/components/exam-configuration-workspace";

export default function ConfigureExamPage() {
  const examId = useParams<{ examId: string }>().examId;
  return <ExamConfigurationWorkspace examId={examId} />;
}
