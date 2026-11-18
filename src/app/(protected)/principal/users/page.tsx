import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { AccessWorkspace } from "@/features/users/components/access-workspace";

export const metadata: Metadata = { title: "Kelola pengguna · Kepala sekolah" };

export default function Page() {
  return (
    <RoleBoundary allow={["principal"]}>
      <AccessWorkspace />
    </RoleBoundary>
  );
}
