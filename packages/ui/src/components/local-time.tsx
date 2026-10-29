import * as React from "react";
import { cn } from "../lib/cn";
import { StatusDot } from "./status";

export interface LocalTimeWorkingHours {
  /** Local wall-clock hour, from 0 to 24. Fractions are allowed (9.5 = 09:30). */
  start: number;
  /** Exclusive end hour. A value below start means the shift ends the next day. */
  end: number;
  /** Days on which a shift starts: Sunday = 0. Defaults to Monday–Friday. */
  days?: readonly number[];
}

export interface LocalTimeProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** IANA time zone, e.g. Europe/Stockholm. Invalid zones show “Time unavailable”. */
  timeZone: string;
  /** Place name before the time. Defaults to the last segment of timeZone. */
  label?: React.ReactNode;
  /** Clock formatting locale. Defaults to en-GB (24-hour time). */
  locale?: string;
  /** Freeze the clock at this instant. Omit for a clock that updates each minute. */
  at?: Date | string | number;
  workingHours?: LocalTimeWorkingHours;
  /** Show the current time-zone difference from the viewer. Accounts for DST. */
  showDifference?: boolean;
  /** Defaults to the browser's time zone after hydration. Useful for fixed previews. */
  viewerTimeZone?: string;
}

const WEEKDAYS = [1, 2, 3, 4, 5];

function offsetMinutes(date: Date, timeZone: string): number {
  const offset = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date).find((part) => part.type === "timeZoneName")?.value;
  if (offset === "GMT") return 0;
  const match = /^GMT([+-])(\d{2}):(\d{2})$/.exec(offset ?? "");
  if (!match) throw new RangeError("Unsupported time-zone offset");
  return (Number(match[2]) * 60 + Number(match[3])) * (match[1] === "+" ? 1 : -1);
}

/** Local wall-clock hour and minute in a zone. */
function wallClock(date: Date, timeZone: string): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { hour: get("hour"), minute: get("minute") };
}

function differenceLabel(minutes: number): string {
  if (minutes === 0) return "Same time as you";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const remainder = absolute % 60;
  const amount = [hours ? `${hours}h` : "", remainder ? `${remainder}m` : ""].filter(Boolean).join(" ");
  return `${amount} ${minutes > 0 ? "ahead of" : "behind"} you`;
}

function isWorking(date: Date, timeZone: string, hours: LocalTimeWorkingHours): boolean | null {
  if (!Number.isFinite(hours.start) || !Number.isFinite(hours.end) || hours.start < 0 || hours.start >= 24 || hours.end < 0 || hours.end > 24 || hours.start === hours.end) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const hour = Number(get("hour")) + Number(get("minute")) / 60;
  const days = hours.days ?? WEEKDAYS;
  if (hours.end > hours.start) return days.includes(day) && hour >= hours.start && hour < hours.end;
  // The early hours belong to the shift that began on the previous day.
  return hour >= hours.start ? days.includes(day) : hour < hours.end && days.includes((day + 6) % 7);
}

/** A place's local clock, with optional working hours and a DST-aware difference. */
export function LocalTime({
  timeZone,
  label = timeZone.split("/").pop()?.replace(/_/g, " ") ?? timeZone,
  locale = "en-GB",
  at,
  workingHours,
  showDifference = false,
  viewerTimeZone,
  className,
  ...props
}: LocalTimeProps) {
  // A placeholder on server and first client render avoids a mismatched clock
  // and avoids assuming that the server's time zone is the visitor's.
  const [now, setNow] = React.useState<number | null>(null);
  const [browserZone, setBrowserZone] = React.useState<string | undefined>();
  React.useEffect(() => {
    if (showDifference && !viewerTimeZone) setBrowserZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [showDifference, viewerTimeZone]);
  React.useEffect(() => {
    if (at !== undefined) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(Date.now());
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    tick();
    return () => clearTimeout(timer);
  }, [at]);

  const date = at === undefined ? (now === null ? null : new Date(now)) : new Date(at instanceof Date ? at.getTime() : at);
  let text = "--:--";
  let iso: string | undefined;
  let difference: string | undefined;
  let working: boolean | null = null;
  let invalid = false;
  let face: { hour: number; minute: number } | null = null;
  try {
    // Validate even while the clock has not mounted.
    const formatter = new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit" });
    if (date) {
      text = formatter.format(date);
      iso = date.toISOString();
      face = wallClock(date, timeZone);
      if (workingHours) working = isWorking(date, timeZone, workingHours);
      const viewer = viewerTimeZone ?? browserZone;
      if (showDifference && viewer) {
        try { difference = differenceLabel(offsetMinutes(date, timeZone) - offsetMinutes(date, viewer)); }
        catch { difference = "Time difference unavailable"; }
      }
    }
  } catch {
    invalid = true;
    text = "Time unavailable";
  }

  return (
    <span {...props} className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-ui text-ink", className)}>
      {label ? <span className="text-ink-2">{label}</span> : null}
      {label ? <span aria-hidden className="text-ink-3">·</span> : null}
      {!invalid ? <ClockFace time={face} /> : null}
      <time dateTime={iso} className="font-mono text-xs tabular-nums" aria-label={!date && !invalid ? "Loading local time" : undefined}>{text}</time>
      {!invalid && date && workingHours ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-2">
          <StatusDot tone={working === true ? "ok" : "neutral"} />
          {working === null ? "Hours unavailable" : working ? "Working hours" : "Outside working hours"}
        </span>
      ) : null}
      {difference ? <span className="text-xs text-ink-3">{difference}</span> : null}
    </span>
  );
}

// Night on the face: the dial goes dark from 20:00 to 06:59 local time. A
// rough cue, not sunset; it answers "is it a reasonable hour to write?".
const isNight = (hour: number) => hour >= 20 || hour < 7;

/**
 * A 16px analog dial. The hands step when the minute changes and only then;
 * they always turn forward, so 59 → 00 is one more step, not a lap backwards.
 */
function ClockFace({ time }: { time: { hour: number; minute: number } | null }) {
  const minuteTarget = time ? time.minute * 6 : 0;
  const hourTarget = time ? ((time.hour % 12) + time.minute / 60) * 30 : 0;
  const angles = React.useRef<{ minute: number; hour: number } | null>(null);
  const previous = angles.current;
  const forward = (from: number, to: number) => from + ((to - (from % 360) + 360) % 360);
  const next = time ? { minute: previous ? forward(previous.minute, minuteTarget) : minuteTarget, hour: previous ? forward(previous.hour, hourTarget) : hourTarget } : null;
  React.useEffect(() => { if (next) angles.current = next; });
  // No transition on the first real time, so a mounting clock appears set
  // instead of sweeping round from twelve.
  const moving = previous !== null;
  const night = time ? isNight(time.hour) : false;
  const hand = cn("origin-[8px_8px]", moving && "transition-transform duration-180 ease-snap");

  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" data-night={night || undefined} className="size-4 shrink-0">
      <circle cx="8" cy="8" r="7.25" fill={night ? "var(--ui-ink)" : "none"} stroke={night ? "var(--ui-ink)" : "var(--ui-line-strong)"} strokeWidth="1.5" />
      <path d="M8 1.75v1.5" stroke={night ? "var(--ui-surface)" : "var(--ui-ink-3)"} strokeWidth="1" strokeLinecap="round" />
      {next ? (
        <g stroke={night ? "var(--ui-surface)" : "var(--ui-ink)"} strokeLinecap="round">
          <line x1="8" y1="8" x2="8" y2="4.75" strokeWidth="1.5" className={hand} style={{ transform: `rotate(${next.hour}deg)` }} />
          <line x1="8" y1="8" x2="8" y2="2.75" strokeWidth="1" className={hand} style={{ transform: `rotate(${next.minute}deg)` }} />
        </g>
      ) : null}
    </svg>
  );
}
