import * as React from "react";
import { cn } from "../lib/cn";
import { Badge } from "./badge";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./popover";

export interface ReleaseBadgeProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** Displayed as supplied, including any desired "v" prefix. Null or blank means unavailable. */
  version: string | null;
  /** ISO date, an ISO instant with an offset, Date, or Unix milliseconds. Displayed in UTC. */
  releasedAt?: Date | string | number;
  /** Short supplied release notes. Opens from a separate keyboard/touch-accessible button. */
  notes?: React.ReactNode;
  /** Optional release page. Remains a separate native link from the notes trigger. */
  href?: string;
  /** Date formatting locale; explicit and stable across server and browser. */
  locale?: string;
}

function releaseDate(value: Date | string | number | undefined, locale: string) {
  if (value === undefined) return null;
  const date = new Date(value instanceof Date ? value.getTime() : value);
  if (!Number.isFinite(date.getTime())) return { text: "Date unavailable" };
  const iso = date.toISOString();
  // Date-only strings are calendar dates; reject rollover such as February 30.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && iso.slice(0, 10) !== value) return { text: "Date unavailable" };
  let formatter: Intl.DateTimeFormat;
  const options = { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" } as const;
  try { formatter = new Intl.DateTimeFormat(locale, options); }
  catch { formatter = new Intl.DateTimeFormat("en-GB", options); }
  return { text: formatter.format(date), iso };
}

/** A version, its release date, and optional notes without combining navigation and disclosure. */
export function ReleaseBadge({ version, releasedAt, notes, href, locale = "en-GB", className, ...props }: ReleaseBadgeProps) {
  const release = version?.trim();
  const date = releaseDate(releasedAt, locale);
  const hasNotes = React.Children.toArray(notes).some((child) => child !== "");

  return (
    <span {...props} data-state={release ? "available" : "unavailable"} className={cn("inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-2", className)}>
      {release ? (
        <>
          <Badge mono className="min-w-0 max-w-full"><span className="truncate">{release}</span></Badge>
          {date ? date.iso ? <time dateTime={date.iso} aria-label={`Released ${date.text}`} className="font-mono text-[11px] tabular-nums">{date.text}</time> : <span className="text-ink-3">{date.text}</span> : null}
          {href ? <a href={href} className="rounded-ui text-accent underline decoration-accent/30 underline-offset-[3px] outline-none hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" aria-label={`View release ${release}`}>View release</a> : null}
          {hasNotes ? (
            <Popover>
              <PopoverTrigger render={<Button variant="ghost" size="sm" />} aria-label={`Release notes for ${release}`}>
                What's new
              </PopoverTrigger>
              <PopoverContent align="start">
                <PopoverTitle>Release {release}</PopoverTitle>
                {date?.iso ? <time dateTime={date.iso} className="mt-1 block font-mono text-[11px] text-ink-3 tabular-nums">{date.text}</time> : null}
                <PopoverDescription render={<div />} className="mt-3 text-ui text-ink-2">{notes}</PopoverDescription>
              </PopoverContent>
            </Popover>
          ) : null}
        </>
      ) : <span className="text-ink-3">Release unavailable</span>}
    </span>
  );
}
