import * as React from "react";
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
  /**
   * The instant the daylight arc is drawn for. Omit for the live clock, which
   * moves the sun once a minute; pass a value to freeze it for previews.
   */
  now?: Date | string | number;
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

function instant(value: Date | string | number | undefined): number | null {
  if (value === undefined) return null;
  const time = new Date(value instanceof Date ? value.getTime() : value).getTime();
  return Number.isFinite(time) ? time : null;
}

function span(milliseconds: number): string {
  const minutes = Math.max(1, Math.round(milliseconds / 60_000));
  const hours = Math.floor(minutes / 60);
  return [hours ? `${hours}h` : "", minutes % 60 ? `${minutes % 60}m` : ""].filter(Boolean).join(" ");
}

/**
 * The current minute, or null until mounted. Server and first client render
 * agree on "no sun yet" instead of on two different clocks.
 */
function useMinute(frozen: number | null | undefined): number | null {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (frozen !== undefined) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(Date.now());
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    tick();
    return () => clearTimeout(timer);
  }, [frozen]);
  return frozen === undefined ? now : frozen;
}

/** A small weather report from supplied observations; it never fetches or assumes freshness. */
export function WeatherBadge({
  location, reading, unit = "celsius", timeZone = "UTC", locale = "en-GB", loading = false,
  now: nowProp, className, ...props
}: WeatherBadgeProps) {
  const now = useMinute(nowProp === undefined ? undefined : instant(nowProp));
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
          {sunrise && sunset && instant(reading.sunset)! > instant(reading.sunrise)! ? (
            <Daylight sunrise={sunrise} sunset={sunset} rise={instant(reading.sunrise)!} set={instant(reading.sunset)!} now={now} />
          ) : sunrise || sunset ? (
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

// The arc is half an ellipse over a hairline horizon: wide and shallow, so it
// reads as the sun's path across the sky rather than as a gauge.
const ARC = { width: 168, height: 40, cx: 84, horizon: 34, rx: 76, ry: 26 };

function sunAt(fraction: number) {
  const angle = Math.PI * fraction;
  return { x: ARC.cx - ARC.rx * Math.cos(angle), y: ARC.horizon - ARC.ry * Math.sin(angle) };
}

/**
 * Sunrise to sunset as an arc, with the sun where it is right now. Before
 * sunrise and after sunset the sun waits as a hollow dot on the horizon at
 * the end it will rise from or set behind.
 */
function Daylight({ sunrise, sunset, rise, set, now }: {
  sunrise: { text: string; iso: string };
  sunset: { text: string; iso: string };
  rise: number;
  set: number;
  now: number | null;
}) {
  const fraction = now === null ? null : Math.min(1, Math.max(0, (now - rise) / (set - rise)));
  const up = now !== null && now >= rise && now < set;
  const sun = fraction === null ? null : sunAt(fraction);
  const path = `M${ARC.cx - ARC.rx} ${ARC.horizon} A${ARC.rx} ${ARC.ry} 0 0 1 ${ARC.cx + ARC.rx} ${ARC.horizon}`;
  const status = now === null ? null
    : up ? `${span(set - now)} of daylight left`
    : now < rise ? `Sunrise in ${span(rise - now)}`
    : "The sun has set";

  return (
    <div className="flex flex-col gap-1" data-daylight={now === null ? undefined : up ? "day" : "night"}>
      <svg aria-hidden="true" width={ARC.width} height={ARC.height} viewBox={`0 0 ${ARC.width} ${ARC.height}`} className="overflow-visible">
        <line x1={0} x2={ARC.width} y1={ARC.horizon} y2={ARC.horizon} stroke="var(--ui-line-strong)" strokeWidth={1} />
        <path d={path} fill="none" stroke="var(--ui-line-strong)" strokeWidth={1} strokeDasharray="2 3" />
        {up && fraction !== null ? (
          // The part of the day already behind us, drawn solid.
          <path d={path} fill="none" stroke="var(--ui-ink-3)" strokeWidth={1} pathLength={1} strokeDasharray={`${fraction} 1`} />
        ) : null}
        {sun ? (
          <g style={{ transform: `translate(${sun.x}px, ${sun.y}px)` }} className="transition-transform duration-200 ease-snap">
            {up ? (
              <circle r={4} fill="var(--ui-ink)" stroke="var(--ui-surface)" strokeWidth={2} />
            ) : (
              <circle r={3.5} fill="var(--ui-surface)" stroke="var(--ui-ink-3)" strokeWidth={1.25} />
            )}
          </g>
        ) : null}
      </svg>
      <div className="flex justify-between font-mono text-[11px] text-ink-3 tabular-nums" style={{ width: ARC.width }}>
        <span><span aria-hidden="true">↑ </span><time dateTime={sunrise.iso}>{sunrise.text}</time><span className="sr-only"> sunrise</span></span>
        <span><span aria-hidden="true">↓ </span><time dateTime={sunset.iso}>{sunset.text}</time><span className="sr-only"> sunset</span></span>
      </div>
      {status ? <span className="text-xs text-ink-2">{status}</span> : null}
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
