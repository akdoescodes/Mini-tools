/**
 * HTML + CSS export: rebuilds the slideshow as pure CSS @keyframes (no JS),
 * matching the canvas engine's timing, gaps and transitions. Output is meant
 * to be readable, both by people and by AI coding agents used as a reference.
 */
import { strToU8, zipSync, type Zippable } from "fflate";
import {
  ASPECTS,
  imageDuration,
  type Clip,
  type FlashImage,
  type FlashSettings,
  type Timeline,
  type TransitionKind,
} from "./engine";
import { SITE } from "@/lib/site";

export type CodePackage = "zip" | "single";

export interface CodeFiles {
  html: string;
  css: string;
  json: string;
  readme: string;
}

export interface CodeExport {
  blob: Blob;
  filename: string;
  files: CodeFiles;
  /** Self-contained HTML using blob: URLs, for an in-app preview iframe */
  previewHtml: string;
  /** Frees the preview blob: URLs */
  dispose: () => void;
}

/* ───────────────────────── keyframes ───────────────────────── */

interface Style {
  o: number; // opacity
  tx: number; // translateX %
  s: number; // scale
  clipL: number; // clip-path inset left %
  clipR: number; // clip-path inset right %
}
type Ease = "hold" | "curve" | "rise" | "fall";
interface Frame {
  t: number;
  st: Style;
  ease: Ease;
}

const V: Style = { o: 1, tx: 0, s: 1, clipL: 0, clipR: 0 };
const H: Style = { ...V, o: 0 };

const EASE_CSS: Record<Ease, string> = {
  hold: "steps(1, end)",
  curve: "cubic-bezier(0.65, 0, 0.35, 1)", // ≈ easeInOutCubic, same as the canvas engine
  rise: "cubic-bezier(0.2, 0.8, 0.4, 1)",
  fall: "cubic-bezier(0.6, 0, 0.8, 0.2)",
};

function enterFrom(kind: TransitionKind): Style {
  switch (kind) {
    case "fade":
      return { ...V, o: 0 };
    case "slide":
      return { ...V, tx: 100 };
    case "zoom":
      return { ...V, o: 0, s: 1.25 };
    case "wipe":
      return { ...V, clipR: 100 };
    default:
      return V;
  }
}

/** Where the outgoing image ends up; null = it stays put under the incoming one. */
function exitTo(kind: TransitionKind, intoGap: boolean): Style | null {
  switch (kind) {
    case "fade":
      return intoGap ? { ...V, o: 0 } : null;
    case "slide":
      return { ...V, tx: -100 };
    case "zoom":
      return intoGap ? { ...V, s: 1.25, o: 0 } : { ...V, s: 1.25 };
    case "wipe":
      return intoGap ? { ...V, clipL: 100 } : null;
    default:
      return null;
  }
}

function transitionLen(clips: Clip[], j: number, s: FlashSettings) {
  if (j <= 0 || j >= clips.length || s.transition === "none") return 0;
  return Math.min(s.transitionDuration, clips[j].duration);
}

function slideFrames(clips: Clip[], k: number, s: FlashSettings, total: number): Frame[] {
  const kind = s.transition;
  const start = clips[k].start;
  const end = start + clips[k].duration;
  const lin = transitionLen(clips, k, s);
  const lout = transitionLen(clips, k + 1, s);
  const eps = Math.min(0.002, total / 10000);
  const f: Frame[] = [];

  // Enter
  if (k === 0) f.push({ t: 0, st: V, ease: "hold" });
  else {
    f.push({ t: 0, st: H, ease: "hold" });
    if (lin === 0) f.push({ t: start, st: V, ease: "hold" });
    else if (kind === "flash") f.push({ t: start + lin / 2, st: V, ease: "hold" });
    else {
      f.push({ t: start, st: enterFrom(kind), ease: "curve" });
      f.push({ t: start + lin, st: V, ease: "hold" });
    }
  }

  // Exit
  if (k + 1 < clips.length) {
    if (lout === 0) f.push({ t: end, st: H, ease: "hold" });
    else if (kind === "flash") f.push({ t: end + lout / 2, st: H, ease: "hold" });
    else {
      const to = exitTo(kind, clips[k + 1].kind === "gap");
      if (to) {
        f.push({ t: end, st: V, ease: "curve" });
        f.push({ t: end + lout, st: to, ease: "hold" });
        if (end + lout + eps < total) f.push({ t: end + lout + eps, st: H, ease: "hold" });
      } else {
        f.push({ t: end + lout, st: H, ease: "hold" });
      }
    }
  }

  f.push({ t: total, st: f[f.length - 1].st, ease: "hold" });
  return f;
}

function overlayFrames(clips: Clip[], s: FlashSettings, total: number): Frame[] {
  const W: Style = { ...V, o: 0 };
  const f: Frame[] = [{ t: 0, st: W, ease: "hold" }];
  for (let k = 1; k < clips.length; k++) {
    const len = transitionLen(clips, k, s);
    if (len === 0) continue;
    const at = clips[k].start;
    f.push({ t: at, st: W, ease: "rise" });
    f.push({ t: at + len / 2, st: { ...W, o: 1 }, ease: "fall" });
    f.push({ t: at + len, st: W, ease: "hold" });
  }
  f.push({ t: total, st: W, ease: "hold" });
  return f;
}

const num = (n: number, d = 4) => String(Number(n.toFixed(d)));

function styleCss(st: Style, kind: TransitionKind): string {
  const parts = [`opacity: ${num(st.o, 3)}`];
  if (kind === "slide") parts.push(`transform: translateX(${num(st.tx, 2)}%)`);
  if (kind === "zoom") parts.push(`transform: scale(${num(st.s, 3)})`);
  if (kind === "wipe") parts.push(`clip-path: inset(0 ${num(st.clipR, 2)}% 0 ${num(st.clipL, 2)}%)`);
  return parts.join("; ");
}

function keyframesCss(name: string, frames: Frame[], total: number, kind: TransitionKind): string {
  // percent → frame (later frames at the same percent win)
  const byPct = new Map<string, Frame>();
  for (const fr of frames) byPct.set(`${num((fr.t / total) * 100)}%`, fr);
  const lines = [...byPct.entries()].map(([pct, fr], i, arr) => {
    const last = i === arr.length - 1;
    const timing = last ? "" : ` animation-timing-function: ${EASE_CSS[fr.ease]};`;
    return `  ${pct.padStart(9)} { ${styleCss(fr.st, kind)};${timing} }`;
  });
  return `@keyframes ${name} {\n${lines.join("\n")}\n}`;
}

/* ───────────────────────── files ───────────────────────── */

const slug = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";

const TRANSITION_LABEL: Record<TransitionKind, string> = {
  none: "no transition",
  fade: "fade",
  slide: "slide",
  zoom: "zoom",
  wipe: "wipe",
  flash: "white flash",
};

function describe(images: FlashImage[], s: FlashSettings, tl: Timeline) {
  const timing = s.durationMode === "all" ? `${s.duration}s per image` : "custom time per image";
  const gap = s.gap > 0 ? `${s.gap}s gap` : "no gap";
  const tr = s.transition === "none" ? "no transition" : `${TRANSITION_LABEL[s.transition]} ${s.transitionDuration}s`;
  return `${images.length} images · ${timing} · ${gap} · ${tr} · total ${tl.total.toFixed(2)}s · ${s.loop ? "loops" : "plays once"}`;
}

export function buildCode(
  images: FlashImage[],
  s: FlashSettings,
  tl: Timeline,
  srcs: string[],
  options: { inlineCss: boolean },
): CodeFiles {
  const { width, height } = ASPECTS[s.aspect];
  const total = Math.max(tl.total, 0.001);
  const kind = s.transition;
  const usesOverlay = kind === "flash";

  const timelineLines = tl.clips.map((c) => {
    const range = `${c.start.toFixed(2)}s → ${(c.start + c.duration).toFixed(2)}s`.padEnd(18);
    return c.kind === "gap"
      ? ` *   ${range} gap (background colour)`
      : ` *   ${range} image ${c.imageIndex + 1}  ${srcs[c.imageIndex].startsWith("data:") ? images[c.imageIndex].name : srcs[c.imageIndex]}`;
  });

  const slideRules = images.map((_, i) => `.flash__slide--${i + 1} { animation-name: flash-slide-${i + 1}; }`);
  const keyframes = tl.clips
    .filter((c) => c.kind === "image")
    .map((c) => {
      const k = tl.clips.indexOf(c);
      return keyframesCss(`flash-slide-${c.imageIndex + 1}`, slideFrames(tl.clips, k, s, total), total, kind);
    });

  const css = `/*
 * Flash slideshow (pure CSS, no JavaScript)
 * ${describe(images, s, tl)}
 * Output ${width}×${height} · images ${s.fit === "cover" ? "fill the frame (cropped)" : "fit inside the frame"}
 *
 * Timeline
${timelineLines.join("\n")}
 *
 * How it works: all images are stacked inside .flash. Each one has its own
 * @keyframes that spans the whole loop (--flash-duration); percentages are
 * moments in that loop. "steps(1, end)" holds a state until the next keyframe,
 * the cubic-bezier segments are the ${kind === "none" ? "" : `${TRANSITION_LABEL[kind]} `}transitions.
 */

.flash {
  --flash-duration: ${num(total, 3)}s;
  --flash-background: ${s.background};
  position: relative;
  width: min(100%, calc(85vh * ${width} / ${height}));
  aspect-ratio: ${width} / ${height};
  overflow: hidden;
  background: var(--flash-background);
}

.flash__slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: ${s.fit};
  opacity: 0;
  animation-duration: var(--flash-duration);
  animation-iteration-count: ${s.loop ? "infinite" : "1"};
  animation-fill-mode: both;
  backface-visibility: hidden;
}

${slideRules.join("\n")}
${
  usesOverlay
    ? `
/* White flash between images */
.flash__overlay {
  position: absolute;
  inset: 0;
  background: #ffffff;
  opacity: 0;
  pointer-events: none;
  animation: flash-white var(--flash-duration) ${s.loop ? "infinite" : "1"} both;
}
`
    : ""
}
${keyframes.join("\n\n")}
${usesOverlay ? `\n${keyframesCss("flash-white", overlayFrames(tl.clips, s, total), total, "fade")}\n` : ""}
/* Reduced motion: show the first image only */
@media (prefers-reduced-motion: reduce) {
  .flash__slide,
  .flash__overlay {
    animation: none;
  }
  .flash__slide--1 {
    opacity: 1;
  }
}
`;

  const imgTags = images
    .map((img, i) => `    <img class="flash__slide flash__slide--${i + 1}" src="${srcs[i]}" alt="" decoding="async" />`)
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Flash slideshow</title>
${options.inlineCss ? `    <style>\n${css}\n    </style>` : `    <link rel="stylesheet" href="flash.css" />`}
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #141110; }
    </style>
  </head>
  <body>
    <!-- ${describe(images, s, tl)} -->
    <div class="flash" role="img" aria-label="Slideshow of ${images.length} images">
${imgTags}${usesOverlay ? `\n    <div class="flash__overlay" aria-hidden="true"></div>` : ""}
    </div>
  </body>
</html>
`;

  const json = JSON.stringify(
    {
      $schema: "flash-slideshow/v1",
      generator: `${SITE.name} · Flash Image Generator (${SITE.repo})`,
      output: { width, height, fit: s.fit, background: s.background, fps: s.fps },
      timing: {
        mode: s.durationMode === "all" ? "same-for-all" : "per-image",
        secondsPerImage: s.duration,
        gapSeconds: s.gap,
        transition: s.transition,
        transitionSeconds: s.transition === "none" ? 0 : s.transitionDuration,
        transitionPlacement: "start of each clip after the first, inside that clip's time",
        loop: s.loop,
        totalSeconds: Number(tl.total.toFixed(3)),
      },
      images: images.map((img, i) => ({
        index: i + 1,
        file: srcs[i].startsWith("data:") ? null : srcs[i],
        originalName: img.name,
        seconds: imageDuration(img, s),
      })),
      clips: tl.clips.map((c) => ({
        type: c.kind,
        image: c.kind === "image" ? c.imageIndex + 1 : null,
        start: Number(c.start.toFixed(3)),
        end: Number((c.start + c.duration).toFixed(3)),
      })),
    },
    null,
    2,
  );

  const readme = `# Flash slideshow (HTML + CSS)

${describe(images, s, tl)}.

Open \`index.html\` in any browser. No JavaScript, no build step.

## Files

| File | What it is |
| --- | --- |
| \`index.html\` | The slideshow markup: one \`<img>\` per image, stacked |
| \`flash.css\` | All timing and transitions as CSS \`@keyframes\` |
| \`flash.json\` | Machine-readable timeline (clips, start/end seconds, settings) |
| \`images/\` | The images, resized to fit ${width}×${height} |

## Using it with an AI coding agent

Give the agent this folder and a prompt such as:

> Use \`flash.json\` as the spec and \`flash.css\` as the reference implementation.
> Build the same slideshow as a reusable component in my project
> (React / Vue / Svelte / plain HTML), keeping the exact timing and transitions.

## Customising

- Speed: change \`--flash-duration\` in \`flash.css\` to stretch or squeeze the whole loop.
- Background and gap colour: \`--flash-background\`.
- Size: \`.flash\` keeps a ${width}:${height} ratio and scales to its container.

Generated with ${SITE.name} · Flash Image Generator (${SITE.repo}).
`;

  return { html, css, json, readme };
}

/* ───────────────────────── packaging ───────────────────────── */

async function encodeImage(img: FlashImage, maxSide: number): Promise<{ blob: Blob; ext: string }> {
  const k = Math.min(1, maxSide / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(img.width * k));
  c.height = Math.max(1, Math.round(img.height * k));
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available in this browser.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img.source, 0, 0, c.width, c.height);
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", 0.86));
  if (!blob) throw new Error("Could not encode an image.");
  return { blob, ext: blob.type === "image/webp" ? "webp" : "png" };
}

const blobToDataUrl = (b: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(b);
  });

export async function exportCode(
  images: FlashImage[],
  s: FlashSettings,
  tl: Timeline,
  pkg: CodePackage,
): Promise<CodeExport> {
  const { width, height } = ASPECTS[s.aspect];
  const encoded = await Promise.all(images.map((img) => encodeImage(img, Math.max(width, height))));
  const paths = encoded.map((e, i) => `images/${String(i + 1).padStart(2, "0")}-${slug(images[i].name)}.${e.ext}`);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

  // Preview: same page, images as blob: URLs (fast; srcdoc iframes share our origin)
  const previewUrls = encoded.map((e) => URL.createObjectURL(e.blob));
  const previewHtml = buildCode(images, s, tl, previewUrls, { inlineCss: true }).html;
  const dispose = () => previewUrls.forEach((u) => URL.revokeObjectURL(u));

  if (pkg === "single") {
    const dataUrls = await Promise.all(encoded.map((e) => blobToDataUrl(e.blob)));
    const files = buildCode(images, s, tl, dataUrls, { inlineCss: true });
    const display = buildCode(images, s, tl, paths, { inlineCss: false }); // readable code for the dialog
    return {
      blob: new Blob([files.html], { type: "text/html" }),
      filename: `flash-${stamp}.html`,
      files: display,
      previewHtml,
      dispose,
    };
  }

  const files = buildCode(images, s, tl, paths, { inlineCss: false });
  const tree: Zippable = {
    "index.html": strToU8(files.html),
    "flash.css": strToU8(files.css),
    "flash.json": strToU8(files.json),
    "README.md": strToU8(files.readme),
    images: {},
  };
  const imagesDir = tree.images as Zippable;
  await Promise.all(
    encoded.map(async (e, i) => {
      // already compressed → store without deflate
      imagesDir[paths[i].slice("images/".length)] = [new Uint8Array(await e.blob.arrayBuffer()), { level: 0 }];
    }),
  );
  const zipped = zipSync({ [`flash-${stamp}`]: tree }, { level: 6 });
  return {
    blob: new Blob([zipped as BlobPart], { type: "application/zip" }),
    filename: `flash-${stamp}.zip`,
    files,
    previewHtml,
    dispose,
  };
}

