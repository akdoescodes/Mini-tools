"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@/lib/cn";

/** M3 linear progress indicator. `value` 0–100, or null for indeterminate. */
export function LinearProgress({
  value,
  label,
  tone = "surface",
  className,
}: {
  value: number | null;
  label: string;
  tone?: "surface" | "inverse";
  className?: string;
}) {
  const inverse = tone === "inverse";
  return (
    <BaseProgress.Root value={value} aria-label={label} className={cn("w-full", className)}>
      <BaseProgress.Track
        className={cn("relative h-2 overflow-hidden rounded-full", inverse ? "bg-white/15" : "bg-secondary-container")}
      >
        <BaseProgress.Indicator
          className={cn(
            "block h-full rounded-full transition-[width] duration-short2 ease-linear",
            inverse ? "bg-primary-container" : "bg-primary",
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
