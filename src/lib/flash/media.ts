import type { FlashImage } from "./engine";

/* ───────────────────────── loading ───────────────────────── */

const MAX_SIDE = 2560;
let idCounter = 0;

export function isImageFile(f: File) {
  return f.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|avif|bmp|svg)$/i.test(f.name);
}

/** Decode a file into a FlashImage. Very large photos are downscaled once. */
export async function loadImage(file: File): Promise<FlashImage> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();

    let source: CanvasImageSource = img;
    let width = img.naturalWidth || 1;
    let height = img.naturalHeight || 1;

    if (Math.max(width, height) > MAX_SIDE) {
      const k = MAX_SIDE / Math.max(width, height);
      const c = document.createElement("canvas");
      c.width = Math.round(width * k);
      c.height = Math.round(height * k);
      const cx = c.getContext("2d");
      if (cx) {
        cx.imageSmoothingQuality = "high";
        cx.drawImage(img, 0, 0, c.width, c.height);
        source = c;
        width = c.width;
        height = c.height;
      }
    }

    idCounter += 1;
    return { id: `img-${idCounter}`, name: file.name, url, source, width, height, duration: null };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/* ───────────────────────── video export ───────────────────────── */

export interface VideoFormat {
  ext: "mp4" | "webm";
  label: string;
  mime: string;
}

const CANDIDATES: VideoFormat[] = [
  { ext: "mp4", label: "MP4", mime: "video/mp4;codecs=avc1.640028" },
  { ext: "mp4", label: "MP4", mime: "video/mp4;codecs=avc1" },
  { ext: "mp4", label: "MP4", mime: "video/mp4" },
  { ext: "webm", label: "WebM", mime: "video/webm;codecs=vp9" },
  { ext: "webm", label: "WebM", mime: "video/webm;codecs=vp8" },
  { ext: "webm", label: "WebM", mime: "video/webm" },
];

let formatsCache: VideoFormat[] | null = null;

/** Formats this browser can record (first working mime per container). */
export function supportedFormats(): VideoFormat[] {
  if (formatsCache) return formatsCache;
  const out: VideoFormat[] = [];
  if (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    typeof HTMLCanvasElement.prototype.captureStream === "function"
  ) {
    for (const f of CANDIDATES) {
      if (out.some((o) => o.ext === f.ext)) continue;
      if (MediaRecorder.isTypeSupported(f.mime)) out.push(f);
    }
  }
  formatsCache = out;
  return out;
}

export interface RecordOptions {
  width: number;
  height: number;
  fps: number;
  durationSec: number;
  format: VideoFormat;
  draw: (ctx: CanvasRenderingContext2D, t: number) => void;
  onProgress?: (p: number) => void;
  signal?: AbortSignal;
}

/**
 * Plays the timeline in real time onto a hidden canvas and records it with
 * MediaRecorder. Takes as long as the video itself; the tab must stay visible.
 */
export async function recordVideo(opts: RecordOptions): Promise<Blob> {
  const { width, height, fps, durationSec, format, draw, onProgress, signal } = opts;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  // Keep it in the DOM (some browsers only emit frames for attached canvases)
  Object.assign(canvas.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: "2px",
    height: "2px",
    opacity: "0",
    pointerEvents: "none",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    throw new Error("Canvas 2D is not available in this browser.");
  }

  // Manual frame capture: a frame enters the stream only when we call
  // requestFrame(), so output doesn't depend on how the browser paints a
  // hidden canvas, and the frame rate is exactly `fps`.
  const stream = canvas.captureStream(0);
  const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack | undefined;
  const pushFrame = (t: number) => {
    draw(ctx, t);
    track?.requestFrame();
  };

  const bitrate = Math.round(Math.min(16e6, Math.max(4e6, width * height * fps * 0.15)));
  const recorder = new MediaRecorder(stream, { mimeType: format.mime, videoBitsPerSecond: bitrate });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const stopped = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: format.mime.split(";")[0] }));
    recorder.onerror = () => reject(new Error("The recorder stopped unexpectedly."));
  });
  stopped.catch(() => {}); // handled below; avoid unhandled-rejection noise on cancel
  // Don't start the clock until the encoder is actually running
  const started = new Promise<void>((resolve) => {
    recorder.onstart = () => resolve();
    setTimeout(resolve, 1500);
  });

  const cleanup = () => {
    stream.getTracks().forEach((tr) => tr.stop());
    canvas.remove();
  };

  const frameSec = 1 / fps;
  recorder.start(250);

  try {
    await started;
    pushFrame(0);
    const start = performance.now();
    let nextFrame = frameSec;

    await new Promise<void>((resolve, reject) => {
      const tick = () => {
        if (signal?.aborted) {
          reject(new DOMException("Export cancelled", "AbortError"));
          return;
        }
        const t = (performance.now() - start) / 1000;
        if (t >= nextFrame) {
          pushFrame(Math.min(t, durationSec));
          // Skip ahead if we fell behind, but stay on the fps grid
          nextFrame += Math.max(1, Math.floor((t - nextFrame) / frameSec) + 1) * frameSec;
        }
        onProgress?.(Math.min(1, t / durationSec));
        if (t >= durationSec) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    // Hold the final frame for a few frame-lengths so it lands in the file
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, frameSec * 1000));
      pushFrame(durationSec);
    }
    recorder.stop();
    const blob = await stopped;
    if (blob.size === 0) {
      throw new Error(
        `The browser produced an empty ${format.label} file. Please try again, or switch to ${
          format.ext === "mp4" ? "WebM" : "MP4"
        }.`,
      );
    }
    return blob;
  } catch (err) {
    if (recorder.state !== "inactive") recorder.stop();
    throw err;
  } finally {
    cleanup();
  }
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
