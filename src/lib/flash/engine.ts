/**
 * Flash Image engine: turns a list of images + timing settings into a
 * timeline, and paints any moment of that timeline onto a 2D canvas.
 *
 * Timeline model
 *   [image 1 (d1)] [gap (g)] [image 2 (d2)] [gap (g)] … [image n (dn)]
 * A transition (if any) plays at the start of every clip after the first,
 * blending from the previous clip's frame into this one. Gaps are plain
 * frames filled with the background colour, so "image → gap → image" fades
 * out to the background and back in.
 */

export type TransitionKind = "none" | "fade" | "slide" | "zoom" | "wipe" | "flash";
export type FitMode = "cover" | "contain";
export type DurationMode = "all" | "each";
export type AspectId = "1:1" | "4:5" | "9:16" | "16:9";
export type Fps = 24 | 30 | 60;

export const TRANSITIONS: { id: TransitionKind; label: string }[] = [
  { id: "none", label: "None" },
  { id: "fade", label: "Fade" },
  { id: "slide", label: "Slide" },
  { id: "zoom", label: "Zoom" },
  { id: "wipe", label: "Wipe" },
  { id: "flash", label: "Flash" },
];

export const ASPECTS: Record<AspectId, { label: string; width: number; height: number }> = {
  "1:1": { label: "Square", width: 1080, height: 1080 },
  "4:5": { label: "Portrait", width: 1080, height: 1350 },
  "9:16": { label: "Story", width: 1080, height: 1920 },
  "16:9": { label: "Wide", width: 1920, height: 1080 },
};

export const LIMITS = {
  duration: { min: 0.1, max: 10, step: 0.1 },
  gap: { min: 0, max: 5, step: 0.1 },
  transition: { min: 0.1, max: 2, step: 0.05 },
} as const;

export interface FlashImage {
  id: string;
  name: string;
  /** Object URL used for thumbnails */
  url: string;
  /** Decoded (and possibly downscaled) pixels used for rendering */
  source: CanvasImageSource;
  width: number;
  height: number;
  /** Per-image override in seconds; null = use the global duration */
  duration: number | null;
}

export interface FlashSettings {
  durationMode: DurationMode;
  /** Seconds each image is shown (or the default in "each" mode) */
  duration: number;
  /** Seconds of blank background between images */
  gap: number;
  transition: TransitionKind;
  transitionDuration: number;
  aspect: AspectId;
  fit: FitMode;
  background: string;
  fps: Fps;
  loop: boolean;
}

export const DEFAULT_SETTINGS: FlashSettings = {
  durationMode: "all",
  duration: 1.5,
  gap: 0.3,
  transition: "fade",
  transitionDuration: 0.3,
  aspect: "1:1",
  fit: "cover",
  background: "#000000",
  fps: 30,
  loop: true,
};

export interface Clip {
  kind: "image" | "gap";
  /** Index into the images array, -1 for gaps */
  imageIndex: number;
  start: number;
  duration: number;
}

export interface Timeline {
  clips: Clip[];
  total: number;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function imageDuration(img: FlashImage, s: FlashSettings): number {
  const d = s.durationMode === "each" ? (img.duration ?? s.duration) : s.duration;
  return clamp(d, LIMITS.duration.min, LIMITS.duration.max);
}

export function buildTimeline(images: readonly FlashImage[], s: FlashSettings): Timeline {
  const clips: Clip[] = [];
  const gap = clamp(s.gap, 0, LIMITS.gap.max);
  let t = 0;
  images.forEach((img, i) => {
    const d = imageDuration(img, s);
    clips.push({ kind: "image", imageIndex: i, start: t, duration: d });
    t += d;
    if (gap > 0 && i < images.length - 1) {
      clips.push({ kind: "gap", imageIndex: -1, start: t, duration: gap });
      t += gap;
    }
  });
  return { clips, total: t };
}

/** Index of the clip playing at time t (binary search). */
export function clipIndexAt(tl: Timeline, t: number): number {
  let lo = 0;
  let hi = tl.clips.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (tl.clips[mid].start <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function formatTime(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const rest = s - m * 60;
  return `${m}:${rest.toFixed(1).padStart(4, "0")}`;
}

/* ───────────────────────── rendering ───────────────────────── */

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function drawFitted(
  ctx: CanvasRenderingContext2D,
  img: FlashImage,
  W: number,
  H: number,
  fit: FitMode,
) {
  const scale =
    fit === "cover" ? Math.max(W / img.width, H / img.height) : Math.min(W / img.width, H / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img.source, (W - dw) / 2, (H - dh) / 2, dw, dh);
}

function paintClip(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  images: readonly FlashImage[],
  s: FlashSettings,
  W: number,
  H: number,
) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = s.background;
  ctx.fillRect(0, 0, W, H);
  const img = clip.kind === "image" ? images[clip.imageIndex] : undefined;
  if (img) drawFitted(ctx, img, W, H, s.fit);
}

function drawScaled(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  W: number,
  H: number,
  scale: number,
  alpha: number,
) {
  ctx.globalAlpha = alpha;
  const dw = W * scale;
  const dh = H * scale;
  ctx.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh);
  ctx.globalAlpha = 1;
}

function composite(
  ctx: CanvasRenderingContext2D,
  from: HTMLCanvasElement,
  to: HTMLCanvasElement,
  raw: number,
  kind: TransitionKind,
  background: string,
  W: number,
  H: number,
) {
  const p = easeInOutCubic(raw);
  switch (kind) {
    case "fade":
      ctx.drawImage(from, 0, 0);
      ctx.globalAlpha = p;
      ctx.drawImage(to, 0, 0);
      break;
    case "slide":
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(from, -p * W, 0);
      ctx.drawImage(to, (1 - p) * W, 0);
      break;
    case "zoom":
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, W, H);
      drawScaled(ctx, from, W, H, 1 + 0.25 * p, 1);
      drawScaled(ctx, to, W, H, 1.25 - 0.25 * p, p);
      break;
    case "wipe":
      ctx.drawImage(from, 0, 0);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, p * W, H);
      ctx.clip();
      ctx.drawImage(to, 0, 0);
      ctx.restore();
      break;
    case "flash":
      ctx.drawImage(raw < 0.5 ? from : to, 0, 0);
      ctx.globalAlpha = Math.pow(1 - Math.abs(2 * raw - 1), 0.6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      break;
    default:
      ctx.drawImage(to, 0, 0);
  }
  ctx.globalAlpha = 1;
}

/** Paints frames. Holds two scratch canvases used while transitioning. */
export class FlashRenderer {
  private a: HTMLCanvasElement | null = null;
  private b: HTMLCanvasElement | null = null;

  private buffers(W: number, H: number) {
    if (!this.a || !this.b) {
      this.a = document.createElement("canvas");
      this.b = document.createElement("canvas");
    }
    for (const c of [this.a, this.b]) {
      if (c.width !== W || c.height !== H) {
        c.width = W;
        c.height = H;
      }
    }
    return [this.a, this.b] as const;
  }

  render(
    ctx: CanvasRenderingContext2D,
    t: number,
    images: readonly FlashImage[],
    s: FlashSettings,
    tl: Timeline,
  ) {
    const { width: W, height: H } = ASPECTS[s.aspect];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (tl.clips.length === 0) {
      ctx.fillStyle = s.background;
      ctx.fillRect(0, 0, W, H);
      return;
    }

    const time = clamp(t, 0, tl.total);
    const k = clipIndexAt(tl, time);
    const clip = tl.clips[k];
    const local = time - clip.start;
    const len = k > 0 && s.transition !== "none" ? Math.min(s.transitionDuration, clip.duration) : 0;

    if (len > 0 && local < len) {
      const [a, b] = this.buffers(W, H);
      const actx = a.getContext("2d");
      const bctx = b.getContext("2d");
      if (actx && bctx) {
        for (const c of [actx, bctx]) {
          c.imageSmoothingEnabled = true;
          c.imageSmoothingQuality = "high";
        }
        paintClip(actx, tl.clips[k - 1], images, s, W, H);
        paintClip(bctx, clip, images, s, W, H);
        composite(ctx, a, b, local / len, s.transition, s.background, W, H);
        return;
      }
    }
    paintClip(ctx, clip, images, s, W, H);
  }
}
