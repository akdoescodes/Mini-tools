"use client";

import { useState } from "react";
import {
  Button,
  buttonVariants,
  CodeIcon,
  CopyIcon,
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogHeader,
  DownloadIcon,
  SegmentedButton,
  toast,
} from "@/components/ui";
import type { CodeExport } from "@/lib/flash/codegen";
import { formatBytes } from "@/lib/flash/media";

export type CodeResult = CodeExport & { url: string; label: string };

type Tab = "css" | "html" | "json";

export function CodeExportDialog({
  result,
  open,
  onOpenChange,
}: {
  result: CodeResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<Tab>("css");
  const code = result ? result.files[tab] : "";

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${what} copied`);
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" showClose>
        {result && (
          <>
            <DialogHeader
              icon={<CodeIcon />}
              title="Your HTML + CSS is ready"
              description={`${result.filename} · ${formatBytes(result.blob.size)} · pure CSS animation, no JavaScript`}
            />

            <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <iframe
                title="Live preview of the exported HTML"
                srcDoc={result.previewHtml}
                sandbox="allow-same-origin"
                className="h-[42dvh] min-h-60 w-full rounded-lg border-0 bg-black"
              />

              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <SegmentedButton
                    label="Show file"
                    value={tab}
                    onValueChange={setTab}
                    options={[
                      { value: "css", label: "flash.css" },
                      { value: "html", label: "index.html" },
                      { value: "json", label: "flash.json" },
                    ]}
                  />
                </div>
                <pre className="h-[calc(42dvh-3rem)] min-h-48 overflow-auto rounded-lg bg-inverse-surface p-3 font-mono text-[11.5px] leading-[1.55] text-inverse-on-surface">
                  {code}
                </pre>
                <div className="flex flex-wrap gap-2">
                  <Button variant="tonal" size="sm" onClick={() => copy(code, tab.toUpperCase())}>
                    <CopyIcon size={16} /> Copy {tab.toUpperCase()}
                  </Button>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() =>
                      copy(
                        `${result.files.readme}\n\n## flash.json\n\`\`\`json\n${result.files.json}\n\`\`\`\n\n## flash.css\n\`\`\`css\n${result.files.css}\n\`\`\`\n`,
                        "Agent brief",
                      )
                    }
                  >
                    Copy brief for AI agent
                  </Button>
                </div>
              </div>
            </div>

            <DialogActions>
              <DialogClose render={<Button variant="text">Close</Button>} />
              <a href={result.url} download={result.filename} className={buttonVariants({ variant: "filled" })}>
                <DownloadIcon size={18} />
                Download {result.label}
              </a>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
