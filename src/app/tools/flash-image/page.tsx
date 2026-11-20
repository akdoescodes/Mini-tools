import type { Metadata } from "next";
import { FlashImageGuide } from "@/components/flash/FlashImageGuide";
import { FlashImageTool } from "@/components/flash/FlashImageTool";
import { JsonLd } from "@/components/JsonLd";
import { FLASH_FAQ } from "@/lib/flash/faq";
import { absoluteUrl, SITE } from "@/lib/site";

const TITLE = "Flash Image Generator: free photo slideshow & video maker";
const DESCRIPTION =
  "Turn photos into a slideshow video in seconds. Choose how long each image shows, add gaps and transitions (fade, slide, zoom, wipe, flash), then export MP4, WebM or HTML + CSS. Free, no sign-up, no watermark, and your images never leave your browser.";
const PATH = "/tools/flash-image";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "flash image generator",
    "image slideshow maker",
    "photo slideshow video",
    "photos to video",
    "make video from images",
    "set duration per image",
    "slideshow with transitions",
    "free slideshow maker no watermark",
    "online slideshow no sign up",
    "images to mp4",
    "css slideshow generator",
  ],
  alternates: { canonical: PATH },
  openGraph: { url: PATH, title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Flash Image Generator",
    url: absoluteUrl(PATH),
    description: DESCRIPTION,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (runs in a web browser)",
    browserRequirements: "Requires a modern browser with JavaScript (Chrome, Edge, Firefox or Safari)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Combine many images into one slideshow",
      "Same duration for all images or a custom duration per image",
      "Adjustable gap between images",
      "Fade, slide, zoom, wipe and flash transitions",
      "Export MP4 or WebM video",
      "Export HTML + CSS (pure CSS animation)",
      "Runs locally: images are never uploaded",
    ],
    isPartOf: { "@type": "WebSite", name: SITE.name, url: absoluteUrl("/") },
    sameAs: [SITE.repo],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FLASH_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE.name, item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Flash Image Generator", item: absoluteUrl(PATH) },
    ],
  },
];

export default function FlashImagePage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <FlashImageTool />
      <FlashImageGuide />
    </>
  );
}
