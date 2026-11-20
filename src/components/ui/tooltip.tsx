"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

/** Mount once near the root so neighbouring tooltips open instantly. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <BaseTooltip.Provider delay={400}>{children}</BaseTooltip.Provider>;
}

/**
 * M3 plain tooltip. The child must be a single element that forwards props
 * and ref (all design-system buttons do).
 *
 *   <Tooltip content="Remove"><IconButton label="Remove">…</IconButton></Tooltip>
 */
export function Tooltip({
  content,
  children,
  side = "top",
  disabled,
}: {
  content: ReactNode;
  children: ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}) {
  return (
    <BaseTooltip.Root disabled={disabled}>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="z-50">
          <BaseTooltip.Popup className="origin-(--transform-origin) rounded-xs bg-inverse-surface px-2 py-1 type-body-sm text-inverse-on-surface transition-[transform,opacity] duration-short4 ease-emphasized data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0">
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
