import { Input as BaseInput } from "@base-ui/react/input";
import * as React from "react";
import { cn } from "../lib/cn";
import { Calendar, startOfDay } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DatePickerSize = "sm" | "md" | "lg";

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  /** Earliest selectable day. Typed dates outside the range are rejected. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Return true to disable a day (e.g. weekends). */
  isDateDisabled?: (date: Date) => boolean;
  /** First day of the week in the calendar: 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Locale for the calendar's month/weekday names and the weekday hint. */
  locale?: string;
  /** Height 28 / 32 / 36px, matching Button and Input. */
  size?: DatePickerSize;
  /** Submitted with the form as `YYYY-MM-DD`. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Needed when there's no visible label (no surrounding `Field`). */
  "aria-label"?: string;
  /** Layout classes (e.g. `w-44`). Defaults to full width. */
  className?: string;
}

/** `YYYY-MM-DD` in local time. */
export function formatISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Parse `YYYY-MM-DD` (also accepts `/` or `.` separators). Returns null if it isn't a real date. */
export function parseISODate(text: string): Date | null {
  const m = /^\s*(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\s*$/.exec(text);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])];
  const date = new Date(y, mo, d);
  return date.getFullYear() === y && date.getMonth() === mo && date.getDate() === d ? date : null;
}

const SIZE: Record<DatePickerSize, string> = {
  sm: "h-7 pl-2 text-xs",
  md: "h-8 pl-2.5 text-ui",
  lg: "h-9 pl-3 text-sm",
};

const groupSurface = [
  "rounded-ui bg-surface text-ink",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-shadow duration-120",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_12%)]",
  "has-[input:focus]:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
  "has-[[data-popup-open]]:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
  "has-[input[data-invalid]]:shadow-[inset_0_0_0_1px_var(--ui-err)]",
  "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-45",
].join(" ");

/**
 * A date field: type `YYYY-MM-DD` or pick from the calendar button. The text
 * is ISO on purpose — unambiguous in every locale, sortable, and what the
 * form submits. A weekday hint confirms what you typed. Works inside `Field`.
 */
export function DatePicker({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  isDateDisabled,
  weekStartsOn = 1,
  locale,
  size = "md",
  name,
  required,
  disabled,
  placeholder = "YYYY-MM-DD",
  className,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState<Date | null>(defaultValue);
  const date = controlled ? value : inner;
  const [text, setText] = React.useState(date ? formatISODate(date) : "");
  const [editing, setEditing] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Follow outside changes to a controlled value while not typing.
  const shown = editing ? text : date ? formatISODate(date) : "";

  const allowed = (d: Date) =>
    !(min && d < startOfDay(min)) && !(max && d > startOfDay(max)) && !(isDateDisabled?.(d) ?? false);

  const commit = (next: Date | null) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
    setText(next ? formatISODate(next) : "");
  };

  const commitText = () => {
    if (!editing) return;
    setEditing(false);
    if (text.trim() === "") {
      if (date !== null) commit(null);
      return;
    }
    const parsed = parseISODate(text);
    if (parsed && allowed(parsed)) {
      if (!date || formatISODate(parsed) !== formatISODate(date)) commit(parsed);
      else setText(formatISODate(parsed));
    } else {
      // Not a date we can take: put back the last good one.
      setText(date ? formatISODate(date) : "");
    }
  };

  const weekday = date ? new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date) : null;

  return (
    <div className={cn(groupSurface, "flex w-full min-w-0 items-center", className)}>
      <BaseInput
        name={name}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel}
        placeholder={placeholder}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        value={shown}
        onValueChange={(v) => {
          setEditing(true);
          setText(v);
        }}
        onBlur={commitText}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitText();
          if (e.key === "ArrowDown" && e.altKey) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          SIZE[size],
          "h-full w-full min-w-0 bg-transparent pr-1 font-mono text-ink tabular-nums outline-none placeholder:text-ink-3 disabled:cursor-not-allowed",
          size === "sm" ? "text-[11px]" : "text-xs",
        )}
      />
      {weekday && !editing ? (
        <span aria-hidden className="shrink-0 pr-1 text-xs text-ink-3 select-none">
          {weekday}
        </span>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          aria-label="Choose date"
          className={cn(
            "mr-0.5 flex shrink-0 cursor-default items-center justify-center rounded-[3px] text-ink-3 outline-none",
            "hover:bg-hover hover:text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
            "data-popup-open:bg-active data-popup-open:text-ink disabled:pointer-events-none",
            size === "sm" ? "size-6" : "size-7",
          )}
        >
          <CalendarIcon />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} className="w-auto p-2">
          <Calendar
            value={date}
            onValueChange={(d) => {
              commit(d);
              setEditing(false);
              setOpen(false);
            }}
            min={min}
            max={max}
            isDateDisabled={isDateDisabled}
            weekStartsOn={weekStartsOn}
            locale={locale}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" strokeLinecap="round" />
    </svg>
  );
}
