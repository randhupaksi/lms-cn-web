import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { ReadinessWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Kesiapan ujian · Kepala sekolah" };

export default function Page() {
  return (
    <RoleBoundary allow={["principal"]}>
      <ReadinessWorkspace />
    </RoleBoundary>
  );
}
