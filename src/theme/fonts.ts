/**
 * Theme fonts. Swap the imports here to change the site's typefaces;
 * theme.css reads them through --font-brand and --font-plain.
 */
import { Plus_Jakarta_Sans, Silkscreen } from "next/font/google";

/** Expressive display face (wordmark, big headings) */
export const brandFont = Silkscreen({
  variable: "--font-brand",
  weight: ["400", "700"],
  subsets: ["latin"],
});

/** Everyday UI face (body, labels, titles) */
export const plainFont = Plus_Jakarta_Sans({
  variable: "--font-plain",
  subsets: ["latin"],
});

export const fontVariables = `${brandFont.variable} ${plainFont.variable}`;
