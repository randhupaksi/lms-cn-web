import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

export function FilterBar({
  children,
  description,
}: {
  children: ReactNode;
  description?: string;
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-label">
        <SlidersHorizontal aria-hidden="true" size={16} />
        <span>{description ?? "Cari & filter"}</span>
      </div>
      <div className="filter-bar-fields">{children}</div>
    </div>
  );
}
