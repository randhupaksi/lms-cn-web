import type { Metadata } from "next";
import { AuditWorkspace } from "@/features/audit/components/audit-workspace";

export const metadata: Metadata = { title: "Audit aktivitas · Admin" };

export default function AuditPage() {
  return <AuditWorkspace />;
}
