"use client";

import { useRef, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel = "Memproses…",
  pending = false,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  pending?: boolean;
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
        <Dialog.Popup className="confirmation-dialog" initialFocus={cancelRef}>
          <Dialog.Title className="text-lg font-semibold leading-7">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-7 text-muted">
            {description}
          </Dialog.Description>
          {children}
          <div className="dialog-actions">
            <Dialog.Close
              ref={cancelRef}
              className="button-secondary"
              disabled={pending}
            >
              Batal
            </Dialog.Close>
            <Button onClick={onConfirm} disabled={pending}>
              {pending ? pendingLabel : confirmLabel}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
