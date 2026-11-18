"use client";

import { useRef, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

export function FormDialog({
  id,
  eyebrow,
  title,
  description,
  onClose,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      disablePointerDismissal
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup
          id={id}
          className="form-dialog"
          initialFocus={titleRef}
        >
          <header className="form-dialog-header">
            <div className="min-w-0">
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              <Dialog.Title
                ref={titleRef}
                tabIndex={-1}
                className="section-title form-dialog-title"
              >
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="section-description">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close
              className="button-ghost form-dialog-close"
              aria-label={`Tutup ${title}`}
            >
              <X aria-hidden="true" size={18} />
            </Dialog.Close>
          </header>
          <div className="form-dialog-body">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
