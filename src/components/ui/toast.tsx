"use client";

import { Toast } from "@base-ui/react/toast";
import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

/* ═══════════════════════════════════════════════════════════════════
   Toast / Snackbar. Mount <Toaster /> once (root layout), then call
   toast("Saved") from anywhere — components, hooks or plain functions.

   toast("Exported video", { action: { label: "Open", onClick: … } })
   toast.error("Could not read file")
   ═══════════════════════════════════════════════════════════════════ */

const manager = Toast.createToastManager();

interface ToastOptions {
  description?: ReactNode;
  /** ms; 0 = stay until dismissed */
  timeout?: number;
  action?: { label: string; onClick: () => void };
}

function show(type: "default" | "error", title: ReactNode, opts: ToastOptions = {}) {
  return manager.add({
    title,
    type,
    description: opts.description,
    timeout: opts.timeout,
    priority: type === "error" ? "high" : "low",
    actionProps: opts.action ? { children: opts.action.label, onClick: opts.action.onClick } : undefined,
  });
}

export const toast = Object.assign((title: ReactNode, opts?: ToastOptions) => show("default", title, opts), {
  error: (title: ReactNode, opts?: ToastOptions) => show("error", title, opts),
  dismiss: (id?: string) => manager.close(id),
});

export function Toaster() {
  return (
    <Toast.Provider toastManager={manager} limit={3} timeout={4000}>
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 left-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((t) => (
    <Toast.Root
      key={t.id}
      toast={t}
      className={[
        "[--gap:0.5rem] [--peek:0.5rem] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))] [--shrink:calc(1-var(--scale))]",
        "[--height:var(--toast-frontmost-height,var(--toast-height))]",
        "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
        "absolute right-0 bottom-0 left-0 z-[calc(1000-var(--toast-index))] origin-bottom select-none",
        "h-(--height) data-expanded:h-(--toast-height)",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
        "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-starting-style:[transform:translateY(150%)] data-ending-style:opacity-0 data-limited:opacity-0",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "rounded-md shadow-elevation-3 [transition:transform_0.5s_var(--md-sys-motion-easing-emphasized-decelerate),opacity_0.4s,height_0.15s]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        t.type === "error" ? "bg-error-container text-on-error-container" : "bg-inverse-surface text-inverse-on-surface",
      ].join(" ")}
    >
      <Toast.Content className="flex items-center gap-2 overflow-hidden py-1.5 pr-1.5 pl-4 transition-opacity duration-short4 data-behind:opacity-0 data-expanded:opacity-100">
        <div className="flex min-w-0 flex-1 flex-col py-1.5">
          <Toast.Title className="type-body-md" />
          <Toast.Description className="type-body-sm opacity-80" />
        </div>
        <Toast.Action
          className={`state-layer h-9 shrink-0 rounded-full px-3 type-label-lg ${
            t.type === "error" ? "text-error" : "text-inverse-primary"
          }`}
        />
        <Toast.Close aria-label="Dismiss" className="state-layer grid size-9 shrink-0 place-items-center rounded-full">
          <CloseIcon size={18} />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
