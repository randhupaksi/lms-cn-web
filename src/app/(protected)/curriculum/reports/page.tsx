import { RoleBoundary } from "@/components/role-boundary";
import { ReportsWorkspace } from "@/features/governance";

export default function CurriculumReportsPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <ReportsWorkspace />
    </RoleBoundary>
  );
}
