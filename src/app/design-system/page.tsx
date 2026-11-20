import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ComponentGallery } from "@/components/design-system/ComponentGallery";
import { ThemePlayground } from "@/components/design-system/ThemePlayground";
import { Badge, Card, PaletteIcon, Shape } from "@/components/ui";
import type { ShapeName } from "@/lib/shapes";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens and components used to build every tool on the site.",
};

/* Each entry: [container class, on-colour class, label] — kept as literal strings so Tailwind sees them */
const COLOR_PAIRS: [string, string][] = [
  ["bg-primary text-on-primary", "primary"],
  ["bg-primary-container text-on-primary-container", "primary-container"],
  ["bg-secondary text-on-secondary", "secondary"],
  ["bg-secondary-container text-on-secondary-container", "secondary-container"],
  ["bg-tertiary text-on-tertiary", "tertiary"],
  ["bg-tertiary-container text-on-tertiary-container", "tertiary-container"],
  ["bg-info text-white", "info"],
  ["bg-info-container text-on-info-container", "info-container"],
  ["bg-error text-on-error", "error"],
  ["bg-error-container text-on-error-container", "error-container"],
  ["bg-inverse-surface text-inverse-on-surface", "inverse-surface"],
  ["bg-inverse-primary text-on-primary-container", "inverse-primary"],
];

const SURFACES: [string, string][] = [
  ["bg-surface-container-lowest", "lowest"],
  ["bg-surface-container-low", "low"],
  ["bg-surface-container", "container"],
  ["bg-surface-container-high", "high"],
  ["bg-surface-container-highest", "highest"],
  ["bg-surface-dim", "dim"],
];

const TEXT_ROLES: [string, string][] = [
  ["bg-on-surface", "on-surface"],
  ["bg-on-surface-variant", "on-surface-variant"],
  ["bg-outline", "outline"],
  ["bg-outline-variant", "outline-variant"],
];

const TYPE_SCALE: [string, string][] = [
  ["type-display-lg", "Display large"],
  ["type-display-md", "Display medium"],
  ["type-display-sm", "Display small"],
  ["type-headline-lg", "Headline large"],
  ["type-headline-md", "Headline medium"],
  ["type-headline-sm", "Headline small"],
  ["type-title-lg", "Title large"],
  ["type-title-md", "Title medium"],
  ["type-title-sm", "Title small"],
  ["type-body-lg", "Body large: the quick brown fox jumps over the lazy dog"],
  ["type-body-md", "Body medium: the quick brown fox jumps over the lazy dog"],
  ["type-body-sm", "Body small: the quick brown fox jumps over the lazy dog"],
  ["type-label-lg", "Label large"],
  ["type-label-md", "Label medium"],
  ["type-label-sm", "Label small"],
];

const RADII: [string, string][] = [
  ["rounded-xs", "xs · 4"],
  ["rounded-sm", "sm · 8"],
  ["rounded-md", "md · 12"],
  ["rounded-lg", "lg · 16"],
  ["rounded-xl", "xl · 20"],
  ["rounded-2xl", "2xl · 28"],
  ["rounded-3xl", "3xl · 32"],
  ["rounded-4xl", "4xl · 48"],
];

const SHAPES: ShapeName[] = ["cookie12", "cookie9", "sunny8", "clover4"];

const ELEVATION = ["shadow-elevation-1", "shadow-elevation-2", "shadow-elevation-3", "shadow-elevation-4", "shadow-elevation-5"];

function Section({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12 first:mt-0">
      <h2 id={id} className="type-headline-sm">
        {title}
      </h2>
      {lead && <p className="mt-1 mb-4 max-w-2xl type-body-md text-on-surface-variant">{lead}</p>}
      {!lead && <div className="mb-4" />}
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto w-full max-w-page px-2 pb-10 sm:px-4">
      <header className="mt-5 mb-8 px-2 sm:mt-8">
        <Badge tone="info" size="md">
          <PaletteIcon /> Reference
        </Badge>
        <h1 className="mt-3 type-display-lg">DESIGN SYSTEM</h1>
        <p className="mt-2 max-w-2xl type-body-lg text-on-surface-variant">
          Every screen is built from these tokens and components. Colours, type, corners, shadows and motion all come
          from one file, <code className="rounded-xs bg-surface-container-high px-1.5">src/theme/theme.css</code>;
          components live in{" "}
          <code className="rounded-xs bg-surface-container-high px-1.5">src/components/ui</code>.
        </p>
      </header>

      <Section
        id="theme"
        title="Theme playground"
        lead="Pick a preset or change the seed colours: every role below re-derives from them live."
      >
        <ThemePlayground />
      </Section>

      <Section id="colour" title="Colour roles" lead="Use roles, never raw colours: bg-primary + text-on-primary, etc.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {COLOR_PAIRS.map(([cls, label]) => (
            <div key={label} className={`flex h-20 flex-col justify-end rounded-lg p-3 ${cls}`}>
              <span className="type-label-md">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SURFACES.map(([cls, label]) => (
            <div
              key={label}
              className={`flex h-16 flex-col justify-end rounded-lg border border-outline-variant/60 p-3 text-on-surface ${cls}`}
            >
              <span className="type-label-sm">surface-{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TEXT_ROLES.map(([cls, label]) => (
            <div key={label} className="flex items-center gap-2 rounded-lg bg-surface-container-low p-2 pr-3">
              <span className={`size-8 rounded-sm ${cls}`} />
              <span className="type-label-md">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="Typography" lead="Each type-* utility sets family, size, line height, weight and tracking.">
        <Card padding="lg" className="flex flex-col divide-y divide-outline-variant/60">
          {TYPE_SCALE.map(([cls, label]) => (
            <div key={cls} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5">
              <span className={`${cls} min-w-0`}>{label}</span>
              <code className="font-mono text-[11px] text-on-surface-variant">{cls}</code>
            </div>
          ))}
        </Card>
      </Section>

      <Section
        id="shape"
        title="Shape"
        lead="Corner scale (all multiplied by --app-roundness) plus expressive M3 shapes for icons and media."
      >
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {RADII.map(([cls, label]) => (
            <div key={cls} className="flex flex-col items-center gap-2">
              <div className={`aspect-square w-full bg-primary-container ${cls}`} />
              <span className="type-label-sm text-on-surface-variant">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          {SHAPES.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Shape
                name={s}
                className={
                  ["size-20 text-secondary-container", "size-20 text-tertiary-container", "size-20 text-info-container", "size-20 text-primary-container"][i]
                }
              />
              <code className="font-mono text-[11px] text-on-surface-variant">{s}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section id="elevation" title="Elevation">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {ELEVATION.map((cls, i) => (
            <div
              key={cls}
              className={`grid h-24 place-items-center rounded-lg bg-surface-container-low type-label-lg ${cls}`}
            >
              Level {i + 1}
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="components"
        title="Components"
        lead={
          <>
            Import from <code className="rounded-xs bg-surface-container-high px-1.5">@/components/ui</code>. Overlays
            (Dialog, Sheet, Tooltip, Toast) and inputs are built on Base UI, so focus, keyboard and screen-reader
            behaviour come for free.
          </>
        }
      >
        <ComponentGallery />
      </Section>
    </div>
  );
}
