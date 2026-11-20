import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { JsonLd } from "@/components/JsonLd";
import {
  BoltIcon,
  BurstGlyph,
  buttonVariants,
  Card,
  cardVariants,
  CodeIcon,
  GitHubIcon,
  LockIcon,
  NorthEastIcon,
  RingGlyph,
  Shape,
  ShapedIcon,
  SparkleGlyph,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { clipShape } from "@/lib/shapes";
import { absoluteUrl, SITE, TOOLS } from "@/lib/site";

const FLASH_TOOL = TOOLS[0];

/* Abstract "photos" that flash inside the hero shape (colours from theme.css) */
const FLASH_LAYERS = ["var(--app-art-1)", "var(--app-art-2)", "var(--app-art-3)", "var(--app-art-4)"];

type Glyph = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const HERO_CARDS: { chip: string; caption: string; glyph: Glyph; featured?: boolean }[] = [
  { chip: "Timing", caption: "Set seconds per image", glyph: SparkleGlyph },
  { chip: "Flash Image", caption: "Open the generator", glyph: RingGlyph, featured: true },
  { chip: "Motion", caption: "Fade · slide · zoom · wipe", glyph: BurstGlyph },
];

const STEPS = [
  {
    n: "01",
    title: "Drop your images",
    body: "Add as many as you like, then drag them into the order you want.",
    variant: "secondary",
  },
  {
    n: "02",
    title: "Set time & gap",
    body: "Same seconds for every image, or a custom time for each one, plus a blank gap between them.",
    variant: "tertiary",
  },
  {
    n: "03",
    title: "Pick a transition",
    body: "Fade, slide, zoom, wipe or a white flash. Preview it live, then export a video.",
    variant: "info",
  },
] as const;

const TRUST = [
  {
    title: "Free, no catch",
    body: "No sign-up, no paywall, no watermark on your exports. Open the page and use it.",
    tone: "tertiary",
    icon: <BoltIcon />,
  },
  {
    title: "Private by design",
    body: "Your files are processed on your own device, in the browser. Nothing is uploaded and there is no tracking.",
    tone: "secondary",
    icon: <LockIcon />,
  },
  {
    title: "Open source (MIT)",
    body: "Read exactly how every tool works, run it yourself, or contribute a new one on GitHub.",
    tone: "info",
    icon: <CodeIcon />,
  },
] as const;

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: absoluteUrl("/"),
  description: SITE.description,
  sameAs: [SITE.repo],
};

const floatChip = "animate-float absolute hidden rounded-full px-3.5 py-1.5 type-label-md shadow-elevation-2 md:flex md:items-center md:gap-1";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-page px-2 pb-10 sm:px-4">
      <JsonLd data={WEBSITE_LD} />
      {/* ───────────── Hero ───────────── */}
      <section className="relative mt-3 overflow-hidden rounded-3xl border border-white/80 bg-surface-container-lowest/60 px-4 pt-14 pb-10 sm:rounded-4xl sm:pt-20 sm:pb-14">
        {/* ambient glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-20 size-80 rounded-full bg-(--app-glow-1) blur-3xl" />
          <div className="absolute top-10 -right-24 size-96 rounded-full bg-(--app-glow-2) blur-3xl" />
          <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-(--app-glow-4) opacity-80 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-fit text-left">
          <p className="font-brand text-xl leading-none sm:text-3xl">
            THE<span className="ml-1 inline-block size-2.5 bg-on-surface align-top sm:size-3" />
          </p>
          <h1 className="type-hero">{SITE.wordmark}</h1>
        </div>

        {/* flashing shape */}
        <div className="relative z-0 mx-auto -mt-6 grid w-fit place-items-center sm:-mt-12">
          <div
            className="relative aspect-square w-[min(72vw,360px)] overflow-hidden"
            style={{ clipPath: clipShape("cookie12") }}
          >
            {FLASH_LAYERS.map((bg, i) => (
              <div
                key={bg}
                className="flash-layer absolute inset-0"
                style={{ background: bg, animationDelay: `${i * 1.5}s` }}
              />
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_40%,rgb(0_0_0/0.18))]" />
          </div>

          <span className={cn(floatChip, "top-[22%] -left-36 bg-secondary-container text-on-secondary-container")}>
            1.5s / image
          </span>
          <span
            className={cn(floatChip, "top-[30%] -right-32 bg-tertiary-container text-on-tertiary-container")}
            style={{ animationDelay: "-2s" }}
          >
            gap 0.3s
          </span>
          <span
            className={cn(floatChip, "top-[50%] -left-44 bg-info-container text-on-info-container")}
            style={{ animationDelay: "-4s" }}
          >
            <BoltIcon size={14} /> fade
          </span>
        </div>

        {/* glass cards */}
        <div className="relative z-20 mx-auto -mt-20 grid max-w-3xl grid-cols-3 gap-2 sm:-mt-28 sm:gap-4">
          {HERO_CARDS.map(({ chip, caption, glyph: Glyph, featured }) => (
            <Link
              key={chip}
              href={FLASH_TOOL.href}
              className={cn(
                cardVariants({ variant: featured ? "glass-inverse" : "glass", radius: "xl", padding: "none" }),
                "state-layer group flex flex-col items-center gap-4 px-2 pt-3 pb-4 text-center transition-transform duration-medium2 ease-emphasized hover:-translate-y-1 sm:gap-6 sm:rounded-2xl sm:pt-4 sm:pb-6",
                featured && "sm:-translate-y-2 sm:hover:-translate-y-3",
              )}
            >
              <span
                className={cn(
                  "rounded-full px-3 py-1 type-label-sm sm:px-4 sm:type-label-md",
                  featured ? "bg-white text-on-surface" : "bg-white/70 text-on-surface-variant",
                )}
              >
                {chip}
              </span>
              <Glyph size={30} className="transition-transform duration-long2 group-hover:rotate-90" />
              <span className="max-w-[12ch] type-label-sm tracking-wide uppercase">{caption}</span>
            </Link>
          ))}
        </div>

        <div className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={FLASH_TOOL.href} className={buttonVariants({ variant: "accent", size: "lg" })}>
            <BoltIcon size={20} />
            Make a flash video
          </Link>
          <span className="flex items-center gap-1.5 type-body-md text-on-surface-variant">
            <LockIcon size={16} /> Private: runs on your device
          </span>
        </div>
      </section>

      {/* ───────────── How it works (bento) ───────────── */}
      <section aria-labelledby="how-title" className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card variant="inverse" padding="lg" className="flex flex-col justify-between overflow-hidden md:row-span-2 lg:row-span-1">
          <Shape name="sunny8" className="animate-spin-slow absolute -right-10 -bottom-10 size-44 text-primary-container/90" />
          <div className="relative">
            <p className="type-label-md tracking-[0.14em] text-inverse-primary uppercase">Tool 01</p>
            <h2 id="how-title" className="mt-2 type-display-sm">
              FLASH
              <br />
              IMAGE
            </h2>
          </div>
          <Link href={FLASH_TOOL.href} className={cn(buttonVariants({ variant: "accent" }), "relative mt-8 w-fit")}>
            Open tool <NorthEastIcon size={16} />
          </Link>
        </Card>

        {STEPS.map((s) => (
          <Card key={s.n} variant={s.variant} padding="lg" className="flex flex-col">
            <span className="font-brand text-3xl">{s.n}</span>
            <h3 className="mt-6 type-title-lg">{s.title}</h3>
            <p className="mt-1 type-body-md opacity-80">{s.body}</p>
          </Card>
        ))}
      </section>

      {/* ───────────── Trust ───────────── */}
      <section aria-labelledby="why-title" className="mt-10 px-1 sm:mt-14">
        <h2 id="why-title" className="px-1 type-headline-md">
          Free, private and open source
        </h2>
        <p className="mt-2 max-w-2xl px-1 type-body-lg text-on-surface-variant">
          {SITE.name} is a growing set of small tools for everyday creative jobs. No accounts, no uploads, no
          watermarks, and every line of code is public.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {TRUST.map((t) => (
            <Card key={t.title} padding="lg">
              <ShapedIcon tone={t.tone}>{t.icon}</ShapedIcon>
              <h3 className="mt-4 type-title-lg">{t.title}</h3>
              <p className="mt-1 type-body-md text-on-surface-variant">{t.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 px-1">
          <Link href={FLASH_TOOL.href} className={buttonVariants({ variant: "filled" })}>
            <BoltIcon size={18} /> Try the Flash Image Generator
          </Link>
          <a href={SITE.repo} className={buttonVariants({ variant: "outlined" })}>
            <GitHubIcon size={18} /> View the source on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
