import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { ReadinessWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Kesiapan ujian · Kurikulum" };

export default function CurriculumExamsPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <ReadinessWorkspace />
    </RoleBoundary>
  );
}
