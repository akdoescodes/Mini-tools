import { cva, type VariantProps } from "class-variance-authority";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SHAPE_PATHS, clipShape, type ShapeName } from "@/lib/shapes";

/** Mount once (root layout). Exposes `url(#shape-<name>)` clip paths. */
export function ShapeDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {(Object.keys(SHAPE_PATHS) as ShapeName[]).map((name) => (
          <clipPath key={name} id={`shape-${name}`} clipPathUnits="objectBoundingBox">
            <path d={SHAPE_PATHS[name]} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}

/** A filled decorative M3 shape (inherits `color`). */
export function Shape({ name, className, style }: { name: ShapeName; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 1 1" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={SHAPE_PATHS[name]} fill="currentColor" />
    </svg>
  );
}

/* ───────── ShapedIcon: an icon sitting inside an expressive shape ───────── */

const shapedIconVariants = cva("grid flex-none place-items-center", {
  variants: {
    tone: {
      primary: "bg-primary-container text-on-primary-container",
      secondary: "bg-secondary-container text-on-secondary-container",
      tertiary: "bg-tertiary-container text-on-tertiary-container",
      info: "bg-info-container text-on-info-container",
    },
    size: {
      sm: "size-9 [&_svg]:size-[18px]",
      md: "size-10 [&_svg]:size-5",
      lg: "size-16 [&_svg]:size-7",
      xl: "size-20 [&_svg]:size-[34px]",
    },
  },
  defaultVariants: { tone: "primary", size: "md" },
});

export function ShapedIcon({
  shape = "cookie9",
  tone,
  size,
  className,
  children,
}: VariantProps<typeof shapedIconVariants> & { shape?: ShapeName; className?: string; children: ReactNode }) {
  return (
    <span className={cn(shapedIconVariants({ tone, size }), className)} style={{ clipPath: clipShape(shape) }}>
      {children}
    </span>
  );
}

/** Brand mark: sunny shape in the brand gradient with a pixel spark. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative grid flex-none place-items-center", className)}
      style={{ width: size, height: size, clipPath: clipShape("sunny8"), background: "var(--app-brand-gradient)" }}
    >
      <svg viewBox="0 0 1 1" width={size} height={size} className="text-on-primary-container">
        <g fill="currentColor">
          <rect x="0.44" y="0.24" width="0.12" height="0.52" />
          <rect x="0.24" y="0.44" width="0.52" height="0.12" />
        </g>
      </svg>
    </span>
  );
}
