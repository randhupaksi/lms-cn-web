import type { Metadata } from "next";
import { AcademicsWorkspace } from "@/features/academics/components/academics-workspace";

export const metadata: Metadata = { title: "Akademik · Admin" };

export default function AcademicsPage() {
  return <AcademicsWorkspace />;
}
