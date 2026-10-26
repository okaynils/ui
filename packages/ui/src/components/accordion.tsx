import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import type * as React from "react";
import { cn } from "../lib/cn";

/** The disclosure caret: points right when closed, turns 90° to point down when open. */
export function DisclosureCaret({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      className={cn("size-3 shrink-0 text-ink-3 transition-transform duration-150 ease-snap", className)}
    >
      <path d="M6 4.2v7.6c0 .4.5.7.8.4l4-3.8c.2-.2.2-.6 0-.8l-4-3.8c-.3-.3-.8 0-.8.4Z" />
    </svg>
  );
}

/**
 * Height + opacity for an opening panel. Base UI measures the content height
 * into a CSS variable; pair this with `h-(--accordion-panel-height)` or
 * `h-(--collapsible-panel-height)` written out literally (Tailwind can't see
 * class names built at runtime).
 */
export const panelMotion = [
  "overflow-hidden transition-[height,opacity] duration-180 ease-snap",
  "data-starting-style:h-0 data-starting-style:opacity-0",
  "data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:duration-120",
].join(" ");

export interface AccordionProps extends Omit<BaseAccordion.Root.Props, "className"> {
  /** Layout classes only. */
  className?: string;
}

/**
 * Stacked sections that open in place, separated by hairlines. One open at a
 * time by default; pass `multiple` to allow several. Fill with `AccordionItem`.
 */
export function Accordion({ className, ...props }: AccordionProps) {
  return <BaseAccordion.Root {...props} className={cn("flex w-full flex-col border-t border-line", className)} />;
}

export interface AccordionItemProps extends Omit<BaseAccordion.Item.Props, "className" | "title"> {
  /** The always-visible row. */
  title: React.ReactNode;
  /** Right-aligned detail in the row, e.g. a count or a `Badge`. */
  meta?: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

/** One section: a title row that toggles its content. */
export function AccordionItem({ title, meta, className, children, ...props }: AccordionItemProps) {
  return (
    <BaseAccordion.Item {...props} className={cn("border-b border-line", className)}>
      <BaseAccordion.Header className="m-0">
        <BaseAccordion.Trigger
          className={cn(
            "group flex min-h-10 w-full cursor-default items-center gap-2 rounded-[2px] py-2 text-left text-ui font-medium text-ink",
            "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
            "data-disabled:opacity-45",
          )}
        >
          <DisclosureCaret className="group-data-panel-open:rotate-90" />
          <span className="min-w-0 flex-1">{title}</span>
          {meta !== undefined ? <span className="shrink-0 font-normal text-ink-2">{meta}</span> : null}
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
      <BaseAccordion.Panel className={cn("h-(--accordion-panel-height)", panelMotion)}>
        <div className="pb-3 pl-5 text-sm text-ink-2">{children}</div>
      </BaseAccordion.Panel>
    </BaseAccordion.Item>
  );
}
