import * as React from "react";
import { cn } from "../lib/cn";
import type { StatusTone } from "./status";

export interface TimelineEntry {
  /** Stable id. New ids that appear after the first render get the change flash. */
  id: string;
  /** When it happened: a `Date`, an ISO string with an offset, or Unix milliseconds. */
  time: Date | string | number;
  /** What happened, in words. With an `actor`, phrase it as the rest of the sentence: "deployed api-gateway". */
  title: React.ReactNode;
  /** Who did it, shown before the title. */
  actor?: React.ReactNode;
  /** Extra detail under the title: a commit message, an error, a short diff. */
  detail?: React.ReactNode;
  /** Colours the entry's dot on the spine. The title must still say what happened. */
  tone?: StatusTone;
}

export type TimelineTimeFormat = "time" | "datetime" | "relative";

export interface TimelineProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Entries in display order. Newest-first and oldest-first both work; the timeline doesn't sort. */
  entries: readonly TimelineEntry[];
  /** Insert a day header whenever the date changes between entries. */
  groupByDay?: boolean;
  /**
   * `time` shows "14:02", `datetime` "26 Oct 14:02", `relative` "3m ago".
   * Defaults to `time` when grouped by day, `datetime` otherwise.
   */
  timeFormat?: TimelineTimeFormat;
  /** IANA zone for times and day boundaries. Defaults to UTC so server and browser agree. */
  timeZone?: string;
  locale?: string;
  /** Flash entries that appear after the first render. Defaults to true. */
  flash?: boolean;
  /** Shown instead of the list when there are no entries. */
  empty?: React.ReactNode;
}

const DOT: Record<StatusTone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  err: "bg-err",
  accent: "bg-accent",
  neutral: "bg-ink-3",
};

function toDate(value: Date | string | number): Date | null {
  const date = new Date(value instanceof Date ? value.getTime() : value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function formatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  try { return new Intl.DateTimeFormat(locale, options); }
  catch { return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }); }
}

function relative(ms: number): string {
  const seconds = Math.round(ms / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/**
 * The wall clock for relative times, read only after mounting: the server
 * and the first client render both show absolute times, so hydration
 * matches, then "3m ago" takes over and refreshes each minute.
 */
function useNow(enabled: boolean): number | null {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, [enabled]);
  return enabled ? now : null;
}

/**
 * A vertical activity log: time, a dot on a hairline spine, and what
 * happened. Entries that arrive while you watch flash once.
 */
export function Timeline({
  entries,
  groupByDay = false,
  timeFormat = groupByDay ? "time" : "datetime",
  timeZone = "UTC",
  locale = "en-GB",
  flash = true,
  empty = "No activity yet.",
  className,
  ...props
}: TimelineProps) {
  const now = useNow(timeFormat === "relative");
  const time = formatter(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone });
  // Date and time are formatted apart and joined: some locales put "at" between them, which is noise in a log.
  const dayMonth = formatter(locale, { day: "numeric", month: "short", timeZone });
  const full = formatter(locale, { dateStyle: "long", timeStyle: "short", timeZone });
  const day = formatter(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone });
  const dayKey = formatter("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone });

  // ---- change flash: only ids that weren't there last render ----
  const rows = React.useRef(new Map<string, HTMLLIElement>());
  const seen = React.useRef<Set<string> | null>(null);
  React.useLayoutEffect(() => {
    const before = seen.current;
    seen.current = new Set(entries.map((entry) => entry.id));
    if (!before || !flash) return;
    for (const entry of entries) {
      if (before.has(entry.id)) continue;
      const element = rows.current.get(entry.id);
      if (!element) continue;
      element.classList.remove("ui-flash");
      void element.offsetWidth;
      element.classList.add("ui-flash");
      element.addEventListener("animationend", () => element.classList.remove("ui-flash"), { once: true });
    }
  }, [entries, flash]);

  if (entries.length === 0) {
    return <div {...props} className={cn("text-ui text-ink-2", className)}>{empty}</div>;
  }

  // Split into runs of the same day, keeping the supplied order.
  const groups: { key: string; label: string | null; entries: { entry: TimelineEntry; date: Date | null }[] }[] = [];
  for (const entry of entries) {
    const date = toDate(entry.time);
    const key = groupByDay ? (date ? dayKey.format(date) : "unknown") : "all";
    let group = groups.at(-1);
    if (!group || group.key !== key) {
      group = { key, label: groupByDay ? (date ? day.format(date) : "Unknown date") : null, entries: [] };
      groups.push(group);
    }
    group.entries.push({ entry, date });
  }

  // One width for the whole time column, so dots and titles line up.
  const timeWidth = timeFormat === "time" || groupByDay ? "w-10" : "w-24";
  const shown = (date: Date) =>
    timeFormat === "relative" && now !== null ? relative(now - date.getTime())
      : timeFormat === "time" || (timeFormat === "relative" && groupByDay) ? time.format(date)
      : `${dayMonth.format(date)} ${time.format(date)}`;

  return (
    <div {...props} className={cn("flex w-full min-w-0 flex-col gap-4", className)}>
      {groups.map((group, groupIndex) => (
        <section key={`${group.key}-${groupIndex}`} aria-label={group.label ?? undefined} className="flex flex-col gap-1">
          {group.label ? <h3 className="ui-label m-0 pb-1">{group.label}</h3> : null}
          <ol className="relative m-0 flex list-none flex-col p-0">
            {group.entries.map(({ entry, date }, index) => {
              const last = index === group.entries.length - 1;
              return (
                <li
                  key={entry.id}
                  ref={(element) => { if (element) rows.current.set(entry.id, element); else rows.current.delete(entry.id); }}
                  data-tone={entry.tone}
                  className="relative grid grid-cols-[auto_12px_minmax(0,1fr)] gap-x-3 rounded-ui py-1.5 pr-2"
                >
                  {date ? (
                    <time
                      dateTime={date.toISOString()}
                      title={full.format(date)}
                      className={cn(
                        "pt-px text-right font-mono text-[11px] leading-5 whitespace-nowrap text-ink-3 tabular-nums",
                        timeWidth,
                      )}
                    >
                      {shown(date)}
                    </time>
                  ) : <span className={cn(timeWidth, "pt-px text-right font-mono text-[11px] leading-5 text-ink-3")}>—</span>}

                  {/* The spine runs through every row; the first and last rows trim it so it starts and ends at a dot. */}
                  <span aria-hidden="true" className="relative flex justify-center">
                    {group.entries.length > 1 ? (
                      <span className={cn("absolute w-px bg-line-strong", index === 0 ? "top-2.5 -bottom-1.5" : last ? "-top-1.5 h-4" : "-top-1.5 -bottom-1.5")} />
                    ) : null}
                    <span className={cn("relative mt-[7px] size-1.5 rounded-full", DOT[entry.tone ?? "neutral"])} />
                  </span>

                  <div className="min-w-0">
                    <p className="m-0 text-ui leading-5 break-words">
                      {entry.actor !== undefined ? <><span className="font-medium text-ink">{entry.actor}</span>{" "}</> : null}
                      <span className={entry.actor !== undefined ? "text-ink-2" : "text-ink"}>{entry.title}</span>
                    </p>
                    {entry.detail !== undefined ? <div className="mt-0.5 text-xs break-words text-ink-2">{entry.detail}</div> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
