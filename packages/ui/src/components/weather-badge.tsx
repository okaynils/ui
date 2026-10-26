import type * as React from "react";
import { cn } from "../lib/cn";
import { Skeleton } from "./skeleton";

export type WeatherCondition = "clear" | "partly-cloudy" | "cloudy" | "rain" | "snow" | "storm" | "fog" | "wind" | "unknown";
export type WeatherUnit = "celsius" | "fahrenheit";

export interface WeatherReading {
  /** Values are already in the unit supplied to the widget. */
  temperature: number;
  condition: WeatherCondition;
  /** A more specific description from the app, such as "Light rain". */
  conditionLabel?: string;
  high?: number;
  low?: number;
  /** ISO strings with an offset, Date objects, or Unix milliseconds. */
  sunrise?: Date | string | number;
  sunset?: Date | string | number;
  observedAt?: Date | string | number;
}

export interface WeatherBadgeProps extends Omit<React.ComponentProps<"div">, "children"> {
  location: string;
  /** Null, or a non-finite temperature, shows the unavailable state. */
  reading: WeatherReading | null;
  unit?: WeatherUnit;
  /** IANA zone for supplied sunrise/sunset/observation timestamps. Defaults to UTC. */
  timeZone?: string;
  locale?: string;
  loading?: boolean;
}

const LABEL: Record<WeatherCondition, string> = {
  clear: "Clear", "partly-cloudy": "Partly cloudy", cloudy: "Cloudy", rain: "Rain",
  snow: "Snow", storm: "Thunderstorms", fog: "Fog", wind: "Windy", unknown: "Conditions unavailable",
};

function timestamp(value: Date | string | number | undefined, locale: string, timeZone: string, observed = false) {
  if (value === undefined) return null;
  try {
    const date = new Date(value instanceof Date ? value.getTime() : value);
    const text = new Intl.DateTimeFormat(locale, {
      timeZone, hour: "2-digit", minute: "2-digit",
      ...(observed ? { day: "numeric" as const, month: "short" as const } : {}),
    }).format(date);
    return { text, iso: date.toISOString() };
  } catch {
    return null;
  }
}

/** A small weather report from supplied observations; it never fetches or assumes freshness. */
export function WeatherBadge({
  location, reading, unit = "celsius", timeZone = "UTC", locale = "en-GB", loading = false,
  className, ...props
}: WeatherBadgeProps) {
  let formatter: Intl.NumberFormat;
  try { formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }); }
  catch { formatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }); }
  const available = reading !== null && Number.isFinite(reading.temperature);
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  const spokenUnit = unit === "fahrenheit" ? "degrees Fahrenheit" : "degrees Celsius";
  const sunrise = timestamp(reading?.sunrise, locale, timeZone);
  const sunset = timestamp(reading?.sunset, locale, timeZone);
  const observed = timestamp(reading?.observedAt, locale, timeZone, true);

  return (
    <div
      role="group"
      aria-label={`Weather in ${location}`}
      {...props}
      aria-busy={loading || undefined}
      data-state={loading ? "loading" : available ? "available" : "unavailable"}
      className={cn("inline-flex max-w-full flex-col gap-2 rounded-box border border-line-strong bg-surface px-3 py-2.5 text-ui text-ink", className)}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="min-w-0 break-words text-ink-2">{location}</span>
        {loading ? (
          <><Skeleton className="h-4 w-20" /><span className="sr-only">Loading weather</span></>
        ) : available && reading ? (
          <>
            <WeatherIcon condition={reading.condition} />
            <span className="font-mono font-medium tabular-nums">
              <span aria-hidden>{formatter.format(reading.temperature)}{symbol}</span>
              <span className="sr-only">{formatter.format(reading.temperature)} {spokenUnit}</span>
            </span>
            <span className="text-ink-2">{reading.conditionLabel ?? LABEL[reading.condition] ?? LABEL.unknown}</span>
          </>
        ) : <span className="text-ink-3">Weather unavailable</span>}
      </div>
      {!loading && available && reading ? (
        <>
          {Number.isFinite(reading.high) || Number.isFinite(reading.low) ? (
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink-2 tabular-nums">
              {Number.isFinite(reading.high) ? <span>High {formatter.format(reading.high!)}{symbol}</span> : null}
              {Number.isFinite(reading.low) ? <span>Low {formatter.format(reading.low!)}{symbol}</span> : null}
            </div>
          ) : null}
          {sunrise || sunset ? (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-2">
              {sunrise ? <span>Sunrise <time dateTime={sunrise.iso} className="font-mono tabular-nums">{sunrise.text}</time></span> : null}
              {sunset ? <span>Sunset <time dateTime={sunset.iso} className="font-mono tabular-nums">{sunset.text}</time></span> : null}
            </div>
          ) : null}
          {observed ? <span className="text-xs text-ink-3">Observed <time dateTime={observed.iso}>{observed.text}</time></span> : null}
        </>
      ) : null}
    </div>
  );
}

function WeatherIcon({ condition }: { condition: WeatherCondition }) {
  const cloud = <path d="M5 16a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.7-1.4A4.7 4.7 0 0 1 18 16H5Z" />;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0 text-ink-2" aria-hidden="true">
      {condition === "clear" ? <><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></> :
        condition === "wind" ? <><path d="M2 8h13a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M2 16h7a3 3 0 1 1-3 3" /></> :
        condition === "fog" ? <><path d="M4 6h16M2 10h17M5 14h17M2 18h16" /></> :
        condition === "unknown" ? <><circle cx="12" cy="12" r="9" /><path d="M9.5 8a2.5 2.5 0 1 1 4 2c-1.1.7-1.5 1-1.5 2.5M12 16h.01" /></> :
        condition === "partly-cloudy" ? <><circle cx="17" cy="6" r="3" /><path d="M17 1v1m5 4h1m-2-4-1 1M12 2l1 1" />{cloud}</> :
        <>{cloud}{condition === "rain" ? <path d="m7 19-1 3m6-3-1 3m6-3-1 3" /> : condition === "snow" ? <path d="M6 20h.01M12 20h.01M18 20h.01M9 23h.01M15 23h.01" /> : condition === "storm" ? <path d="m13 15-4 5h4l-2 4" /> : null}</>}
    </svg>
  );
}
