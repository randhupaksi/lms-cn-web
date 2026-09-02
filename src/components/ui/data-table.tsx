import type { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function DataTableShell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("data-table-shell", className)} {...props} />;
}

export function DataTable({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("data-table", className)} {...props} />;
}
