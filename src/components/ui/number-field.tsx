"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { cn } from "@/lib/cn";

/**
 * Compact numeric input with a unit suffix. Arrow keys step (Shift = ×10),
 * the value commits on blur / Enter so typing "0.5" never flashes "0".
 */
export function NumberField({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  unit,
  label,
  disabled,
  className,
}: {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Accessible name */
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const decimals = step < 1 ? Math.max(0, Math.ceil(-Math.log10(step))) : 0;
  return (
    <BaseNumberField.Root
      value={value}
      onValueCommitted={(v) => {
        if (v !== null && v !== value) onValueChange(v);
      }}
      min={min}
      max={max}
      step={step}
      smallStep={step}
      largeStep={step * 10}
      format={{ maximumFractionDigits: decimals }}
      disabled={disabled}
      className={cn("inline-flex", className)}
    >
      <BaseNumberField.Group
        className={cn(
          "inline-flex h-8 items-center rounded-sm border border-outline-variant bg-surface-container-lowest px-2 type-label-lg text-on-surface tabular-nums",
          "transition-colors duration-short2 focus-within:border-primary focus-within:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)]",
          "data-disabled:opacity-(--md-sys-state-disabled-opacity)",
        )}
      >
        <BaseNumberField.Input
          aria-label={label}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          onFocus={(e) => e.currentTarget.select()}
          className="w-11 bg-transparent text-right outline-none"
        />
        {unit && (
          <span aria-hidden="true" className="pl-0.5 text-on-surface-variant">
            {unit}
          </span>
        )}
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
