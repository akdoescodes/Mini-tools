"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon } from "./icons";

export interface ChoiceOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

/* ───────────────────────── SegmentedButton ─────────────────────────
   Single-select. Arrow keys move between segments (radio semantics). */

export function SegmentedButton<T extends string>({
  label,
  value,
  onValueChange,
  options,
  className,
}: {
  /** Accessible group name */
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  options: ChoiceOption<T>[];
  className?: string;
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(v) => onValueChange(v as T)}
      className={cn("flex w-full overflow-hidden rounded-full border border-outline", className)}
    >
      {options.map((o) => (
        <Radio.Root
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cn(
            "state-layer flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 px-3 type-label-lg whitespace-nowrap text-on-surface select-none",
            "border-l border-outline first:border-l-0",
            "transition-colors duration-short4 data-checked:bg-secondary-container data-checked:text-on-secondary-container",
            "focus-visible:-outline-offset-(--app-focus-ring-width) data-disabled:cursor-not-allowed data-disabled:opacity-(--md-sys-state-disabled-opacity)",
          )}
        >
          <Radio.Indicator render={<CheckIcon size={18} />} />
          {o.icon}
          <span className="truncate">{o.label}</span>
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}

/* ───────────────────────── ChoiceChips ─────────────────────────
   Single-select filter chips (wraps onto multiple lines). */

export function ChoiceChips<T extends string>({
  label,
  value,
  onValueChange,
  options,
  className,
}: {
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  options: ChoiceOption<T>[];
  className?: string;
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(v) => onValueChange(v as T)}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((o) => (
        <Radio.Root
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cn(
            "state-layer inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-outline-variant px-3 type-label-lg text-on-surface-variant select-none",
            "transition-[border-radius,background-color,border-color] duration-short4 ease-emphasized",
            "data-checked:rounded-lg data-checked:border-transparent data-checked:bg-secondary-container data-checked:pl-2 data-checked:text-on-secondary-container",
            "data-disabled:cursor-not-allowed data-disabled:opacity-(--md-sys-state-disabled-opacity)",
          )}
        >
          <Radio.Indicator render={<CheckIcon size={18} />} />
          {o.icon}
          {o.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}

/* ───────────────────────── Switch ───────────────────────── */

export function Switch({
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="type-title-sm">
        {label}
      </label>
      <BaseSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "group relative inline-flex h-8 w-13 shrink-0 cursor-pointer items-center rounded-full border-2 border-outline bg-surface-container-highest",
          "transition-colors duration-short4 data-checked:border-primary data-checked:bg-primary",
          "data-disabled:cursor-not-allowed data-disabled:opacity-(--md-sys-state-disabled-opacity)",
        )}
      >
        <BaseSwitch.Thumb
          className={cn(
            "ml-1.5 size-4 rounded-full bg-outline transition-all duration-short4 ease-emphasized",
            "group-active:size-7 group-active:ml-0.5",
            "data-checked:ml-[22px] data-checked:size-6 data-checked:bg-on-primary group-active:data-checked:ml-[20px] group-active:data-checked:size-7",
          )}
        />
      </BaseSwitch.Root>
    </div>
  );
}
