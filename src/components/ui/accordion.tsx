"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AddIcon } from "./icons";

/**
 * Expandable list (FAQs, details). Closed panels stay in the HTML
 * (hidden="until-found"), so search engines and Ctrl+F still find them.
 *
 *   <Accordion items={[{ id: "a", title: "Question?", content: "Answer." }]} />
 */
export function Accordion({
  items,
  headingLevel = 3,
  className,
}: {
  items: { id: string; title: ReactNode; content: ReactNode }[];
  headingLevel?: 2 | 3 | 4;
  className?: string;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <BaseAccordion.Root hiddenUntilFound className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <BaseAccordion.Item key={item.id} value={item.id} className="overflow-hidden rounded-xl bg-surface-container-low">
          <BaseAccordion.Header render={<Heading />} className="m-0">
            <BaseAccordion.Trigger className="group state-layer flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left type-title-sm">
              {item.title}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary-container text-on-secondary-container transition-transform duration-medium2 ease-emphasized group-data-panel-open:rotate-45">
                <AddIcon size={18} />
              </span>
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-medium2 ease-emphasized data-ending-style:h-0 data-starting-style:h-0">
            <div className="px-5 pb-5 type-body-md text-on-surface-variant">{item.content}</div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}
