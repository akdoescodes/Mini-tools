"use client";

/* eslint-disable @next/next/no-img-element -- local blob: thumbnails */

import { useState, type DragEvent } from "react";
import {
  AddIcon,
  Badge,
  Button,
  cardVariants,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ConfirmDialog,
  DeleteIcon,
  DragIcon,
  IconButton,
  ImageIcon,
  NumberField,
  ShapedIcon,
  Tooltip,
  UploadIcon,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { LIMITS, imageDuration, type FlashImage, type FlashSettings } from "@/lib/flash/engine";

const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

export function ImageTray({
  images,
  settings,
  loading,
  onPick,
  onFiles,
  onRemove,
  onMove,
  onDuration,
  onClear,
}: {
  images: FlashImage[];
  settings: FlashSettings;
  loading: boolean;
  onPick: () => void;
  onFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onDuration: (id: string, seconds: number) => void;
  onClear: () => void;
}) {
  const [fileOver, setFileOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const perImage = settings.durationMode === "each";

  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <section
      aria-labelledby="images-title"
      className={cn(
        cardVariants({ padding: "md" }),
        "transition-shadow duration-short4",
        fileOver && "ring-4 ring-primary-container ring-offset-2 ring-offset-surface",
      )}
      onDragOver={(e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setFileOver(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setFileOver(false);
      }}
      onDrop={(e) => {
        setFileOver(false);
        if (!hasFiles(e)) return;
        e.preventDefault();
        onFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 id="images-title" className="flex items-center gap-2 type-title-md">
          Images
          <Badge tone="secondary">{images.length}</Badge>
        </h2>
        {images.length > 1 && (
          <span className="hidden items-center gap-1 type-body-sm text-on-surface-variant sm:flex">
            <DragIcon size={16} /> Drag to reorder
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {images.length > 0 && (
            <Button variant="text" size="sm" onClick={() => setConfirmClear(true)}>
              Clear all
            </Button>
          )}
          <Button variant="tonal" size="sm" onClick={onPick} disabled={loading}>
            <AddIcon size={18} />
            {loading ? "Loading…" : "Add images"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <button
          type="button"
          onClick={onPick}
          className="state-layer flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-outline-variant px-6 py-12 text-center"
        >
          <ShapedIcon shape="cookie12" tone="primary" size="lg">
            <UploadIcon />
          </ShapedIcon>
          <span className="type-title-md">Drop images here or click to choose</span>
          <span className="max-w-sm type-body-md text-on-surface-variant">
            PNG, JPG, WebP, GIF, AVIF. Pick as many as you want; you can reorder them after.
          </span>
        </button>
      ) : (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {images.map((img, i) => (
            <li
              key={img.id}
              draggable
              onDragStart={(e) => {
                setDragIndex(i);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", img.id);
              }}
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overIndex !== i) setOverIndex(i);
              }}
              onDrop={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                e.stopPropagation();
                if (dragIndex !== i) onMove(dragIndex, i);
                endDrag();
              }}
              onDragEnd={endDrag}
              className={cn(
                "group relative flex cursor-grab flex-col rounded-xl bg-surface-container p-1.5 transition-all duration-short4 active:cursor-grabbing",
                dragIndex === i && "scale-95 opacity-40",
                overIndex === i && dragIndex !== i && "ring-2 ring-primary",
              )}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-container-highest">
                <img src={img.url} alt={img.name} draggable={false} className="size-full object-cover" />
                <Badge tone="inverse" className="absolute top-1.5 left-1.5 font-brand">
                  {String(i + 1).padStart(2, "0")}
                </Badge>
                <Tooltip content="Remove">
                  <IconButton
                    label={`Remove ${img.name}`}
                    variant="inverse"
                    size="sm"
                    className="absolute top-1 right-1 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                    onClick={() => onRemove(img.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="mt-1.5 flex items-center justify-between gap-1">
                <IconButton
                  label={`Move ${img.name} earlier`}
                  size="sm"
                  disabled={i === 0}
                  onClick={() => onMove(i, i - 1)}
                >
                  <ChevronLeftIcon />
                </IconButton>
                {perImage ? (
                  <NumberField
                    label={`Seconds for image ${i + 1}`}
                    value={imageDuration(img, settings)}
                    onValueChange={(v) => onDuration(img.id, v)}
                    unit="s"
                    className={cn(img.duration !== null && "[&_input]:text-primary")}
                    {...LIMITS.duration}
                  />
                ) : (
                  <span className="type-label-md text-on-surface-variant tabular-nums">
                    {settings.duration.toFixed(1)}s
                  </span>
                )}
                <IconButton
                  label={`Move ${img.name} later`}
                  size="sm"
                  disabled={i === images.length - 1}
                  onClick={() => onMove(i, i + 1)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </div>
              <p className="truncate px-1 py-0.5 type-label-sm font-normal text-on-surface-variant" title={img.name}>
                {img.name}
              </p>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={onPick}
              disabled={loading}
              className="state-layer flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant type-label-lg text-on-surface-variant"
            >
              <ImageIcon size={26} />
              Add more
            </button>
          </li>
        </ol>
      )}

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        icon={<DeleteIcon />}
        title={`Remove all ${images.length} images?`}
        description="Your timing and transition settings are kept. This can't be undone."
        confirmLabel="Remove all"
        destructive
        onConfirm={onClear}
      />
    </section>
  );
}
