"use client";

import type { ReactNode } from "react";
import {
  AspectIcon,
  Card,
  ChoiceChips,
  LayersIcon,
  SegmentedButton,
  ShapedIcon,
  SliderField,
  Switch,
  TimerIcon,
} from "@/components/ui";
import { ASPECTS, LIMITS, TRANSITIONS, type AspectId, type FlashSettings } from "@/lib/flash/engine";
import { cn } from "@/lib/cn";

/** Preset video background colours (content, not theme: they end up in the exported video). */
const SWATCHES = [
  { hex: "#000000", name: "Black" },
  { hex: "#ffffff", name: "White" },
  { hex: "#2c2523", name: "Charcoal" },
  { hex: "#ffd9dc", name: "Blush" },
  { hex: "#ff9a5c", name: "Coral" },
  { hex: "#cfe5ff", name: "Sky" },
  { hex: "#d6f08a", name: "Lime" },
];
const isPreset = (c: string) => SWATCHES.some((w) => w.hex === c.toLowerCase());

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-outline-variant/70 pt-5 first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-2.5 type-title-md">
        <ShapedIcon tone="tertiary" size="sm">
          {icon}
        </ShapedIcon>
        {title}
      </h2>
      {children}
    </section>
  );
}

function AspectGlyph({ id }: { id: AspectId }) {
  const { width, height } = ASPECTS[id];
  const k = 14 / Math.max(width, height);
  return (
    <span
      aria-hidden="true"
      className="inline-block rounded-[3px] border-2 border-current"
      style={{ width: Math.round(width * k), height: Math.round(height * k) }}
    />
  );
}

export function SettingsPanel({
  settings: s,
  update,
}: {
  settings: FlashSettings;
  update: (patch: Partial<FlashSettings>) => void;
}) {
  const noTransition = s.transition === "none";

  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <Section icon={<TimerIcon />} title="Timing">
        <SegmentedButton
          label="How image time is set"
          value={s.durationMode}
          onValueChange={(v) => update({ durationMode: v })}
          options={[
            { value: "all", label: "Same for all" },
            { value: "each", label: "Per image" },
          ]}
        />
        <SliderField
          label={s.durationMode === "all" ? "Each image shows for" : "Default time per image"}
          hint={s.durationMode === "each" ? "Set a custom time on any image in the list." : undefined}
          value={s.duration}
          onValueChange={(v) => update({ duration: v })}
          {...LIMITS.duration}
        />
        <SliderField
          label="Gap between images"
          hint={
            s.gap > 0
              ? "A blank screen in the background colour, shown between images."
              : "No gap: images follow each other directly."
          }
          value={s.gap}
          onValueChange={(v) => update({ gap: v })}
          {...LIMITS.gap}
        />
      </Section>

      <Section icon={<LayersIcon />} title="Transition">
        <ChoiceChips
          label="Transition style"
          value={s.transition}
          onValueChange={(v) => update({ transition: v })}
          options={TRANSITIONS.map((t) => ({ value: t.id, label: t.label }))}
        />
        <SliderField
          label="Transition length"
          hint={noTransition ? "Pick a style above to enable." : "Plays at the start of each image or gap, within its time."}
          value={s.transitionDuration}
          onValueChange={(v) => update({ transitionDuration: v })}
          disabled={noTransition}
          {...LIMITS.transition}
        />
      </Section>

      <Section icon={<AspectIcon />} title="Output">
        <ChoiceChips
          label="Video size"
          value={s.aspect}
          onValueChange={(v) => update({ aspect: v })}
          options={(Object.keys(ASPECTS) as AspectId[]).map((id) => ({
            value: id,
            icon: <AspectGlyph id={id} />,
            label: (
              <span>
                {id} <span className="opacity-70">{ASPECTS[id].label}</span>
              </span>
            ),
          }))}
        />
        <SegmentedButton
          label="Image fit"
          value={s.fit}
          onValueChange={(v) => update({ fit: v })}
          options={[
            { value: "cover", label: "Fill (crop)" },
            { value: "contain", label: "Fit (bars)" },
          ]}
        />

        <div>
          <p className="mb-2 type-title-sm">Background &amp; gap colour</p>
          <ChoiceChips
            label="Background colour"
            value={isPreset(s.background) ? s.background.toLowerCase() : "custom"}
            onValueChange={(v) => v !== "custom" && update({ background: v })}
            className="items-center"
            options={[
              ...SWATCHES.map((w) => ({
                value: w.hex,
                label: (
                  <>
                    <span
                      aria-hidden="true"
                      className="block size-5 rounded-full border border-outline-variant"
                      style={{ background: w.hex }}
                    />
                    <span className="sr-only">{w.name}</span>
                  </>
                ),
              })),
            ]}
          />
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 type-label-lg text-on-surface-variant">
            <span
              className={cn(
                "relative size-8 overflow-hidden rounded-full border border-outline-variant",
                !isPreset(s.background) && "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low",
              )}
              style={{ background: s.background }}
            >
              <input
                type="color"
                value={s.background}
                onChange={(e) => update({ background: e.target.value })}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
            </span>
            Custom colour
          </label>
        </div>

        <div>
          <p className="mb-2 type-title-sm">Frame rate</p>
          <SegmentedButton
            label="Frame rate"
            value={String(s.fps) as "24" | "30" | "60"}
            onValueChange={(v) => update({ fps: Number(v) as FlashSettings["fps"] })}
            options={[
              { value: "24", label: "24 fps" },
              { value: "30", label: "30 fps" },
              { value: "60", label: "60 fps" },
            ]}
          />
        </div>

        <Switch label="Loop preview" checked={s.loop} onCheckedChange={(v) => update({ loop: v })} />
      </Section>
    </Card>
  );
}
