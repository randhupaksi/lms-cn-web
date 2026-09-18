"use client";

import { useParams } from "next/navigation";
import { AttemptWorkspace } from "@/features/attempts/components/attempt-workspace";

export default function AttemptPage() {
  const attemptId = useParams<{ attemptId: string }>().attemptId;
  return <AttemptWorkspace attemptId={attemptId} />;
}
