import type { Metadata } from "next";
import { QuestionBankWorkspace } from "@/features/questions/components/question-bank-workspace";

export const metadata: Metadata = { title: "Bank soal · Guru" };

export default function QuestionsPage() {
  return <QuestionBankWorkspace />;
}
