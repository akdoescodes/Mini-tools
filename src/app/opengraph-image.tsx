import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Mini Tools: free, private creative tools that run in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Open source"
        title="Free, private tools that run in your browser"
        subtitle="Turn photos into a timed slideshow video, with no sign-up, no uploads and no watermark."
        chips={["100% free", "No sign-up", "Files stay on your device", "MIT licensed"]}
      />
    ),
    size,
  );
}
