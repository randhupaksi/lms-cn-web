import type { ReactNode } from "react";
import { AlertCircle, Inbox, LoaderCircle, LockKeyhole, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Memuat data…" }: { label?: string }) {
  return (
    <div className="state-panel" role="status" aria-live="polite">
      <div>
        <span className="metric-icon mx-auto animate-pulse">
          <LoaderCircle className="animate-spin" size={19} />
        </span>
        <p className="mt-3 text-sm font-semibold text-muted">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({
  label = "Data belum dapat dimuat.",
  onRetry,
}: {
  label?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state-panel border-danger/20 bg-danger-soft" role="alert">
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-background text-danger">
          <AlertCircle size={19} />
        </span>
        <p className="mt-3 text-sm font-semibold text-danger">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted">Coba muat ulang halaman atau periksa koneksi Anda.</p>
        {onRetry ? <Button className="mt-4" variant="secondary" onClick={onRetry}>Coba lagi</Button> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-panel">
      <div>
      <span className="metric-icon mx-auto">
        <Inbox size={20} />
      </span>
      <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}

export function SelectionState({
  title = "Pilih course terlebih dahulu",
  description = "Pilih course untuk menampilkan informasi dan tindakan yang tersedia.",
}: { title?: string; description?: string }) {
  return (
    <div className="state-panel selection-prompt" role="status">
      <div>
        <span className="metric-icon mx-auto"><ListFilter size={20} /></span>
        <h2 className="mt-3 text-sm font-semibold text-foreground">{title}</h2>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}

export function PermissionDeniedState({
  title = "Akses tidak tersedia",
  description = "Akun Anda tidak memiliki izin untuk membuka bagian ini.",
}: { title?: string; description?: string }) {
  return (
    <div className="state-panel" role="alert">
      <div>
        <span className="metric-icon mx-auto"><LockKeyhole size={20} /></span>
        <h2 className="mt-3 text-sm font-semibold text-foreground">{title}</h2>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}
