import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* ───────────────────────── Card ─────────────────────────
   Surface container. `variant` = how it sits on the page,
   `tone` = colour family for filled tonal cards. */

export const cardVariants = cva("relative", {
  variants: {
    variant: {
      filled: "bg-surface-container-low",
      elevated: "bg-surface-container-low shadow-elevation-1",
      outlined: "border border-outline-variant bg-surface",
      inverse: "bg-inverse-surface text-inverse-on-surface",
      glass: "glass",
      "glass-inverse": "glass-inverse",
      primary: "bg-primary-container text-on-primary-container",
      secondary: "bg-secondary-container text-on-secondary-container",
      tertiary: "bg-tertiary-container text-on-tertiary-container",
      info: "bg-info-container text-on-info-container",
    },
    radius: {
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "4xl": "rounded-4xl",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-6",
    },
  },
  defaultVariants: { variant: "filled", radius: "2xl", padding: "md" },
});

export type CardProps = ComponentProps<"div"> & VariantProps<typeof cardVariants>;

export function Card({ className, variant, radius, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, radius, padding }), className)} {...props} />;
}

/* ───────────────────────── Badge ───────────────────────── */

export const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full whitespace-nowrap tabular-nums [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        primary: "bg-primary-container text-on-primary-container",
        secondary: "bg-secondary-container text-on-secondary-container",
        tertiary: "bg-tertiary-container text-on-tertiary-container",
        info: "bg-info-container text-on-info-container",
        error: "bg-error text-on-error",
        inverse: "bg-inverse-surface/85 text-inverse-on-surface",
        surface: "bg-surface-container-lowest/80 text-on-surface-variant",
      },
      size: {
        sm: "px-2 py-0.5 type-label-sm",
        md: "px-3 py-1 type-label-md",
      },
    },
    defaultVariants: { tone: "secondary", size: "sm" },
  },
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}

/* ───────────────────────── Divider ───────────────────────── */

export function Divider({ className, ...props }: ComponentProps<"hr">) {
  return <hr className={cn("border-0 border-t border-outline-variant", className)} {...props} />;
}
