import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { CalendarWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Kalender ujian · Kepala sekolah" };

export default function Page() {
  return (
    <RoleBoundary allow={["principal"]}>
      <CalendarWorkspace />
    </RoleBoundary>
  );
}
