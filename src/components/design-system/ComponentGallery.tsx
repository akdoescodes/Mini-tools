"use client";

import { useState, type ReactNode } from "react";
import {
  Accordion,
  AddIcon,
  Badge,
  BoltIcon,
  Button,
  Card,
  ChoiceChips,
  CloseIcon,
  ConfirmDialog,
  DeleteIcon,
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DownloadIcon,
  HomeIcon,
  IconButton,
  InfoIcon,
  LinearProgress,
  NumberField,
  PlayIcon,
  SegmentedButton,
  ShapedIcon,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Slider,
  SliderField,
  Switch,
  toast,
  Tooltip,
  WarningIcon,
} from "@/components/ui";

function Demo({ title, code, children }: { title: string; code: string; children: ReactNode }) {
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      <div className="flex flex-1 flex-wrap items-center gap-3 p-5">{children}</div>
      <div className="flex items-center justify-between gap-3 border-t border-outline-variant/70 bg-surface-container px-5 py-2.5">
        <span className="type-title-sm">{title}</span>
        <code className="truncate font-mono text-[11px] text-on-surface-variant">{code}</code>
      </div>
    </Card>
  );
}

export function ComponentGallery() {
  const [segment, setSegment] = useState<"day" | "week" | "month">("week");
  const [chip, setChip] = useState<"fade" | "slide" | "zoom">("fade");
  const [on, setOn] = useState(true);
  const [level, setLevel] = useState(40);
  const [seconds, setSeconds] = useState(1.5);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Demo title="Button" code={`<Button variant="filled|accent|tonal|elevated|outlined|text">`}>
        <Button>Filled</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button disabled>Disabled</Button>
      </Demo>

      <Demo title="Button sizes" code={`<Button size="sm|md|lg">`}>
        <Button size="sm">
          <AddIcon size={18} /> Small
        </Button>
        <Button size="md">
          <DownloadIcon size={18} /> Medium
        </Button>
        <Button size="lg" variant="accent">
          <BoltIcon size={20} /> Large
        </Button>
      </Demo>

      <Demo title="IconButton + Tooltip" code={`<Tooltip content="…"><IconButton label="…">`}>
        {(["standard", "filled", "accent", "tonal", "outlined"] as const).map((v) => (
          <Tooltip key={v} content={v}>
            <IconButton label={v} variant={v}>
              <PlayIcon />
            </IconButton>
          </Tooltip>
        ))}
        <Tooltip content="Large">
          <IconButton label="Large play" variant="accent" size="xl">
            <PlayIcon />
          </IconButton>
        </Tooltip>
      </Demo>

      <Demo title="Badge & ShapedIcon" code={`<Badge tone="…">  <ShapedIcon shape="cookie9">`}>
        <Badge tone="primary">Primary</Badge>
        <Badge tone="secondary">12</Badge>
        <Badge tone="tertiary">New</Badge>
        <Badge tone="info">Info</Badge>
        <Badge tone="error">Error</Badge>
        <ShapedIcon tone="primary" shape="cookie9">
          <BoltIcon />
        </ShapedIcon>
        <ShapedIcon tone="tertiary" shape="clover4">
          <HomeIcon />
        </ShapedIcon>
        <ShapedIcon tone="info" shape="sunny8">
          <InfoIcon />
        </ShapedIcon>
      </Demo>

      <Demo title="SegmentedButton" code={`<SegmentedButton value onValueChange options>`}>
        <SegmentedButton
          label="Range"
          value={segment}
          onValueChange={setSegment}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      </Demo>

      <Demo title="ChoiceChips + Switch" code={`<ChoiceChips …/>  <Switch …/>`}>
        <ChoiceChips
          label="Transition"
          value={chip}
          onValueChange={setChip}
          options={[
            { value: "fade", label: "Fade" },
            { value: "slide", label: "Slide" },
            { value: "zoom", label: "Zoom" },
          ]}
        />
        <div className="w-full">
          <Switch label="Loop playback" checked={on} onCheckedChange={setOn} />
        </div>
      </Demo>

      <Demo title="Slider, NumberField, Progress" code={`<SliderField/> <NumberField/> <LinearProgress/>`}>
        <div className="flex w-full flex-col gap-3">
          <SliderField label="Seconds per image" value={seconds} onValueChange={setSeconds} min={0.1} max={10} step={0.1} />
          <div className="flex items-center gap-3">
            <Slider label="Level" value={level} onValueChange={setLevel} className="flex-1" />
            <NumberField label="Level" value={level} onValueChange={setLevel} min={0} max={100} unit="%" />
          </div>
          <LinearProgress value={level} label="Progress" />
        </div>
      </Demo>

      <Demo title="Toast" code={`toast("…")  toast.error("…")`}>
        <Button variant="tonal" onClick={() => toast("Saved your changes")}>
          Show toast
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            toast("Image removed", { action: { label: "Undo", onClick: () => toast("Restored") } })
          }
        >
          With action
        </Button>
        <Button variant="text" onClick={() => toast.error("Couldn't read file", { description: "photo.heic" })}>
          Error
        </Button>
      </Demo>

      <Demo title="Dialog" code={`<Dialog><DialogTrigger/><DialogContent>…`}>
        <Dialog>
          <DialogTrigger render={<Button>Open dialog</Button>} />
          <DialogContent>
            <DialogHeader
              title="Rename project"
              description="Give this flash video a name so you can find it later."
            />
            <label className="flex flex-col gap-1 type-label-lg">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Summer trip"
                className="h-12 rounded-sm border border-outline bg-surface-container-lowest px-3 type-body-lg outline-none focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)]"
              />
            </label>
            <DialogActions>
              <DialogClose render={<Button variant="text">Cancel</Button>} />
              <DialogClose
                render={
                  <Button onClick={() => toast(name ? `Renamed to “${name}”` : "Nothing to rename")}>Save</Button>
                }
              />
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger render={<Button variant="tonal">With icon</Button>} />
          <DialogContent size="sm">
            <DialogHeader
              icon={<WarningIcon />}
              title="Large export"
              description="This video is over 2 minutes. Exporting takes as long as the video plays."
            />
            <DialogActions>
              <DialogClose render={<Button variant="text">Got it</Button>} />
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Demo>

      <Demo title="ConfirmDialog" code={`<ConfirmDialog destructive onConfirm>`}>
        <Button variant="outlined" onClick={() => setConfirmOpen(true)}>
          <DeleteIcon size={18} /> Delete all
        </Button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          icon={<DeleteIcon />}
          title="Delete all images?"
          description="This can't be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={() => toast("Deleted")}
        />
      </Demo>

      <Demo title="Accordion" code={`<Accordion items={[{ id, title, content }]} />`}>
        <Accordion
          className="w-full"
          items={[
            { id: "a", title: "Are closed answers indexable?", content: "Yes. Panels use hidden=\"until-found\", so search engines and Ctrl+F still see them." },
            { id: "b", title: "Can I nest rich content?", content: "Any React node works as content." },
          ]}
        />
      </Demo>

      <Demo title="Sheet" code={`<Sheet><SheetContent side="left|right|bottom">`}>
        {(["left", "right", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger render={<Button variant="outlined">{side}</Button>} />
            <SheetContent side={side} aria-labelledby={`sheet-${side}`}>
              <div className="flex items-center justify-between gap-2">
                <SheetTitle id={`sheet-${side}`} className="type-title-lg">
                  {side[0].toUpperCase() + side.slice(1)} sheet
                </SheetTitle>
                <SheetClose
                  render={
                    <IconButton label="Close">
                      <CloseIcon />
                    </IconButton>
                  }
                />
              </div>
              <p className="mt-2 type-body-md text-on-surface-variant">
                Same behaviour as a dialog (focus trap, Esc, scrim) but anchored to an edge. The site&apos;s tools
                menu is a left sheet.
              </p>
            </SheetContent>
          </Sheet>
        ))}
      </Demo>
    </div>
  );
}
