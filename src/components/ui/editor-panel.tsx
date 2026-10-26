"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Inline authoring surface. Keeps long forms out of the collection's default view. */
export function EditorPanel({
  id,
  focusKey,
  title,
  description,
  onClose,
  children,
}: {
  id: string;
  focusKey?: string;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const returnTarget = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    if (
      active &&
      active !== document.body &&
      !heading.current?.closest("section")?.contains(active)
    ) {
      returnTarget.current = active;
    } else if (!returnTarget.current) {
      returnTarget.current = document.getElementById(`${id}-trigger`);
    }
    heading.current?.focus();
  }, [id, focusKey]);
  useEffect(
    () => () => {
      if (returnTarget.current?.isConnected) returnTarget.current.focus();
    },
    [],
  );

  return (
    <section id={id} className="editor-panel" aria-labelledby={`${id}-title`}>
      <div className="editor-panel-heading">
        <div className="flex items-start gap-3">
          <span className="metric-icon">
            <PencilLine aria-hidden="true" size={19} />
          </span>
          <div>
            <h2
              id={`${id}-title`}
              ref={heading}
              tabIndex={-1}
              className="section-title"
            >
              {title}
            </h2>
            <p className="section-description">{description}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft aria-hidden="true" size={16} /> Kembali ke daftar
        </Button>
      </div>
      <div className="editor-panel-body">{children}</div>
    </section>
  );
}
