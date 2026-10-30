import { RoleBoundary } from "@/components/role-boundary";
import { CalendarWorkspace } from "@/features/governance";

export default function CurriculumCalendarPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <CalendarWorkspace />
    </RoleBoundary>
  );
}
