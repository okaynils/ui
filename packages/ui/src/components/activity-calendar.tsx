import * as React from "react";
import { cn } from "../lib/cn";
import { Tooltip, TooltipProvider } from "./tooltip";

export interface ActivityCalendarDay {
  /** A calendar date in YYYY-MM-DD form, interpreted in UTC. */
  date: string;
  count: number;
}

export interface ActivityCalendarProps extends Omit<React.ComponentProps<"div">, "children" | "onSelect"> {
  /** Calendar year, from 1 to 9999. Explicit so server and client render the same range. */
  year: number;
  days: readonly ActivityCalendarDay[];
  label?: string;
  /** Start each column on Sunday (0) or Monday (1). */
  weekStartsOn?: 0 | 1;
  /** Count that fills the darkest cell. Defaults to the largest count in this year, at least 1. */
  maxCount?: number;
  /** Locale for month names, date details and counts. Defaults to en-GB. */
  locale?: string;
  /** Describes a day's amount, e.g. count => `${count} km`. Date is supplied separately. */
  formatCount?: (count: number) => string;
  /** Optional action when a day is clicked or activated with Enter/Space. */
  onDayClick?: (day: ActivityCalendarDay) => void;
}

const DAY = 86_400_000;
const LEVELS = ["bg-hover", "bg-ink-3/25", "bg-ink-3/45", "bg-ink-3/70", "bg-ink-2"] as const;

function firstDay(year: number): number {
  const date = new Date(0);
  date.setUTCFullYear(year, 0, 1);
  return date.getTime();
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** A year of daily activity, encoded with four neutral intensity levels. */
export function ActivityCalendar({
  year,
  days,
  label = "Activity",
  weekStartsOn = 1,
  maxCount,
  locale = "en-GB",
  formatCount,
  onDayClick,
  className,
  ...props
}: ActivityCalendarProps) {
  const validYear = Number.isInteger(year) && year >= 1 && year <= 9999;
  const start = validYear ? firstDay(year) : 0;
  const length = validYear ? Math.round((firstDay(year + 1) - start) / DAY) : 0;
  const offset = validYear ? (new Date(start).getUTCDay() - weekStartsOn + 7) % 7 : 0;
  const weeks = Math.ceil((offset + length) / 7);
  const [focused, setFocused] = React.useState(0);
  const [detailDate, setDetailDate] = React.useState<string | null>(null);
  const refs = React.useRef(new Map<number, HTMLButtonElement>());

  const counts = React.useMemo(() => {
    const result = new Map<string, number>();
    for (const day of days) {
      if (!validDate(day.date) || Number(day.date.slice(0, 4)) !== year || !Number.isFinite(day.count) || day.count < 0) continue;
      const sum = (result.get(day.date) ?? 0) + day.count;
      result.set(day.date, Number.isFinite(sum) ? sum : Number.MAX_VALUE);
    }
    return result;
  }, [days, year]);
  const ceiling = maxCount !== undefined && Number.isFinite(maxCount) && maxCount > 0
    ? maxCount : Math.max(1, ...counts.values());
  const amount = (count: number) => formatCount?.(count) ?? `${new Intl.NumberFormat(locale).format(count)} ${count === 1 ? "activity" : "activities"}`;
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" });
  const monthFormat = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const totalText = amount(Number.isFinite(total) ? total : Number.MAX_VALUE);
  const detail = detailDate && counts.has(detailDate) ? counts.get(detailDate)! : 0;
  const detailInYear = detailDate && Number(detailDate.slice(0, 4)) === year;
  const tabStop = Math.min(focused, Math.max(0, length - 1));

  function move(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const row = (index + offset) % 7;
    const targets: Record<string, number> = {
      ArrowLeft: index - 7, ArrowRight: index + 7,
      ArrowUp: index - 1, ArrowDown: index + 1,
      Home: event.ctrlKey || event.metaKey ? 0 : index - row,
      End: event.ctrlKey || event.metaKey ? length - 1 : index + 6 - row,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(length - 1, target));
    setFocused(next);
    refs.current.get(next)?.focus();
  }

  if (!validYear) {
    return <div {...props} className={cn("text-ui text-ink-2", className)}>Calendar unavailable. Use a year from 1 to 9999.</div>;
  }

  const months: { column: number; text: string }[] = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(start);
    date.setUTCMonth(month);
    months.push({ column: Math.floor(((date.getTime() - start) / DAY + offset) / 7), text: monthFormat.format(date) });
  }

  return (
    <div {...props} className={cn("w-full min-w-0 space-y-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-ui font-medium text-ink">{label}</span>
        <span className="font-mono text-xs text-ink-2 tabular-nums">{totalText} in {year}</span>
      </div>
      <div className="max-w-full overflow-x-auto overscroll-x-contain pb-1">
        <div className="w-max pr-1">
          <div aria-hidden className="relative ml-9 mb-1 h-4 font-mono text-[11px] text-ink-3" style={{ width: weeks * 15 - 3 }}>
            {months.map((month, i) => <span key={i} className="absolute" style={{ left: month.column * 15 }}>{month.text}</span>)}
          </div>
          <div className="flex gap-2">
            <div aria-hidden className="grid w-7 shrink-0 grid-rows-7 gap-[3px] font-mono text-[11px] leading-3 text-ink-3">
              {Array.from({ length: 7 }, (_, row) => {
                const weekday = (row + weekStartsOn) % 7;
                return <span key={row} className="h-3">{row % 2 === 0 ? weekdayFormat.format(new Date(Date.UTC(2024, 0, 7 + weekday))) : ""}</span>;
              })}
            </div>
            <TooltipProvider delay={200}>
              <div role="group" aria-label={`${label}, ${year}. Use arrow keys to explore days.`} className="grid grid-flow-col grid-rows-7 gap-[3px]">
                {Array.from({ length: weeks * 7 }, (_, cell) => {
                  const index = cell - offset;
                  if (index < 0 || index >= length) return <span key={cell} aria-hidden className="size-3" />;
                  const date = new Date(start + index * DAY);
                  const iso = date.toISOString().slice(0, 10);
                  const count = counts.get(iso) ?? 0;
                  const level = count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(count / ceiling * 4)));
                  const text = `${dateFormat.format(date)}: ${amount(count)}`;
                  return (
                    <Tooltip key={cell} content={text}>
                      <button
                        ref={(element) => { if (element) refs.current.set(index, element); else refs.current.delete(index); }}
                        type="button"
                        tabIndex={index === tabStop ? 0 : -1}
                        aria-label={text}
                        onFocus={() => { setFocused(index); setDetailDate(iso); }}
                        onMouseEnter={() => setDetailDate(iso)}
                        onClick={() => { setDetailDate(iso); onDayClick?.({ date: iso, count }); }}
                        onKeyDown={(event) => move(event, index)}
                        className={cn("size-3 shrink-0 cursor-default rounded-[2px] outline-none focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent", LEVELS[level])}
                      />
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-2">
        <span className="min-h-4">{detailInYear ? `${dateFormat.format(new Date(`${detailDate}T00:00:00Z`))}: ${amount(detail)}` : "Hover or focus a day for details."}</span>
        <span aria-label="Darker cells mean more activity" className="inline-flex items-center gap-1.5">
          <span>Less</span>{LEVELS.map((level, i) => <span key={i} aria-hidden className={cn("size-3 rounded-[2px]", level)} />)}<span>More</span>
        </span>
      </div>
    </div>
  );
}
