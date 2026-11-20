"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { NumberField } from "./number-field";

/* ═══════════════════════════════════════════════════════════════════
   M3 Expressive slider: thick track, bar handle with a gap around it.
   The gap colour must match what the slider sits on; set it with
   `--slider-gap` on any ancestor (defaults to surface-container-low).
   `tone="inverse"` is for dark surfaces.
   ═══════════════════════════════════════════════════════════════════ */

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Accessible name (use when there's no visible label) */
  label?: string;
  tone?: "surface" | "inverse";
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  label,
  tone = "surface",
  className,
  children,
}: SliderProps & { children?: ReactNode }) {
  const inverse = tone === "inverse";
  return (
    <BaseSlider.Root
      value={value}
      onValueChange={(v) => onValueChange(Array.isArray(v) ? v[0] : v)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={cn("w-full data-disabled:opacity-(--md-sys-state-disabled-opacity)", className)}
    >
      {children}
      <BaseSlider.Control className="flex h-11 w-full touch-none items-center select-none data-disabled:cursor-not-allowed">
        <BaseSlider.Track
          className={cn("relative h-4 w-full rounded-full", inverse ? "bg-white/15" : "bg-secondary-container")}
        >
          <BaseSlider.Indicator className={cn("rounded-full", inverse ? "bg-primary-container" : "bg-primary")} />
          <BaseSlider.Thumb
            aria-label={label}
            className={cn(
              "h-10 w-1 cursor-grab rounded-full transition-[width] duration-short2 active:w-0.5 data-dragging:cursor-grabbing",
              "has-focus-visible:outline-(length:--app-focus-ring-width) has-focus-visible:outline-offset-4 has-focus-visible:outline-primary has-focus-visible:outline-solid",
              inverse
                ? "bg-primary-container shadow-[0_0_0_5px_var(--slider-gap,var(--md-sys-color-inverse-surface))]"
                : "bg-primary shadow-[0_0_0_5px_var(--slider-gap,var(--md-sys-color-surface-container-low))]",
            )}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

/** Label + editable number + slider + hint, all wired together. */
export function SliderField({
  label,
  hint,
  unit = "s",
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
}: Omit<SliderProps, "label" | "tone" | "className"> & { label: string; hint?: ReactNode; unit?: string }) {
  return (
    <div className={cn(disabled && "[&_.field-text]:opacity-(--md-sys-state-disabled-opacity)")}>
      <Slider value={value} onValueChange={onValueChange} min={min} max={max} step={step} disabled={disabled}>
        <div className="flex items-center justify-between gap-3">
          <BaseSlider.Label className="field-text type-title-sm">{label}</BaseSlider.Label>
          <NumberField
            label={`${label} (${unit === "s" ? "seconds" : unit})`}
            value={value}
            onValueChange={onValueChange}
            min={min}
            max={max}
            step={step}
            unit={unit}
            disabled={disabled}
          />
        </div>
      </Slider>
      {hint && <p className="field-text mt-1 type-body-sm text-on-surface-variant">{hint}</p>}
    </div>
  );
}
