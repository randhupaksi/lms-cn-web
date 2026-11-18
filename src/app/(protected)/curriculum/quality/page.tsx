import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { QualityWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Mutu sekolah · Kurikulum" };

export default function CurriculumQualityPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <QualityWorkspace />
    </RoleBoundary>
  );
}
