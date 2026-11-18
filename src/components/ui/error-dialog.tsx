"use client";

import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";

export function ErrorDialog({
  message,
}: {
  message: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} disablePointerDismissal>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup
          className="confirmation-dialog error-dialog"
          role="alertdialog"
          initialFocus={closeRef}
        >
          <div className="error-dialog-heading">
            <span className="error-dialog-icon" aria-hidden="true">
              <AlertCircle size={20} />
            </span>
            <div className="error-dialog-copy">
              <Dialog.Title className="text-lg font-semibold leading-7">
                Tindakan belum berhasil
              </Dialog.Title>
              <Dialog.Description className="error-dialog-description">
                {message}
              </Dialog.Description>
            </div>
          </div>
          <div className="dialog-actions">
            <Dialog.Close ref={closeRef} className="button-primary">
              Tutup
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
