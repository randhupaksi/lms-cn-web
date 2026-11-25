"use client";

import { useRef, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X, type LucideIcon } from "lucide-react";

export function FormDialog({
  id,
  icon: HeaderIcon,
  eyebrow,
  title,
  description,
  onClose,
  dismissible = true,
  footer,
  children,
}: {
  id: string;
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  onClose: () => void;
  dismissible?: boolean;
  footer: ReactNode;
  children: ReactNode;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && dismissible) onClose();
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
            <div className="form-dialog-heading">
              <span className="form-dialog-icon" aria-hidden="true">
                <HeaderIcon size={22} />
              </span>
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
            </div>
            {dismissible ? (
              <Dialog.Close
                className="button-ghost form-dialog-close"
                aria-label={`Tutup ${title}`}
              >
                <X aria-hidden="true" size={18} />
              </Dialog.Close>
            ) : null}
          </header>
          <div className="form-dialog-body">{children}</div>
          <footer className="form-dialog-footer" aria-label="Aksi formulir">
            {footer}
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
