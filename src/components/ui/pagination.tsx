import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  label?: string;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  label = "Navigasi halaman",
}: PaginationProps) {
  const safeTotal = Math.max(totalPages, 1);
  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-sm"
      aria-label={label}
    >
      <p className="text-muted" aria-live="polite">
        Halaman {Math.min(page, safeTotal)} dari {safeTotal}
      </p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="compact"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Sebelumnya
        </Button>
        <Button
          variant="ghost"
          size="compact"
          disabled={disabled || page >= safeTotal}
          onClick={() => onPageChange(page + 1)}
        >
          Berikutnya
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
