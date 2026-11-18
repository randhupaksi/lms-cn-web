"use client";

import { useEffect, useId, useRef, useState, type HTMLAttributes, type TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function DataTableShell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("data-table-shell", className)} {...props} />;
}

export function DataTable({ caption, className, children, ...props }: TableHTMLAttributes<HTMLTableElement> & { caption: string }) {
  const captionId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const container = viewport.current;
    const content = table.current;
    if (!container || !content) return;
    function update() {
      if (container) setHasOverflow(container.scrollWidth > container.clientWidth);
    }
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);
    update();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-w-0">
      {hasOverflow && <p className="table-scroll-hint">Gulir ke samping untuk melihat kolom lainnya.</p>}
      <div
        ref={viewport}
        className="table-scroll"
        role={hasOverflow ? "region" : undefined}
        aria-labelledby={hasOverflow ? captionId : undefined}
        tabIndex={hasOverflow ? 0 : undefined}
      >
        <table ref={table} className={cn("data-table", className)} {...props}>
          <caption id={captionId} className="sr-only">{caption}</caption>
          {children}
        </table>
      </div>
    </div>
  );
}
