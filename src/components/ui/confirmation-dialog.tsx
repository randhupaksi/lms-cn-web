"use client";

import { useRef, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: DialogIcon,
  intent = "neutral",
  confirmLabel,
  confirmVariant = "primary",
  pendingLabel = "Memproses…",
  pending = false,
  confirmDisabled = false,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  icon?: LucideIcon;
  intent?: "neutral" | "success" | "danger";
  confirmLabel: string;
  confirmVariant?: "primary" | "secondary" | "ghost" | "danger";
  pendingLabel?: string;
  pending?: boolean;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  children?: ReactNode;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!pending) onOpenChange(value);
      }}
      disablePointerDismissal
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup
          className={cn(
            "confirmation-dialog",
            intent !== "neutral" && `confirmation-dialog-intent-${intent}`,
          )}
          initialFocus={cancelRef}
        >
          <div className="confirmation-dialog-heading">
            {DialogIcon ? (
              <span className="confirmation-dialog-icon" aria-hidden="true">
                <DialogIcon size={22} />
              </span>
            ) : null}
            <div className="confirmation-dialog-copy">
              <Dialog.Title className="text-lg font-semibold leading-7">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm leading-7 text-muted">
                {description}
              </Dialog.Description>
            </div>
          </div>
          {children}
          <div className="dialog-actions">
            <Dialog.Close
              ref={cancelRef}
              className="button-secondary"
              disabled={pending}
            >
              Batal
            </Dialog.Close>
            <Button
              variant={confirmVariant}
              className="confirmation-dialog-confirm"
              onClick={onConfirm}
              disabled={pending || confirmDisabled}
            >
              {pending ? pendingLabel : confirmLabel}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
