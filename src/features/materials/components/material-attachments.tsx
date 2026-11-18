"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Download, FileText, Image as ImageIcon, LoaderCircle, RotateCw, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { downloadMaterialAttachment } from "@/services/materials.service";
import type { MaterialAttachment } from "@/types/lms";

type MaterialAttachmentsProps = {
  materialId: string;
  attachments: MaterialAttachment[];
  autoPreviewImages?: boolean;
  onRemove?: (attachmentId: string) => void;
  removingAttachmentId?: string;
  className?: string;
};

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  const unit = size < 1024 * 1024 ? "KB" : "MB";
  const amount = size < 1024 * 1024 ? size / 1024 : size / (1024 * 1024);
  return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(amount)} ${unit}`;
}

function MaterialAttachmentItem({
  materialId,
  attachment,
  autoPreviewImages,
  onRemove,
  removingAttachmentId,
}: Omit<MaterialAttachmentsProps, "attachments" | "className"> & {
  attachment: MaterialAttachment;
}) {
  const isImage = attachment.content_type.startsWith("image/");
  const [requested, setRequested] = useState(autoPreviewImages && isImage);
  const [retry, setRetry] = useState(0);
  const [downloadResult, setDownloadResult] = useState<{
    key: string;
    objectUrl?: string;
    error?: boolean;
  } | null>(null);
  const attachmentKey = `${materialId}:${attachment.id}`;
  const currentResult = downloadResult?.key === attachmentKey ? downloadResult : null;
  const objectUrl = currentResult?.objectUrl ?? "";
  const loadError = currentResult?.error ?? false;
  const isLoading = requested && !currentResult;

  useEffect(() => {
    if (!requested) return;
    let cancelled = false;
    let nextObjectUrl = "";

    void downloadMaterialAttachment(materialId, attachment.id)
      .then((blob) => {
        nextObjectUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(nextObjectUrl);
          return;
        }
        setDownloadResult({ key: attachmentKey, objectUrl: nextObjectUrl });
      })
      .catch(() => {
        if (!cancelled) setDownloadResult({ key: attachmentKey, error: true });
      });

    return () => {
      cancelled = true;
      if (nextObjectUrl) URL.revokeObjectURL(nextObjectUrl);
    };
  }, [attachment.id, attachmentKey, materialId, requested, retry]);

  const Icon = isImage ? ImageIcon : FileText;

  return (
    <li className="space-y-3 rounded-md border border-border bg-card px-3 py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-card-soft text-primary">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-all text-sm font-semibold">{attachment.file_name}</p>
          <p className="mt-1 text-xs text-muted">
            {isImage ? "Gambar" : "Dokumen"} · {formatFileSize(attachment.size_bytes)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {objectUrl ? (
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              href={objectUrl}
              download={attachment.file_name}
            >
              <Download size={16} aria-hidden="true" /> Unduh
            </a>
          ) : !loadError ? (
            <Button
              variant="ghost"
              size="compact"
              onClick={() => setRequested(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle size={16} aria-hidden="true" className="animate-spin" />
              ) : (
                <Download size={16} aria-hidden="true" />
              )}
              {isLoading ? "Memuat…" : isImage ? "Tampilkan" : "Siapkan unduhan"}
            </Button>
          ) : (
            <span className="text-xs text-muted">Gagal dimuat</span>
          )}
          {onRemove ? (
            <ActionButton
              icon={Trash2}
              label={`Hapus lampiran ${attachment.file_name}`}
              onClick={() => onRemove(attachment.id)}
              pending={removingAttachmentId === attachment.id}
              disabled={Boolean(removingAttachmentId && removingAttachmentId !== attachment.id)}
              tone="danger"
            />
          ) : null}
        </div>
      </div>
      {isImage && objectUrl ? (
        <Image
          src={objectUrl}
          alt={attachment.file_name}
          width={960}
          height={640}
          unoptimized
          className="max-h-96 w-full rounded-md border border-border object-contain"
        />
      ) : null}
      {loadError ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger" role="status">
          <span>Lampiran belum dapat dimuat.</span>
          <Button
            variant="ghost"
            size="compact"
            onClick={() => {
              setDownloadResult(null);
              setRetry((value) => value + 1);
            }}
          >
            <RotateCw size={15} aria-hidden="true" /> Coba lagi
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export function MaterialAttachments({
  materialId,
  attachments,
  autoPreviewImages = false,
  onRemove,
  removingAttachmentId,
  className,
}: MaterialAttachmentsProps) {
  if (attachments.length === 0) return null;

  return (
    <section
      className={cn("space-y-3", className)}
      aria-labelledby={`material-attachments-${materialId}`}
    >
      <h3 id={`material-attachments-${materialId}`} className="text-sm font-semibold">
        Lampiran materi <span className="text-muted">({attachments.length})</span>
      </h3>
      <ul className="space-y-3">
        {attachments.map((attachment) => (
          <MaterialAttachmentItem
            key={attachment.id}
            materialId={materialId}
            attachment={attachment}
            autoPreviewImages={autoPreviewImages}
            onRemove={onRemove}
            removingAttachmentId={removingAttachmentId}
          />
        ))}
      </ul>
    </section>
  );
}
