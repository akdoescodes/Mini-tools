"use client";

import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { CloseIcon } from "./icons";

/* ═══════════════════════════════════════════════════════════════════
   Dialog (modal) — built on Base UI: focus trap, scroll lock, Esc,
   outside-click, ARIA wiring and enter/exit animation are handled.

   <Dialog open={open} onOpenChange={setOpen}>
     <DialogTrigger render={<Button>Open</Button>} />     // optional
     <DialogContent>
       <DialogHeader icon={<…/>} title="Title" description="Text" />
       …body…
       <DialogActions>
         <DialogClose render={<Button variant="text">Cancel</Button>} />
         <Button onClick={save}>Save</Button>
       </DialogActions>
     </DialogContent>
   </Dialog>
   ═══════════════════════════════════════════════════════════════════ */

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

const backdropClass =
  "fixed inset-0 min-h-dvh bg-scrim/40 transition-opacity duration-medium2 ease-standard data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute";

const contentVariants = cva(
  [
    "fixed top-1/2 left-1/2 flex max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto",
    "rounded-2xl bg-surface-container-high p-6 text-on-surface shadow-elevation-3 outline-none",
    "transition-[opacity,scale] duration-medium2 ease-emphasized-decelerate",
    "data-starting-style:scale-90 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "w-[min(22rem,calc(100vw-2rem))]",
        md: "w-[min(30rem,calc(100vw-2rem))]",
        lg: "w-[min(44rem,calc(100vw-2rem))]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export function DialogContent({
  className,
  size,
  showClose = false,
  children,
  ...props
}: ComponentProps<typeof BaseDialog.Popup> &
  VariantProps<typeof contentVariants> & { showClose?: boolean; className?: string }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={backdropClass} />
      <BaseDialog.Popup className={cn(contentVariants({ size }), className)} {...props}>
        {showClose && (
          <BaseDialog.Close
            aria-label="Close"
            className="state-layer absolute top-3 right-3 grid size-10 place-items-center rounded-full text-on-surface-variant"
          >
            <CloseIcon />
          </BaseDialog.Close>
        )}
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof BaseDialog.Title> & { className?: string }) {
  return <BaseDialog.Title className={cn("type-headline-sm text-on-surface", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Description> & { className?: string }) {
  return (
    <BaseDialog.Description className={cn("type-body-md text-on-surface-variant", className)} {...props} />
  );
}

/** M3 dialog header: optional hero icon (centres the header), headline, supporting text. */
export function DialogHeader({
  icon,
  title,
  description,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex flex-col gap-3", icon && "items-center text-center", className)}>
      {icon && <span className="text-secondary [&_svg]:size-6">{icon}</span>}
      <DialogTitle>{title}</DialogTitle>
      {description && <DialogDescription>{description}</DialogDescription>}
    </div>
  );
}

export function DialogActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-6 flex flex-wrap items-center justify-end gap-2", className)} {...props} />;
}

/* ───────────────────────── ConfirmDialog ─────────────────────────
   One-liner for "are you sure?" flows (role=alertdialog, no outside dismiss). */

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={backdropClass} />
        <BaseAlertDialog.Popup className={contentVariants({ size: "sm" })}>
          <div className={cn("flex flex-col gap-3", icon && "items-center text-center")}>
            {icon && <span className={cn("[&_svg]:size-6", destructive ? "text-error" : "text-secondary")}>{icon}</span>}
            <BaseAlertDialog.Title className="type-headline-sm">{title}</BaseAlertDialog.Title>
            {description && (
              <BaseAlertDialog.Description className="type-body-md text-on-surface-variant">
                {description}
              </BaseAlertDialog.Description>
            )}
          </div>
          <DialogActions>
            <BaseAlertDialog.Close render={<Button variant="text">{cancelLabel}</Button>} />
            <Button
              variant="filled"
              className={cn(destructive && "bg-error text-on-error")}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
