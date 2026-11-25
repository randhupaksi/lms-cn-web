import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { CalendarWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Kalender ujian · Superadmin" };

export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <CalendarWorkspace />
    </RoleBoundary>
  );
}
