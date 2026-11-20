"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, BoltIcon, Card, TimerIcon, toast } from "@/components/ui";
import { DEFAULT_SETTINGS, buildTimeline, formatTime, type FlashImage, type FlashSettings } from "@/lib/flash/engine";
import { isImageFile, loadImage } from "@/lib/flash/media";
import { ImageTray } from "./ImageTray";
import { PreviewPlayer } from "./PreviewPlayer";
import { SettingsPanel } from "./SettingsPanel";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function FlashImageTool() {
  const [images, setImages] = useState<FlashImage[]>([]);
  const [settings, setSettings] = useState<FlashSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveUrls = useRef(new Set<string>());

  const timeline = useMemo(() => buildTimeline(images, settings), [images, settings]);

  // Free object URLs when leaving the page
  useEffect(() => {
    const urls = liveUrls.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const update = (patch: Partial<FlashSettings>) => setSettings((s) => ({ ...s, ...patch }));
  const openPicker = () => fileInputRef.current?.click();

  const addFiles = async (files: File[]) => {
    const list = files.filter(isImageFile);
    if (list.length === 0) {
      toast.error("No images found in that selection");
      return;
    }
    setLoading(true);
    const results = await Promise.allSettled(list.map(loadImage));
    const ok: FlashImage[] = [];
    let failed = 0;
    for (const r of results) {
      if (r.status === "fulfilled") {
        ok.push(r.value);
        liveUrls.current.add(r.value.url);
      } else failed += 1;
    }
    setImages((prev) => [...prev, ...ok]);
    setLoading(false);
    if (failed > 0) toast.error(`${plural(failed, "file")} couldn't be read and ${failed === 1 ? "was" : "were"} skipped`);
    else if (ok.length > 0) toast(`Added ${plural(ok.length, "image")}`);
  };

  const removeImage = (id: string) => {
    const target = images.find((i) => i.id === id);
    if (target) {
      URL.revokeObjectURL(target.url);
      liveUrls.current.delete(target.url);
    }
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = prev.slice();
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const setImageDuration = (id: string, seconds: number) => {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, duration: seconds } : i)));
  };

  const clearAll = () => {
    const count = images.length;
    images.forEach((i) => {
      URL.revokeObjectURL(i.url);
      liveUrls.current.delete(i.url);
    });
    setImages([]);
    toast(`Removed ${plural(count, "image")}`);
  };

  return (
    <div className="mx-auto w-full max-w-page px-2 pb-10 sm:px-4">
      <header className="mt-5 mb-5 flex flex-wrap items-end justify-between gap-4 px-2 sm:mt-8">
        <div>
          <Badge tone="primary" size="md">
            <BoltIcon /> Free slideshow video maker
          </Badge>
          <h1 className="mt-3 type-display-lg">
            FLASH IMAGE <span className="block type-display-md text-on-surface-variant">GENERATOR</span>
          </h1>
          <p className="mt-2 max-w-xl type-body-md text-on-surface-variant sm:type-body-lg">
            Drop in your photos, choose how long each one shows, the gap between them and a transition. Preview it
            live, then export MP4, WebM or HTML + CSS. Free, no sign-up, and your images never leave your browser.
          </p>
        </div>
        <dl className="flex gap-2">
          <Card variant="secondary" radius="xl" padding="none" className="px-4 py-2.5">
            <dt className="type-label-sm uppercase opacity-75">Images</dt>
            <dd className="font-brand text-xl tabular-nums">{images.length}</dd>
          </Card>
          <Card variant="tertiary" radius="xl" padding="none" className="px-4 py-2.5">
            <dt className="flex items-center gap-1 type-label-sm uppercase opacity-75">
              <TimerIcon size={12} /> Length
            </dt>
            <dd className="font-brand text-xl tabular-nums">{formatTime(timeline.total)}</dd>
          </Card>
        </dl>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) void addFiles(files);
        }}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-4">
          <PreviewPlayer images={images} settings={settings} timeline={timeline} onPick={openPicker} />
          <ImageTray
            images={images}
            settings={settings}
            loading={loading}
            onPick={openPicker}
            onFiles={(f) => void addFiles(f)}
            onRemove={removeImage}
            onMove={moveImage}
            onDuration={setImageDuration}
            onClear={clearAll}
          />
        </div>
        <aside aria-label="Settings" className="lg:sticky lg:top-24 lg:self-start">
          <SettingsPanel settings={settings} update={update} />
        </aside>
      </div>
    </div>
  );
}
