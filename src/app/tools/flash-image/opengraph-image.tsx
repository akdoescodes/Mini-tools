import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Flash Image Generator: turn photos into a slideshow video for free";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Flash Image Generator"
        title="Photos → slideshow video in seconds"
        subtitle="Set how long each image shows, add gaps and transitions, then export MP4, WebM or HTML + CSS."
        chips={["Free", "No sign-up", "No watermark", "Private"]}
      />
    ),
    size,
  );
}
