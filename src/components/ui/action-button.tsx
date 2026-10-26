"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { Tooltip } from "@base-ui/react/tooltip";
import { LoaderCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function ActionTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip.Root>
      {children}
      <Tooltip.Portal>
        <Tooltip.Positioner
          side="top"
          sideOffset={8}
          className="action-tooltip-positioner"
        >
          <Tooltip.Popup className="action-tooltip">{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function ActionButton({
  label,
  icon: Icon,
  pending = false,
  tone = "neutral",
  disabled,
  className,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon: LucideIcon;
  pending?: boolean;
  tone?: "neutral" | "danger";
}) {
  return (
    <ActionTooltip label={pending ? "Memproses…" : label}>
      <Tooltip.Trigger
        render={
          <Button variant="ghost" size="icon" disabled={disabled || pending} />
        }
        className={cn(
          "row-action",
          tone === "danger" && "row-action-danger",
          className,
        )}
        aria-label={label}
        aria-busy={pending || undefined}
        {...props}
      >
        {pending ? (
          <LoaderCircle size={17} aria-hidden="true" className="animate-spin" />
        ) : (
          <Icon size={17} aria-hidden="true" />
        )}
      </Tooltip.Trigger>
    </ActionTooltip>
  );
}

export function ActionLink<T extends string>({
  label,
  icon: Icon,
  href,
}: {
  label: string;
  icon: LucideIcon;
  href: Route<T>;
}) {
  return (
    <ActionTooltip label={label}>
      <Tooltip.Trigger
        render={<Link href={href} />}
        className="row-action"
        aria-label={label}
      >
        <Icon size={17} aria-hidden="true" />
      </Tooltip.Trigger>
    </ActionTooltip>
  );
}
