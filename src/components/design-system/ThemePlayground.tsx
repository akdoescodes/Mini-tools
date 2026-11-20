"use client";

import { useState } from "react";
import { Button, Card, ChoiceChips, CopyIcon, ReplayIcon, Slider, toast } from "@/components/ui";

type SeedKey = "primary" | "secondary" | "tertiary" | "info" | "neutral";

const PRESETS = {
  coral: { primary: "#ff8a4c", secondary: "#e8798a", tertiary: "#a6d63a", info: "#5b9df0", neutral: "#ff8a4c" },
  ocean: { primary: "#2f86e8", secondary: "#4fb0c6", tertiary: "#f2b23a", info: "#7c6cf0", neutral: "#6a8cad" },
  grape: { primary: "#9a5cf0", secondary: "#e070c8", tertiary: "#3ccfa6", info: "#4f94ef", neutral: "#8a72b8" },
  forest: { primary: "#3f9a55", secondary: "#b7a24a", tertiary: "#f08a5c", info: "#4f94ef", neutral: "#6f8f6f" },
} as const satisfies Record<string, Record<SeedKey, string>>;
type PresetName = keyof typeof PRESETS;

const SEED_LABELS: Record<SeedKey, string> = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
  info: "Info",
  neutral: "Neutral",
};

/**
 * Live theme editor. Writes seed tokens onto <html>, so the entire site
 * re-themes instantly. Copy the snippet into src/theme/theme.css to keep it.
 */
export function ThemePlayground() {
  const [preset, setPreset] = useState<PresetName | "custom">("coral");
  const [seeds, setSeeds] = useState<Record<SeedKey, string>>({ ...PRESETS.coral });
  const [roundness, setRoundness] = useState(1);

  const root = () => document.documentElement;

  const applyPreset = (name: PresetName) => {
    const el = root();
    (Object.keys(SEED_LABELS) as SeedKey[]).forEach((k) => el.style.removeProperty(`--seed-${k}`));
    if (name === "coral") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", name);
    setPreset(name);
    setSeeds({ ...PRESETS[name] });
  };

  const setSeed = (key: SeedKey, hex: string) => {
    root().style.setProperty(`--seed-${key}`, hex);
    setPreset("custom");
    setSeeds((s) => ({ ...s, [key]: hex }));
  };

  const setRound = (v: number) => {
    root().style.setProperty("--app-roundness", String(v));
    setRoundness(v);
  };

  const reset = () => {
    applyPreset("coral");
    root().style.removeProperty("--app-roundness");
    setRoundness(1);
  };

  const snippet = [
    ":root {",
    ...(Object.keys(SEED_LABELS) as SeedKey[]).map((k) => `  --seed-${k}: ${seeds[k]};`),
    "}",
    ...(roundness !== 1 ? ["", ":root, [data-theme] {", `  --app-roundness: ${roundness};`, "}"] : []),
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast("Copied. Paste it into src/theme/theme.css");
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 type-title-sm">Preset</p>
          <ChoiceChips
            label="Theme preset"
            value={preset}
            onValueChange={(v) => v !== "custom" && applyPreset(v)}
            options={[
              ...(Object.keys(PRESETS) as PresetName[]).map((p) => ({
                value: p,
                label: p[0].toUpperCase() + p.slice(1),
                icon: (
                  <span
                    aria-hidden="true"
                    className="size-3.5 rounded-full"
                    style={{ background: PRESETS[p].primary }}
                  />
                ),
              })),
              ...(preset === "custom" ? [{ value: "custom" as const, label: "Custom" }] : []),
            ]}
          />
        </div>

        <div>
          <p className="mb-2 type-title-sm">Seed colours</p>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(SEED_LABELS) as SeedKey[]).map((k) => (
              <label
                key={k}
                className="state-layer flex cursor-pointer items-center gap-2 rounded-full border border-outline-variant py-1 pr-3 pl-1 type-label-lg"
              >
                <span
                  className="relative size-7 overflow-hidden rounded-full border border-outline-variant"
                  style={{ background: seeds[k] }}
                >
                  <input
                    type="color"
                    value={seeds[k]}
                    onChange={(e) => setSeed(k, e.target.value)}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                    aria-label={`${SEED_LABELS[k]} seed colour`}
                  />
                </span>
                {SEED_LABELS[k]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="type-title-sm">Roundness</p>
            <span className="type-label-lg text-primary tabular-nums">{roundness.toFixed(2)}×</span>
          </div>
          <Slider label="Roundness" value={roundness} onValueChange={setRound} min={0} max={1.5} step={0.05} />
        </div>
        <p className="type-body-sm text-on-surface-variant">
          Changes apply to the whole site until you reload. To keep them, copy the snippet into{" "}
          <code className="rounded-xs bg-surface-container-high px-1">src/theme/theme.css</code>.
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <pre className="overflow-x-auto rounded-lg bg-inverse-surface p-4 font-mono text-[12px] leading-5 text-inverse-on-surface">
          {snippet}
        </pre>
        <div className="flex gap-2">
          <Button variant="tonal" onClick={copy}>
            <CopyIcon size={18} /> Copy snippet
          </Button>
          <Button variant="text" onClick={reset}>
            <ReplayIcon size={18} /> Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
