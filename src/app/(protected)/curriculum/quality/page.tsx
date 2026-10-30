import { RoleBoundary } from "@/components/role-boundary";
import { QualityWorkspace } from "@/features/governance";

export default function CurriculumQualityPage() {
  return (
    <RoleBoundary allow={["curriculum"]}>
      <QualityWorkspace />
    </RoleBoundary>
  );
}
