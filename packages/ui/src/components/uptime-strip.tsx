import * as React from "react";
import { cn } from "../lib/cn";
import { Skeleton } from "./skeleton";
import { Status, type StatusTone } from "./status";
import { Tooltip, TooltipProvider } from "./tooltip";

export type UptimeStatus = "operational" | "degraded" | "outage" | "unknown";

export interface UptimeDay {
  /** UTC calendar date in YYYY-MM-DD form. */
  date: string;
  status: UptimeStatus;
  /** Plain-language incident or report details. */
  incident?: string;
}

export interface UptimeStripProps extends Omit<React.ComponentProps<"div">, "children"> {
  days: readonly UptimeDay[];
  label?: string;
  /** An independently measured percentage from the app, in the range 0–100. Never derived from day statuses. */
  uptime?: number;
  locale?: string;
  loading?: boolean;
  onDaySelect?: (day: UptimeDay) => void;
}

const STATES: Record<UptimeStatus, { label: string; tone: StatusTone; bar: string }> = {
  operational: { label: "Operational", tone: "ok", bar: "bg-ok" },
  degraded: { label: "Degraded", tone: "warn", bar: "bg-warn" },
  outage: { label: "Outage", tone: "err", bar: "bg-err" },
  unknown: { label: "Unknown", tone: "neutral", bar: "bg-ink-3/40" },
};

function validDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

/** Daily service reports with exact incident detail; percentage is always supplied by the app. */
export function UptimeStrip({ days, label = "Service health", uptime, locale = "en-GB", loading = false, onDaySelect, className, ...props }: UptimeStripProps) {
  const reports = React.useMemo(() => {
    const byDate = new Map<string, UptimeDay>();
    for (const day of days) if (validDate(day.date) && Object.hasOwn(STATES, day.status)) byDate.set(day.date, day);
    return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [days]);
  const [activeDate, setActiveDate] = React.useState<string | null>(null);
  const buttons = React.useRef(new Map<string, HTMLButtonElement>());
  const activeIndex = Math.max(0, reports.findIndex((day) => day.date === activeDate));
  const detail = activeDate ? reports.find((day) => day.date === activeDate) ?? reports.at(-1) : reports.at(-1);
  const latest = reports.at(-1);
  const unknown = reports.filter((day) => day.status === "unknown").length;
  const validUptime = typeof uptime === "number" && Number.isFinite(uptime) && uptime >= 0 && uptime <= 100;
  let dateFormat: Intl.DateTimeFormat;
  let numberFormat: Intl.NumberFormat;
  try {
    dateFormat = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    numberFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    numberFormat = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  const formatDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));

  function move(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowLeft" ? index - 1 : event.key === "ArrowRight" ? index + 1 : event.key === "Home" ? 0 : event.key === "End" ? reports.length - 1 : undefined;
    if (next === undefined) return;
    event.preventDefault();
    const day = reports[Math.max(0, Math.min(reports.length - 1, next))];
    if (!day) return;
    setActiveDate(day.date);
    buttons.current.get(day.date)?.focus();
  }

  return (
    <div {...props} aria-busy={loading || undefined} className={cn("w-full min-w-0 space-y-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-ui font-medium text-ink">{label}</span>
        {!loading && validUptime ? <span className="font-mono text-xs text-ink-2 tabular-nums">{numberFormat.format(uptime)}% uptime</span> : null}
      </div>
      {loading ? <><Skeleton className="h-8 w-full" /><span className="sr-only">Loading health reports</span></> : reports.length === 0 ? <p className="text-ui text-ink-2">No health reports yet.</p> : (
        <>
          <div className="max-w-full overflow-x-auto overscroll-x-contain">
            <TooltipProvider delay={250}>
              <div role="group" aria-label={`${label}: daily reports, oldest first`} className="flex min-w-[18rem] items-center gap-1 px-0.5">
                {reports.map((day, index) => {
                  const state = STATES[day.status];
                  const name = `${formatDate(day.date)}: ${state.label}${day.incident ? `. ${day.incident}` : ""}`;
                  return (
                    <Tooltip key={day.date} content={`${formatDate(day.date)} · ${state.label}`}>
                      <button
                        ref={(node) => { if (node) buttons.current.set(day.date, node); else buttons.current.delete(day.date); }}
                        type="button"
                        aria-label={name}
                        tabIndex={index === activeIndex ? 0 : -1}
                        onFocus={() => setActiveDate(day.date)}
                        onMouseEnter={() => setActiveDate(day.date)}
                        onKeyDown={(event) => move(event, index)}
                        onClick={() => { setActiveDate(day.date); onDaySelect?.(day); }}
                        className="flex h-8 min-w-1 flex-1 cursor-default items-center justify-center rounded-[2px] outline-none hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                      >
                        <span aria-hidden className={cn("h-6 w-full max-w-2 rounded-[1px]", state.bar)} />
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
          <div className="flex justify-between gap-3 font-mono text-[11px] text-ink-3">
            <time dateTime={reports[0]!.date}>{formatDate(reports[0]!.date)}</time>
            <time dateTime={latest!.date}>{formatDate(latest!.date)}</time>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <Status tone={STATES[latest!.status].tone} className="text-xs">Latest report: {STATES[latest!.status].label.toLowerCase()}</Status>
            <span className="text-xs text-ink-3">{reports.length - unknown} reported{unknown ? ` · ${unknown} unknown` : ""}</span>
          </div>
          {detail ? (
            <div className="min-h-12 border-t border-line pt-2 text-xs text-ink-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><time dateTime={detail.date} className="font-mono text-ink-3">{formatDate(detail.date)}</time><span className="text-ink">{STATES[detail.status].label}</span></div>
              <p className="mt-1 break-words">{detail.incident || (detail.status === "unknown" ? "No report supplied for this day." : "No incident details supplied.")}</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
