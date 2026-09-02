import { AlertCircle, Inbox } from "lucide-react";

export function LoadingState({ label = "Memuat data…" }: { label?: string }) {
  return (
    <div className="panel animate-pulse text-sm text-muted" role="status">
      {label}
    </div>
  );
}

export function ErrorState({
  label = "Data belum dapat dimuat.",
}: {
  label?: string;
}) {
  return (
    <div
      className="panel flex items-center gap-3 text-sm text-danger"
      role="alert"
    >
      <AlertCircle size={18} />
      {label}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="panel py-10 text-center">
      <Inbox className="mx-auto text-muted" size={24} />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}
