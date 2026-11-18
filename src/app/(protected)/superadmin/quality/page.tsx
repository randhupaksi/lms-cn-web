import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { QualityWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Mutu sekolah · Superadmin" };

export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <QualityWorkspace />
    </RoleBoundary>
  );
}
