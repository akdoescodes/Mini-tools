"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* ═══════════════════════════════════════════════════════════════════
   Sheet — a modal panel that slides in from a screen edge
   (navigation drawer, side sheet, bottom sheet). Same behaviour as
   Dialog: focus trap, Esc / scrim to close, scroll lock.

   <Sheet open={open} onOpenChange={setOpen}>
     <SheetTrigger render={<IconButton label="Menu">…</IconButton>} />
     <SheetContent side="left" aria-label="Tools">…</SheetContent>
   </Sheet>
   ═══════════════════════════════════════════════════════════════════ */

export const Sheet = BaseDialog.Root;
export const SheetTrigger = BaseDialog.Trigger;
export const SheetClose = BaseDialog.Close;
export const SheetTitle = BaseDialog.Title;

const sheetVariants = cva(
  [
    "fixed flex flex-col overflow-y-auto bg-surface-container-low text-on-surface shadow-elevation-4 outline-none",
    "transition-transform duration-long2 ease-emphasized-decelerate data-ending-style:duration-medium2 data-ending-style:ease-emphasized-accelerate",
  ],
  {
    variants: {
      side: {
        left: "inset-y-2 left-2 w-[min(340px,calc(100vw-1.5rem))] rounded-2xl p-3 data-starting-style:-translate-x-[calc(100%+1rem)] data-ending-style:-translate-x-[calc(100%+1rem)]",
        right:
          "inset-y-2 right-2 w-[min(400px,calc(100vw-1.5rem))] rounded-2xl p-4 data-starting-style:translate-x-[calc(100%+1rem)] data-ending-style:translate-x-[calc(100%+1rem)]",
        bottom:
          "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl p-4 pt-3 data-starting-style:translate-y-full data-ending-style:translate-y-full",
      },
    },
    defaultVariants: { side: "left" },
  },
);

export function SheetContent({
  className,
  side,
  children,
  ...props
}: ComponentProps<typeof BaseDialog.Popup> & VariantProps<typeof sheetVariants> & { className?: string }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-scrim/40 transition-opacity duration-medium2 ease-standard data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
      <BaseDialog.Popup className={cn(sheetVariants({ side }), className)} {...props}>
        {side === "bottom" && (
          <span aria-hidden="true" className="mx-auto mb-3 h-1 w-8 shrink-0 rounded-full bg-outline-variant" />
        )}
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}
