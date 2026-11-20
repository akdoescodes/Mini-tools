import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* ───────────────────────── Button ─────────────────────────
   M3 common buttons. Use `buttonVariants()` to style a <Link>. */

export const buttonVariants = cva(
  [
    "state-layer inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap select-none",
    "transition-[border-radius,background-color,box-shadow,color] duration-short4 ease-emphasized",
    "disabled:cursor-not-allowed disabled:opacity-(--md-sys-state-disabled-opacity)",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        filled: "bg-primary text-on-primary hover:not-disabled:shadow-elevation-1",
        accent: "bg-primary-container text-on-primary-container",
        tonal: "bg-secondary-container text-on-secondary-container",
        elevated: "bg-surface-container-low text-primary shadow-elevation-1 hover:not-disabled:shadow-elevation-2",
        outlined: "border border-outline text-on-surface",
        text: "text-primary",
        inverse: "bg-inverse-surface text-inverse-on-surface",
      },
      size: {
        sm: "h-9 rounded-[18px] px-4 type-label-lg active:not-disabled:rounded-md",
        md: "h-10 rounded-[20px] px-6 type-label-lg active:not-disabled:rounded-md",
        lg: "h-14 rounded-[28px] px-7 type-title-md active:not-disabled:rounded-lg",
      },
    },
    compoundVariants: [
      { variant: "text", size: "sm", className: "px-3" },
      { variant: "text", size: "md", className: "px-3.5" },
    ],
    defaultVariants: { variant: "filled", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/* ───────────────────────── IconButton ─────────────────────────
   `label` is required: it becomes the accessible name. Wrap in <Tooltip>
   to show it visually. */

export const iconButtonVariants = cva(
  [
    "state-layer inline-grid shrink-0 cursor-pointer place-items-center rounded-full",
    "transition-[border-radius,background-color,color,opacity] duration-short4 ease-emphasized",
    "active:not-disabled:rounded-md",
    "disabled:cursor-not-allowed disabled:opacity-(--md-sys-state-disabled-opacity)",
  ],
  {
    variants: {
      variant: {
        standard: "text-on-surface-variant",
        filled: "bg-primary text-on-primary",
        accent: "bg-primary-container text-on-primary-container",
        tonal: "bg-secondary-container text-on-secondary-container",
        outlined: "border border-outline-variant text-on-surface-variant",
        inverse: "bg-inverse-surface/85 text-inverse-on-surface",
        "on-inverse": "text-inverse-on-surface",
      },
      size: {
        sm: "size-8 [&_svg]:size-[18px]",
        md: "size-10 [&_svg]:size-6",
        lg: "size-12 [&_svg]:size-6",
        xl: "h-12 w-14 rounded-[16px] [&_svg]:size-[26px]",
      },
    },
    defaultVariants: { variant: "standard", size: "md" },
  },
);

export type IconButtonProps = Omit<ComponentProps<"button">, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & { label: string };

export function IconButton({ className, variant, size, label, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
