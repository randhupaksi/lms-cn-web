"use client";
import { Database, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useQuality } from "../use-governance";
import { QueryState, WorkspaceLink } from "./governance-shared";

export function QualityWorkspace() {
  const query = useQuality();
  const groups = query.data ?? [];
  const total = groups.reduce((n, g) => n + g.count, 0);
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow="Mutu data"
        title="Kelengkapan yang bisa ditindaklanjuti"
        description="Temukan keterkaitan akademik yang belum lengkap, lalu koordinasikan perbaikannya."
        icon={Database}
      />
      <QueryState query={query} />
      {query.data && (
        <>
          <div className="quality-summary">
            <strong>{total}</strong>
            <div>
              <h2>
                temuan di {groups.filter((g) => g.count > 0).length} kategori
              </h2>
              <p>
                Satu data dapat muncul dalam lebih dari satu pemeriksaan. Setiap
                kategori menampilkan hingga 8 contoh.
              </p>
            </div>
          </div>
          <div className="quality-grid">
            {groups.map((group, index) => (
              <section
                className={`quality-group ${group.count === 0 ? "is-complete" : ""}`}
                key={group.key}
              >
                <div className="quality-group-heading">
                  <span className="quality-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="quality-count">
                    {group.count === 0 ? (
                      <CheckCircle2 size={20} aria-label="Lengkap" />
                    ) : (
                      group.count
                    )}
                  </span>
                </div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
                {group.samples.length > 0 ? (
                  <ul className="quality-samples">
                    {group.samples.map((sample) => (
                      <li key={sample.id}>{sample.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="quality-healthy">
                    Pemeriksaan ini sudah lengkap.
                  </p>
                )}
                <WorkspaceLink
                  href={
                    group.key.startsWith("exams")
                      ? "/superadmin/exams"
                      : group.key.startsWith("courses")
                        ? "/admin/academics"
                        : "/superadmin/users"
                  }
                >
                  Buka pengelolaan
                </WorkspaceLink>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
