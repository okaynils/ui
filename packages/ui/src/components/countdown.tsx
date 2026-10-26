import * as React from "react";
import { cn } from "../lib/cn";

export type CountdownPrecision = "minutes" | "seconds";

export interface CountdownProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Absolute instant. Strings must include a timezone, such as Z or +02:00. Numbers are Unix milliseconds. */
  target: Date | string | number;
  label?: React.ReactNode;
  precision?: CountdownPrecision;
  /** Content shown after the target, replacing the remaining duration. */
  finished?: React.ReactNode;
  /** Freeze at an instant for previews or app-controlled time. No timer runs while supplied. */
  now?: Date | string | number;
  /** Fires after mounting when the target is reached. Changing the target resets completion. */
  onComplete?: () => void;
}

function instant(value: Date | string | number): number {
  // A date without an offset depends on the machine's timezone and can silently
  // change the deadline between server and client.
  if (typeof value === "string") {
    const text = value.trim();
    const datePart = /^(\d{4}-\d{2}-\d{2})T.*(?:Z|[+-]\d{2}:?\d{2})$/i.exec(text)?.[1];
    if (!datePart) return NaN;
    const day = new Date(`${datePart}T00:00:00Z`);
    if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== datePart) return NaN;
    return new Date(text).getTime();
  }
  return new Date(value instanceof Date ? value.getTime() : value).getTime();
}

function duration(milliseconds: number, precision: CountdownPrecision) {
  const unit = precision === "seconds" ? 1000 : 60_000;
  const ticks = Math.ceil(milliseconds / unit);
  const minutes = precision === "seconds" ? Math.floor(ticks / 60) : ticks;
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor(minutes / 60) % 24;
  const remainder = minutes % 60;
  const seconds = precision === "seconds" ? ticks % 60 : null;
  const values: [number, string, string][] = [];
  if (days > 0) values.push([days, "d", "day"]);
  if (days > 0 || hours > 0) values.push([hours, "h", "hour"]);
  values.push([remainder, "m", "minute"]);
  if (seconds !== null) values.push([seconds, "s", "second"]);
  return {
    visual: values.map(([value, short], index) => `${index === 0 ? value : String(value).padStart(2, "0")}${short}`).join(" "),
    spoken: `${values.map(([value, , long]) => `${value} ${long}${value === 1 ? "" : "s"}`).join(", ")} remaining`,
  };
}

/** Time until an absolute instant; the clock catches up rather than counting interval callbacks. */
export function Countdown({
  target,
  label,
  precision = "seconds",
  finished = "It's time.",
  now,
  onComplete,
  className,
  ...props
}: CountdownProps) {
  const targetTime = instant(target);
  const fixedNow = now === undefined ? undefined : instant(now);
  // Matching placeholders on the server and first client render avoid a
  // hydration mismatch caused by time passing between those renders.
  const [clock, setClock] = React.useState<number | null>(null);
  const validTarget = Number.isFinite(targetTime);
  const current = fixedNow === undefined ? clock : fixedNow;
  const valid = validTarget && (current === null || Number.isFinite(current));
  const remaining = current === null || !valid ? null : Math.max(0, targetTime - current);
  const completion = React.useRef<{ target: number; called: boolean }>({ target: targetTime, called: false });

  React.useEffect(() => {
    if (!validTarget || fixedNow !== undefined) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const step = precision === "seconds" ? 1000 : 60_000;
    const tick = () => {
      clearTimeout(timer);
      const time = Date.now();
      setClock(time);
      const left = targetTime - time;
      if (left > 0) timer = setTimeout(tick, Math.min((left % step) || step, left));
    };
    tick();
    // Background tabs throttle timers. Read the actual clock immediately when
    // the user returns, instead of waiting for a delayed interval callback.
    const visible = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("focus", tick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("focus", tick);
    };
  }, [targetTime, fixedNow, precision, validTarget]);

  React.useEffect(() => {
    if (!Object.is(completion.current.target, targetTime)) completion.current = { target: targetTime, called: false };
    if (remaining === 0 && !completion.current.called) {
      completion.current.called = true;
      onComplete?.();
    }
  }, [targetTime, remaining, onComplete]);

  const display = remaining !== null && remaining > 0 ? duration(remaining, precision) : null;
  const state = !valid ? "unavailable" : remaining === null ? "loading" : remaining === 0 ? "complete" : "counting";
  return (
    <div
      role="timer"
      aria-live="off"
      {...props}
      data-state={state}
      className={cn("inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-1 text-ui text-ink", className)}
    >
      {label ? <span className="text-ink-2">{label}</span> : null}
      {!valid ? <span className="text-ink-3">Countdown unavailable</span> : remaining === null ? (
        <span className="font-mono text-xs tabular-nums"><span aria-hidden>--:--</span><span className="sr-only">Loading countdown</span></span>
      ) : remaining === 0 ? <span>{finished}</span> : display ? (
        <time dateTime={new Date(targetTime).toISOString()} className="font-mono text-xs tabular-nums">
          <span aria-hidden>{display.visual}</span><span className="sr-only">{display.spoken}</span>
        </time>
      ) : null}
    </div>
  );
}
