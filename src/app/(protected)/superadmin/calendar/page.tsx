import { RoleBoundary } from "@/components/role-boundary";
import { CalendarWorkspace } from "@/features/governance";
export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <CalendarWorkspace />
    </RoleBoundary>
  );
}
