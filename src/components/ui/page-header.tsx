import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  icon?: LucideIcon;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <div className="page-header-actions">
          {actions ??
            (Icon ? (
              <span className="page-header-icon">
                <Icon aria-hidden="true" size={25} />
              </span>
            ) : null)}
        </div>
      </div>
    </header>
  );
}
