import type { MetadataRoute } from "next";
import { absoluteUrl, TOOLS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...TOOLS.map((t) => ({ url: absoluteUrl(t.href), changeFrequency: "weekly" as const, priority: 0.9 })),
    { url: absoluteUrl("/design-system"), changeFrequency: "monthly", priority: 0.3 },
  ];
}
