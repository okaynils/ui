import * as React from "react";
import { cn } from "../lib/cn";

/* ---- Date helpers. Plain local-time `Date`s at midnight; no library. ---- */

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function addMonths(d: Date, n: number): Date {
  // Clamp the day so Jan 31 + 1 month is Feb 28/29, not Mar 3.
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function key(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** A date range. `to` is null while the user is still choosing the end. */
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface CalendarBaseProps {
  /** The month shown. Controlled; pair with `onMonthChange`. Any day in the month works. */
  month?: Date;
  /** The month shown first, uncontrolled. Defaults to the selected date's month, else today's. */
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** First day of the week: 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** BCP 47 locale for month and weekday names. Defaults to the browser's. */
  locale?: string;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Return true to disable a day (e.g. weekends). */
  isDateDisabled?: (date: Date) => boolean;
  /** Focus the selected day (or today) on mount. Used inside popovers. */
  autoFocus?: boolean;
  /** Layout classes only. */
  className?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  /** Pick a start and an end day. The first click sets `from`, the second `to`. */
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/**
 * A month grid for picking a day or a range. Keyboard: arrows move a day/week,
 * PageUp/PageDown a month (⇧ for a year), Home/End to the week's edges,
 * Enter/Space selects. Months switch instantly — it's a grid you scan, not a
 * place you travel to.
 */
export function Calendar(props: CalendarProps) {
  const {
    weekStartsOn = 1,
    locale,
    min,
    max,
    isDateDisabled,
    autoFocus = false,
    className,
  } = props;
  const range = props.mode === "range";
  const today = startOfDay(new Date());

  // Selection, controlled or not.
  const controlled = props.value !== undefined;
  const [innerSingle, setInnerSingle] = React.useState<Date | null>(() =>
    !range ? ((props as CalendarSingleProps).defaultValue ?? null) : null,
  );
  const [innerRange, setInnerRange] = React.useState<DateRange>(() =>
    range ? ((props as CalendarRangeProps).defaultValue ?? { from: null, to: null }) : { from: null, to: null },
  );
  const single = !range ? (controlled ? ((props as CalendarSingleProps).value ?? null) : innerSingle) : null;
  const rangeValue = range ? (controlled ? (props as CalendarRangeProps).value! : innerRange) : null;
  const anchor = single ?? rangeValue?.from ?? null;

  // Visible month, controlled or not.
  const [innerMonth, setInnerMonth] = React.useState(() => startOfMonth(props.defaultMonth ?? anchor ?? today));
  const month = props.month ? startOfMonth(props.month) : innerMonth;
  const setMonth = (m: Date) => {
    const next = startOfMonth(m);
    if (!props.month) setInnerMonth(next);
    props.onMonthChange?.(next);
  };

  // The day that holds the roving tab stop.
  const [focused, setFocused] = React.useState<Date>(() => startOfDay(anchor ?? today));
  const focusTarget = sameMonth(focused, month) ? focused : anchor && sameMonth(anchor, month) ? anchor : sameMonth(today, month) ? today : month;
  const [hovered, setHovered] = React.useState<Date | null>(null);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const shouldFocus = React.useRef(autoFocus);
  React.useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-key="${key(focusTarget)}"]`)?.focus();
  });

  const disabled = (d: Date) =>
    (min !== undefined && d < startOfDay(min)) || (max !== undefined && d > startOfDay(max)) || (isDateDisabled?.(d) ?? false);

  const select = (d: Date) => {
    if (disabled(d)) return;
    setFocused(d);
    if (!sameMonth(d, month)) setMonth(d);
    if (!range) {
      if (!controlled) setInnerSingle(d);
      (props as CalendarSingleProps).onValueChange?.(d);
      return;
    }
    const current = rangeValue!;
    let next: DateRange;
    if (!current.from || current.to) next = { from: d, to: null };
    else if (d < current.from) next = { from: d, to: current.from };
    else next = { from: current.from, to: d };
    if (!controlled) setInnerRange(next);
    (props as CalendarRangeProps).onValueChange?.(next);
  };

  const move = (d: Date) => {
    setFocused(d);
    if (!sameMonth(d, month)) setMonth(d);
    shouldFocus.current = true;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const from = focusTarget;
    const weekday = (from.getDay() - weekStartsOn + 7) % 7;
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(from, -1),
      ArrowRight: () => addDays(from, 1),
      ArrowUp: () => addDays(from, -7),
      ArrowDown: () => addDays(from, 7),
      PageUp: () => addMonths(from, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(from, e.shiftKey ? 12 : 1),
      Home: () => addDays(from, -weekday),
      End: () => addDays(from, 6 - weekday),
    };
    const fn = map[e.key];
    if (!fn) return;
    e.preventDefault();
    move(fn());
  };

  // Six rows always, so the grid never changes height between months.
  const gridStart = addDays(month, -((month.getDay() - weekStartsOn + 7) % 7));
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7));

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const dayLabel = new Intl.DateTimeFormat(locale, { dateStyle: "full" });

  // Range preview: while choosing the end, show the span up to the hovered day.
  let spanFrom: Date | null = null;
  let spanTo: Date | null = null;
  if (rangeValue?.from) {
    const end = rangeValue.to ?? hovered;
    if (end) [spanFrom, spanTo] = end < rangeValue.from ? [end, rangeValue.from] : [rangeValue.from, end];
    else [spanFrom, spanTo] = [rangeValue.from, rangeValue.from];
  }

  const prevDisabled = min !== undefined && addDays(month, -1) < startOfDay(min);
  const nextDisabled = max !== undefined && startOfMonth(addMonths(month, 1)) > startOfDay(max);

  return (
    <div className={cn("w-[15.5rem] select-none", className)}>
      <div className="flex h-8 items-center justify-between pb-1">
        <div className="pl-1 text-ui font-medium text-ink" aria-live="polite">
          {monthLabel}
        </div>
        <div className="flex">
          <NavButton label="Previous month" disabled={prevDisabled} onClick={() => setMonth(addMonths(month, -1))}>
            <path d="M10 3.5 5.5 8l4.5 4.5" />
          </NavButton>
          <NavButton label="Next month" disabled={nextDisabled} onClick={() => setMonth(addMonths(month, 1))}>
            <path d="M6 3.5 10.5 8 6 12.5" />
          </NavButton>
        </div>
      </div>
      <div ref={gridRef} role="grid" aria-label={monthLabel} onKeyDown={onKeyDown} onMouseLeave={() => setHovered(null)}>
        <div role="row" className="grid grid-cols-7">
          {days.slice(0, 7).map((d) => (
            <div key={d.getDay()} role="columnheader" aria-label={weekdayLong.format(d)} className="ui-label flex h-7 items-center justify-center">
              {weekdayFmt.format(d).slice(0, 2)}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={key(week[0]!)} role="row" className="grid grid-cols-7">
            {week.map((d) => {
              const outside = !sameMonth(d, month);
              const isDisabled = disabled(d);
              const isToday = sameDay(d, today);
              const inSpan = spanFrom && spanTo ? d >= spanFrom && d <= spanTo : false;
              const isStart = sameDay(d, spanFrom);
              const isEnd = sameDay(d, spanTo);
              const isSelected = range ? isStart || isEnd : sameDay(d, single);
              const between = range && inSpan && !isStart && !isEnd;
              const preview = range && rangeValue?.from && !rangeValue.to && inSpan;
              return (
                <div
                  key={key(d)}
                  role="gridcell"
                  aria-selected={isSelected || between || undefined}
                  className={cn(
                    "relative flex h-8 items-center justify-center",
                    // The range band runs edge to edge between start and end.
                    between && "bg-active",
                    between && preview && "bg-hover",
                    range && isStart && !sameDay(spanFrom, spanTo) && "bg-[linear-gradient(to_right,transparent_50%,var(--ui-active)_50%)]",
                    range && isEnd && !sameDay(spanFrom, spanTo) && "bg-[linear-gradient(to_left,transparent_50%,var(--ui-active)_50%)]",
                    preview && isEnd && !sameDay(spanFrom, spanTo) && "bg-[linear-gradient(to_left,transparent_50%,var(--ui-hover)_50%)]",
                    preview && isStart && !sameDay(spanFrom, spanTo) && "bg-[linear-gradient(to_right,transparent_50%,var(--ui-hover)_50%)]",
                  )}
                >
                  <button
                    type="button"
                    data-key={key(d)}
                    tabIndex={sameDay(d, focusTarget) ? 0 : -1}
                    // aria-disabled, not disabled: the keyboard can still walk across
                    // a disabled day instead of getting stuck before it.
                    aria-disabled={isDisabled || undefined}
                    aria-label={dayLabel.format(d)}
                    aria-current={isToday ? "date" : undefined}
                    aria-pressed={isSelected}
                    onClick={() => select(d)}
                    onFocus={() => setFocused(d)}
                    onMouseEnter={() => setHovered(d)}
                    className={cn(
                      "relative flex size-8 cursor-default items-center justify-center rounded-[3px] text-ui tabular-nums outline-none",
                      "transition-colors duration-120",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                      "aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
                      outside ? "text-ink-3" : "text-ink",
                      !isSelected && !isDisabled && "hover:bg-hover",
                      isSelected && "bg-ink font-medium text-surface",
                      isToday && !isSelected && "font-semibold text-accent",
                    )}
                  >
                    {d.getDate()}
                    {isToday ? (
                      <span aria-hidden className={cn("absolute bottom-1 size-[3px] rounded-full", isSelected ? "bg-surface" : "bg-accent")} />
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="ui-press flex size-7 cursor-default items-center justify-center rounded-ui text-ink-2 outline-none hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-45"
    >
      <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
