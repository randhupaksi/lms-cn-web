import { RoleBoundary } from "@/components/role-boundary";
import { ReadinessWorkspace } from "@/features/governance";

export default function CurriculumExamsPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <ReadinessWorkspace />
    </RoleBoundary>
  );
}
