/** Brand, URLs, SEO copy and the tool registry. Rename the site here. */

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE = {
  name: "Mini Tools",
  /** Headline shown in pixel font on the home page */
  wordmark: "MINI TOOLS",
  tagline: "Free, private creative tools that run right in your browser.",
  description:
    "Mini Tools is a free, open-source collection of small creative tools that run entirely in your browser. No sign-up, no uploads, no watermark. Start with the Flash Image Generator: turn photos into a timed slideshow video.",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL in production (Vercel sets the fallback automatically). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")).replace(
    /\/$/,
    "",
  ),
  repo: "https://github.com/akdoescodes/Mini-tools",
  keywords: [
    "free online tools",
    "browser tools",
    "image slideshow maker",
    "photo to video",
    "flash image generator",
    "slideshow video maker",
    "no sign-up",
    "no watermark",
    "open source",
    "privacy friendly",
  ],
} as const;

export type ToolIcon = "bolt";

export interface ToolEntry {
  slug: string;
  href: string;
  name: string;
  short: string;
  description: string;
  icon: ToolIcon;
  badge?: string;
}

export const TOOLS: readonly ToolEntry[] = [
  {
    slug: "flash-image",
    href: "/tools/flash-image",
    name: "Flash Image Generator",
    short: "Flash Image",
    description: "Turn images into a timed slideshow video",
    icon: "bolt",
    badge: "New",
  },
];

/** Secondary links shown at the bottom of the navigation drawer */
export const META_LINKS = [{ href: "/design-system", label: "Design system" }] as const;

/** Absolute URL for a path on this site */
export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
