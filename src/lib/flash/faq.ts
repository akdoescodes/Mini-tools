import { SITE } from "@/lib/site";

/** Shown on the tool page and emitted as FAQPage structured data: keep both in sync by editing only here. */
export const FLASH_FAQ: { id: string; q: string; a: string }[] = [
  {
    id: "free-slideshow",
    q: "How do I make a slideshow video from photos for free?",
    a: "Open the Flash Image Generator, drop in your photos, choose how many seconds each one shows and the gap between them, pick a transition, then press Export. You get an MP4 or WebM video. It's free, with no sign-up and no watermark.",
  },
  {
    id: "privacy",
    q: "Are my photos uploaded anywhere?",
    a: "No. Decoding, previewing and video encoding all happen in your browser on your own device. Your images never leave your computer, and there's no account, analytics or tracking.",
  },
  {
    id: "per-image",
    q: "Can each image show for a different amount of time?",
    a: "Yes. Switch Timing to “Per image” and type a time for any image, from 0.1 to 10 seconds. Images without a custom time use the default.",
  },
  {
    id: "gap",
    q: "What is the gap between images?",
    a: "A blank screen in your chosen background colour, shown between images for 0 to 5 seconds. Set it to 0 to make images follow each other directly.",
  },
  {
    id: "transitions",
    q: "Which transitions can I use?",
    a: "None, fade, slide, zoom, wipe and a white flash. You choose the transition length (0.1 to 2 seconds) and see it live in the preview.",
  },
  {
    id: "formats",
    q: "Which video formats and sizes can I export?",
    a: "MP4 or WebM (depending on what your browser supports) at 1080×1080 square, 1080×1350 portrait, 1080×1920 story/reel or 1920×1080 widescreen, at 24, 30 or 60 fps.",
  },
  {
    id: "html-css",
    q: "What is the HTML + CSS export for?",
    a: "It recreates your slideshow as a pure CSS animation with no JavaScript. Put it on a website, or give it to an AI coding agent as an exact reference: the download includes the HTML, the CSS, a JSON timeline and a README.",
  },
  {
    id: "no-editor",
    q: "Do I need to install anything or learn a video editor?",
    a: "No. It runs in any modern browser (Chrome, Edge, Firefox or Safari) on desktop or phone. There's no software to install and no editing timeline to learn.",
  },
  {
    id: "open-source",
    q: `Is ${SITE.name} open source?`,
    a: `Yes. The full source code is public on GitHub (${SITE.repo}) under the MIT license, so you can read exactly what it does, run it yourself or contribute.`,
  },
];
