import type * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./popover";
import { StatusDot } from "./status";

export type AvailabilityState = "open" | "busy" | "away";

const STATES = {
  open: { label: "Available", tone: "ok" },
  busy: { label: "Busy", tone: "warn" },
  away: { label: "Away", tone: "neutral" },
} as const;

export interface AvailabilityProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** The state is supplied by the app; this component does not infer a schedule. */
  state: AvailabilityState;
  /** A short sentence such as "Open for small projects" or "Back in November". */
  label?: string;
  /** Extra context, available on hover or through a keyboard/touch-accessible button. */
  detail?: React.ReactNode;
  /** Optional destination for the label, such as a contact page. */
  href?: string;
}

/** A personal availability notice: a quiet word, with colour confined to its status dot. */
export function Availability({ state, label = STATES[state].label, detail, href, className, ...props }: AvailabilityProps) {
  const content = <><StatusDot tone={STATES[state].tone} /><span className="min-w-0 break-words">{label}</span></>;
  const hasDetail = detail !== undefined && detail !== null && detail !== false && detail !== "";
  const text = href ? (
    <a
      href={href}
      className="inline-flex min-w-0 items-center gap-2 rounded-ui text-ui text-ink underline decoration-line-strong underline-offset-[3px] outline-none transition-colors hover:decoration-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {content}
    </a>
  ) : <span className="inline-flex min-w-0 items-center gap-2 text-ui text-ink">{content}</span>;

  return (
    <span {...props} data-state={state} className={cn("inline-flex max-w-full items-center gap-1", className)}>
      {hasDetail ? (
        <Popover>
          {href ? text : null}
          <PopoverTrigger
            openOnHover
            delay={300}
            closeDelay={150}
            render={<Button variant="ghost" size="sm" icon={Boolean(href)} />}
            aria-label={href ? "Availability details" : `${label}. Show availability details`}
            className={href ? undefined : "min-w-0 justify-start whitespace-normal text-left text-ink"}
          >
            {href ? <InfoIcon /> : <>{content}<InfoIcon /></>}
          </PopoverTrigger>
          <PopoverContent align="start" className="p-3">
            <PopoverTitle className="text-ui font-medium">{label}</PopoverTitle>
            <PopoverDescription render={<div />} className="mt-1 text-ui text-ink-2">{detail}</PopoverDescription>
          </PopoverContent>
        </Popover>
      ) : text}
    </span>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-3.5 shrink-0 text-ink-3" aria-hidden="true">
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 7v4" strokeLinecap="round" />
      <circle cx="8" cy="4.75" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}
