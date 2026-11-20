import Link from "next/link";
import {
  Accordion,
  BoltIcon,
  Card,
  CodeIcon,
  GitHubIcon,
  LayersIcon,
  LockIcon,
  MovieIcon,
  ShapedIcon,
  TimerIcon,
} from "@/components/ui";
import { FLASH_FAQ } from "@/lib/flash/faq";
import { SITE } from "@/lib/site";

const FEATURES = [
  {
    icon: <TimerIcon />,
    tone: "secondary",
    title: "Your timing, per image",
    body: "Same seconds for every photo, or a custom time for each one. Add a blank gap between images in any colour.",
  },
  {
    icon: <LayersIcon />,
    tone: "tertiary",
    title: "Simple transitions",
    body: "Fade, slide, zoom, wipe or a white flash. Preview it live before you export.",
  },
  {
    icon: <MovieIcon />,
    tone: "info",
    title: "Real video files",
    body: "Export MP4 or WebM in square, portrait, story or widescreen sizes at 24, 30 or 60 fps.",
  },
  {
    icon: <CodeIcon />,
    tone: "primary",
    title: "HTML + CSS export",
    body: "Get the same slideshow as a pure CSS animation, ready for a website or as a reference for an AI agent.",
  },
  {
    icon: <LockIcon />,
    tone: "secondary",
    title: "Private by design",
    body: "Everything runs in your browser. Your photos are never uploaded. No account, no tracking.",
  },
  {
    icon: <BoltIcon />,
    tone: "tertiary",
    title: "Free, no watermark",
    body: "No sign-up, no paywall and nothing stamped on your video. The code is open source.",
  },
] as const;

const STEPS = [
  "Add your photos: drop them in or click Add images, then drag to reorder.",
  "Choose how long each image shows, and the gap between images.",
  "Pick a transition and its length; press Play to preview.",
  "Export a video (MP4/WebM) or HTML + CSS and download it.",
];

/** Explains the tool to people and search engines. Server-rendered, below the editor. */
export function FlashImageGuide() {
  return (
    <div className="mx-auto mt-12 flex w-full max-w-page flex-col gap-12 px-2 pb-6 sm:px-4">
      <section aria-labelledby="how-to" className="grid gap-6 px-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <h2 id="how-to" className="type-headline-md">
            How to make a slideshow video from photos
          </h2>
          <p className="mt-2 type-body-lg text-on-surface-variant">
            The Flash Image Generator turns a set of images into a timed slideshow, with no video editor to learn.
            It&apos;s free, needs no sign-up and runs entirely in your browser.
          </p>
        </div>
        <ol className="flex flex-col gap-2">
          {STEPS.map((step, i) => (
            <li key={step}>
              <Card padding="sm" className="flex items-center gap-4 pr-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container font-brand text-on-primary-container">
                  {i + 1}
                </span>
                <span className="type-body-lg">{step}</span>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="features">
        <h2 id="features" className="px-2 type-headline-md">
          What you can do
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} padding="lg">
              <ShapedIcon tone={f.tone} size="md">
                {f.icon}
              </ShapedIcon>
              <h3 className="mt-4 type-title-md">{f.title}</h3>
              <p className="mt-1 type-body-md text-on-surface-variant">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq" className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
        <div className="px-2">
          <h2 id="faq" className="type-headline-md">
            Frequently asked questions
          </h2>
          <p className="mt-2 type-body-md text-on-surface-variant">
            Something missing? Open an issue on{" "}
            <Link href={SITE.repo} className="inline-flex items-center gap-1 font-semibold text-primary underline">
              <GitHubIcon size={14} /> GitHub
            </Link>
            .
          </p>
        </div>
        <Accordion items={FLASH_FAQ.map((f) => ({ id: f.id, title: f.q, content: f.a }))} />
      </section>
    </div>
  );
}
