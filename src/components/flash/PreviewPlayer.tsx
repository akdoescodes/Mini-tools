"use client";

/* eslint-disable @next/next/no-img-element -- local blob: thumbnails */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AddIcon,
  Button,
  buttonVariants,
  Card,
  CheckCircleIcon,
  CodeIcon,
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogHeader,
  DownloadIcon,
  IconButton,
  LinearProgress,
  MovieIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  SegmentedButton,
  ShapedIcon,
  Slider,
  toast,
  Tooltip,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  ASPECTS,
  FlashRenderer,
  formatTime,
  type FlashImage,
  type FlashSettings,
  type Timeline,
} from "@/lib/flash/engine";
import { exportCode, type CodePackage } from "@/lib/flash/codegen";
import { formatBytes, recordVideo, supportedFormats, type VideoFormat } from "@/lib/flash/media";
import { CodeExportDialog, type CodeResult } from "./CodeExportDialog";

const noopSubscribe = () => () => {};
const getFormats = () => supportedFormats();
const getServerFormats = (): VideoFormat[] | null => null;

interface ExportResult {
  url: string;
  name: string;
  size: number;
  label: string;
}

export function PreviewPlayer({
  images,
  settings,
  timeline,
  onPick,
}: {
  images: FlashImage[];
  settings: FlashSettings;
  timeline: Timeline;
  onPick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FlashRenderer | null>(null);
  const latest = useRef({ images, settings, timeline });
  const timeRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState<number | null>(null); // null = not recording
  const [result, setResult] = useState<ExportResult | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [formatExt, setFormatExt] = useState<VideoFormat["ext"] | null>(null);
  const [output, setOutput] = useState<"video" | "code">("video");
  const [pkg, setPkg] = useState<CodePackage>("zip");
  const [codeBusy, setCodeBusy] = useState(false);
  const [code, setCode] = useState<CodeResult | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const formats = useSyncExternalStore(noopSubscribe, getFormats, getServerFormats);

  const { width, height } = ASPECTS[settings.aspect];
  const total = timeline.total;
  const shownTime = Math.min(time, total);
  const empty = images.length === 0;
  const recording = progress !== null;
  const format = formats?.find((f) => f.ext === formatExt) ?? formats?.[0] ?? null;

  useEffect(() => {
    latest.current = { images, settings, timeline };
  });

  const draw = useCallback((t: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    rendererRef.current ??= new FlashRenderer();
    const { images, settings, timeline } = latest.current;
    rendererRef.current.render(ctx, t, images, settings, timeline);
  }, []);

  // Redraw while paused whenever something visible changes
  useEffect(() => {
    if (!playing) draw(Math.min(time, timeline.total));
  }, [playing, time, images, settings, timeline, width, height, draw]);

  // Playback loop
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const { timeline, settings } = latest.current;
      let t = timeRef.current + dt;
      if (t >= timeline.total) {
        if (settings.loop && timeline.total > 0) {
          t %= timeline.total;
        } else {
          t = timeline.total;
          timeRef.current = t;
          draw(t);
          setTime(t);
          setPlaying(false);
          return;
        }
      }
      timeRef.current = t;
      draw(t);
      setTime(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, draw]);

  // Stop any export on unmount; free the previous result's URL when replaced
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (!result) return;
    const url = result.url;
    return () => URL.revokeObjectURL(url);
  }, [result]);

  useEffect(() => {
    if (!code) return;
    return () => {
      URL.revokeObjectURL(code.url);
      code.dispose();
    };
  }, [code]);

  const startCodeExport = async () => {
    if (empty || codeBusy) return;
    setCodeBusy(true);
    try {
      const res = await exportCode(images, settings, timeline, pkg);
      setCode({ ...res, url: URL.createObjectURL(res.blob), label: pkg === "zip" ? ".zip" : ".html" });
      setCodeOpen(true);
    } catch (err) {
      toast.error("Couldn't build the code", { description: err instanceof Error ? err.message : undefined });
    } finally {
      setCodeBusy(false);
    }
  };

  const seek = (t: number) => {
    timeRef.current = t;
    setTime(t);
  };

  const togglePlay = () => {
    if (empty) return;
    if (!playing && timeRef.current >= total - 0.001) seek(0);
    setPlaying((p) => !p);
  };

  const restart = () => {
    seek(0);
    if (!empty) setPlaying(true);
  };

  const startExport = async () => {
    if (!format || empty || recording) return;
    setPlaying(false);
    const controller = new AbortController();
    abortRef.current = controller;
    setProgress(0);

    // Snapshot so edits during export don't affect the recording
    const snap = { images, settings, timeline };
    const renderer = new FlashRenderer();
    try {
      const blob = await recordVideo({
        width,
        height,
        fps: settings.fps,
        durationSec: snap.timeline.total,
        format,
        signal: controller.signal,
        draw: (ctx, t) => renderer.render(ctx, t, snap.images, snap.settings, snap.timeline),
        onProgress: (p) => setProgress(p),
      });
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      setResult({
        url: URL.createObjectURL(blob),
        name: `flash-${stamp}.${format.ext}`,
        size: blob.size,
        label: format.label,
      });
      setResultOpen(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") toast("Export cancelled");
      else toast.error("Export failed", { description: err instanceof Error ? err.message : undefined });
    } finally {
      abortRef.current = null;
      setProgress(null);
    }
  };

  const pct = total > 0 ? (shownTime / total) * 100 : 0;

  return (
    <section aria-label="Preview" className="flex flex-col gap-3">
      <Card variant="inverse" padding="sm" className="[--slider-gap:var(--md-sys-color-inverse-surface)]">
        {/* Stage */}
        <div className="stage-checkerboard relative flex h-[min(58vh,520px)] min-h-[260px] items-center justify-center overflow-hidden rounded-xl p-3">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={cn("block h-auto max-h-full w-auto max-w-full rounded-lg shadow-stage", empty && "opacity-0")}
            aria-label="Slideshow preview"
            role="img"
          />

          {empty && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <ShapedIcon shape="cookie12" size="xl">
                <MovieIcon />
              </ShapedIcon>
              <p className="font-brand text-lg">NO IMAGES YET</p>
              <p className="max-w-xs type-body-md text-inverse-on-surface/70">
                Add a few images and they&apos;ll play here with your timing and transitions.
              </p>
              <Button variant="accent" onClick={onPick}>
                <AddIcon size={18} /> Add images
              </Button>
            </div>
          )}

          {progress !== null && (
            <div className="absolute inset-0 grid place-items-center bg-black/55 backdrop-blur-sm">
              <div className="flex w-[min(80%,320px)] flex-col items-center gap-3 text-center">
                <span className="flex items-center gap-2 font-brand text-sm">
                  <span className="size-2.5 animate-pulse rounded-full bg-error" /> RECORDING
                </span>
                <LinearProgress value={Math.round(progress * 100)} label="Export progress" tone="inverse" />
                <p className="type-body-sm text-inverse-on-surface/70">
                  {Math.round(progress * 100)}% · keep this tab open and visible
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Timeline strip */}
        {!empty && (
          <div className="relative mt-2.5 flex h-9 gap-0.5 overflow-hidden rounded-md" aria-hidden="true">
            {timeline.clips.map((c, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                title={
                  c.kind === "gap"
                    ? `Gap · ${c.duration.toFixed(1)}s`
                    : `Image ${c.imageIndex + 1} · ${c.duration.toFixed(1)}s`
                }
                onClick={() => seek(c.start)}
                className={cn("relative min-w-[3px] overflow-hidden", c.kind === "gap" ? "gap-stripes bg-white/5" : "bg-white/10")}
                style={{ flex: `${c.duration} 1 0` }}
              >
                {c.kind === "image" && images[c.imageIndex] && (
                  <img
                    src={images[c.imageIndex].url}
                    alt=""
                    draggable={false}
                    className="pointer-events-none size-full object-cover opacity-75"
                  />
                )}
              </button>
            ))}
            <span
              className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 rounded-full bg-primary-container shadow-[0_0_0_2px_rgb(0_0_0/0.35)]"
              style={{ left: `${pct}%` }}
            />
          </div>
        )}

        {/* Transport */}
        <div className="mt-1 flex items-center gap-2 px-1">
          <Tooltip content="Restart">
            <IconButton label="Restart" variant="on-inverse" onClick={restart} disabled={empty || recording}>
              <ReplayIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            label={playing ? "Pause" : "Play"}
            variant="accent"
            size="xl"
            onClick={togglePlay}
            disabled={empty || recording}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          <Slider
            label="Seek"
            tone="inverse"
            className="mx-1 flex-1"
            min={0}
            max={total || 1}
            step={0.01}
            value={shownTime}
            disabled={empty || recording}
            onValueChange={seek}
          />
          <span className="min-w-[88px] text-right type-label-md text-inverse-on-surface/80 tabular-nums">
            {formatTime(shownTime)} / {formatTime(total)}
          </span>
        </div>
      </Card>

      {/* Export */}
      <Card padding="sm" className="flex flex-col gap-3 sm:pl-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto pl-2 sm:pl-0">
            <p className="type-title-sm">Export</p>
            <p className="type-body-sm text-on-surface-variant">
              {output === "video"
                ? `${width}×${height} · ${settings.fps} fps · ${formatTime(total)}`
                : "Pure HTML + CSS animation · use it on a site or as a reference for an AI agent"}
            </p>
          </div>
          <div className="w-full sm:w-64">
            <SegmentedButton
              label="Export as"
              value={output}
              onValueChange={setOutput}
              options={[
                { value: "video", label: "Video", disabled: recording },
                { value: "code", label: "HTML + CSS", disabled: recording },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {output === "video" ? (
            formats === null ? null : formats.length === 0 ? (
              <p className="type-body-md text-on-surface-variant">
                Video recording isn&apos;t supported in this browser. Try Chrome, Edge, Firefox or Safari, or export
                HTML + CSS instead.
              </p>
            ) : (
              <>
                {formats.length > 1 && format && (
                  <div className="w-44">
                    <SegmentedButton
                      label="Video format"
                      value={format.ext}
                      onValueChange={(v) => setFormatExt(v)}
                      options={formats.map((f) => ({ value: f.ext, label: f.label, disabled: recording }))}
                    />
                  </div>
                )}
                {recording ? (
                  <Button variant="outlined" onClick={() => abortRef.current?.abort()}>
                    Cancel
                  </Button>
                ) : (
                  <Button onClick={startExport} disabled={empty}>
                    <DownloadIcon size={18} />
                    Export {format?.label}
                  </Button>
                )}
              </>
            )
          ) : (
            <>
              <div className="w-56">
                <SegmentedButton
                  label="Code package"
                  value={pkg}
                  onValueChange={setPkg}
                  options={[
                    { value: "zip", label: "Files (.zip)" },
                    { value: "single", label: "One .html" },
                  ]}
                />
              </div>
              <Button onClick={startCodeExport} disabled={empty || codeBusy}>
                <CodeIcon size={18} />
                {codeBusy ? "Building…" : "Export code"}
              </Button>
            </>
          )}
        </div>
      </Card>

      <CodeExportDialog result={code} open={codeOpen} onOpenChange={setCodeOpen} />

      {/* Result modal */}
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent size="lg" showClose>
          {result && (
            <>
              <DialogHeader
                icon={<CheckCircleIcon />}
                title="Your video is ready"
                description={`${result.name} · ${formatBytes(result.size)} · ${formatTime(total)}`}
              />
              <video
                src={result.url}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="mx-auto max-h-[50dvh] w-auto max-w-full rounded-lg bg-black"
              />
              <DialogActions>
                <DialogClose render={<Button variant="text">Close</Button>} />
                <a href={result.url} download={result.name} className={buttonVariants({ variant: "filled" })}>
                  <DownloadIcon size={18} />
                  Download {result.label}
                </a>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
