import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const TYPE_STYLES = [
  "hero",
  ...["display", "headline", "title", "body", "label"].flatMap((r) =>
    ["lg", "md", "sm"].map((s) => `${r}-${s}`),
  ),
];

/** tailwind-merge that understands the design-system token utilities. */
const twMerge = extendTailwindMerge<"type-scale">({
  extend: {
    theme: {
      shadow: ["elevation-1", "elevation-2", "elevation-3", "elevation-4", "elevation-5", "soft", "float", "stage"],
      ease: ["standard", "emphasized", "emphasized-decelerate", "emphasized-accelerate"],
    },
    classGroups: {
      "type-scale": [{ type: TYPE_STYLES }],
    },
    conflictingClassGroups: {
      "type-scale": ["font-size", "leading", "tracking", "font-weight", "font-family"],
    },
  },
});

/** Merge class names; later classes win over earlier conflicting ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
