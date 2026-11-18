import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { ReportsWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Laporan sekolah · Kurikulum" };

export default function CurriculumReportsPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <ReportsWorkspace />
    </RoleBoundary>
  );
}
