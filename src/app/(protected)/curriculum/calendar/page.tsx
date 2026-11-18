import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { CalendarWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Kalender sekolah · Kurikulum" };

export default function CurriculumCalendarPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <CalendarWorkspace />
    </RoleBoundary>
  );
}
