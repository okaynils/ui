import * as React from "react";
import { cn } from "../lib/cn";

export interface Film {
  /** Stable identity, e.g. a diary entry's guid. New ids at the front advance the strip. */
  id: string;
  title: string;
  year?: number;
  /** Poster URL, 2:3. Missing or broken posters show the title on a blank frame. */
  poster?: string;
  /** The film's or diary entry's page, e.g. on Letterboxd. */
  href?: string;
  /** 0.5–5 in half steps, Letterboxd style. Omit for unrated. */
  rating?: number;
  liked?: boolean;
  rewatch?: boolean;
  /** When it was watched. `YYYY-MM-DD` strings are read as calendar dates. */
  watchedAt?: Date | string | number;
}

export type FilmStripVariant = "strip" | "diary";

export interface FilmStripProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Newest first, as a diary feed lists them. */
  films: readonly Film[];
  /** `strip` frames posters on a piece of film; `diary` lists one film per row. */
  variant?: FilmStripVariant;
  /** Label above the films. Defaults to "Recently watched". */
  label?: React.ReactNode;
  /** A profile page, linked next to the label. */
  href?: string;
  /** Text of the profile link. Defaults to "Profile". */
  linkLabel?: React.ReactNode;
  /** Films to show. Defaults to 5 for `strip` and 8 for `diary`. */
  max?: number;
  /** Date formatting locale. */
  locale?: string;
  /** Zone for dates that carry a time. Date-only strings are always calendar dates. */
  timeZone?: string;
}

/** Letterboxd's notation: whole stars plus a half, e.g. ★★★★½. */
function stars(rating: number): string {
  const clamped = Math.min(5, Math.max(0, Math.round(rating * 2) / 2));
  return "★".repeat(Math.floor(clamped)) + (clamped % 1 ? "½" : "");
}

function watchedDate(value: Film["watchedAt"], locale: string, timeZone: string) {
  if (value === undefined) return null;
  const dateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00Z`) : new Date(value instanceof Date ? value.getTime() : value);
  if (!Number.isFinite(date.getTime())) return null;
  const zone = dateOnly ? "UTC" : timeZone;
  let short: string;
  let long: string;
  try {
    short = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: zone }).format(date);
    long = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: zone }).format(date);
  } catch {
    short = long = date.toISOString().slice(0, 10);
  }
  return { short, long, iso: dateOnly ? (value as string) : date.toISOString() };
}

function describe(film: Film, date: ReturnType<typeof watchedDate>): string {
  return [
    film.year ? `${film.title} (${film.year})` : film.title,
    typeof film.rating === "number" && Number.isFinite(film.rating) ? `rated ${Math.round(film.rating * 2) / 2} out of 5` : null,
    film.liked ? "liked" : null,
    film.rewatch ? "rewatched" : null,
    date ? `watched ${date.long}` : null,
  ].filter(Boolean).join(", ");
}

/** Ids that weren't in the previous render, after the first one. */
function useArrivals(ids: readonly string[]): string[] {
  const seen = React.useRef<Set<string> | null>(null);
  const [arrived, setArrived] = React.useState<string[]>([]);
  React.useLayoutEffect(() => {
    if (seen.current === null) {
      seen.current = new Set(ids);
      return;
    }
    const fresh = ids.filter((id) => !seen.current!.has(id));
    ids.forEach((id) => seen.current!.add(id));
    if (fresh.length) setArrived(fresh);
  }, [ids.join("\n")]);
  return arrived;
}

const GAP = 6;

/**
 * Recently watched films. As a strip, the posters sit in the frames of a
 * piece of film, and a newly logged film advances it one frame. As a diary,
 * one row per film with date, rating, like and rewatch.
 */
export function FilmStrip({
  films,
  variant = "strip",
  label = "Recently watched",
  href,
  linkLabel = "Profile",
  max,
  locale = "en-GB",
  timeZone = "UTC",
  className,
  ...props
}: FilmStripProps) {
  const shown = films.slice(0, Math.max(1, max ?? (variant === "strip" ? 5 : 8)));
  const arrivals = useArrivals(shown.map((film) => film.id));
  const [active, setActive] = React.useState<string | null>(null);
  const reel = React.useRef<HTMLDivElement>(null);

  // Advance the film by however many frames arrived at the front. The whole
  // reel moves, sprocket holes included, so it reads as film being pulled
  // through a gate rather than posters rearranging.
  React.useLayoutEffect(() => {
    if (variant !== "strip" || !arrivals.length) return;
    const element = reel.current;
    const frame = element?.querySelector<HTMLElement>("[data-frame]");
    if (!element || !frame || typeof element.animate !== "function") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const frontArrivals = shown.findIndex((film) => !arrivals.includes(film.id));
    const count = frontArrivals === -1 ? shown.length : frontArrivals;
    if (count < 1) return;
    element.animate(
      [{ transform: `translateX(${-(frame.offsetWidth + GAP) * count}px)` }, { transform: "translateX(0)" }],
      { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
    );
  }, [arrivals, variant]);

  const header = label || href ? (
    <div className="flex items-baseline justify-between gap-3">
      {label ? <span className="ui-label">{label}</span> : <span />}
      {href ? (
        <a href={href} className="rounded-ui text-xs text-ink-2 underline decoration-line-strong underline-offset-[3px] outline-none hover:decoration-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          {linkLabel}
        </a>
      ) : null}
    </div>
  ) : null;

  if (!shown.length || films.length === 0) {
    return (
      <div {...props} className={cn("w-full max-w-md space-y-2", className)}>
        {header}
        <p className="text-ui text-ink-2">Nothing watched yet.</p>
      </div>
    );
  }

  if (variant === "diary") {
    return (
      <div {...props} data-variant="diary" className={cn("w-full max-w-md space-y-2", className)}>
        {header}
        <ol className="divide-y divide-line">
          {shown.map((film) => {
            const date = watchedDate(film.watchedAt, locale, timeZone);
            const rated = typeof film.rating === "number" && Number.isFinite(film.rating) && film.rating > 0;
            const title = (
              <>
                <span className="font-medium text-ink">{film.title}</span>
                {film.year ? <span className="font-mono text-xs text-ink-3"> {film.year}</span> : null}
              </>
            );
            return (
              <li key={film.id} className={cn("flex h-12 items-center gap-3", arrivals.includes(film.id) && "ui-flash")}>
                <span className="w-12 shrink-0 font-mono text-[11px] text-ink-3 tabular-nums">
                  {date ? <time dateTime={date.iso} title={date.long}>{date.short}</time> : "—"}
                </span>
                <Poster film={film} className="h-9 w-6 rounded-[2px]" />
                <span className="min-w-0 flex-1 truncate text-ui">
                  {film.href ? (
                    <a href={film.href} className="rounded-ui outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{title}</a>
                  ) : title}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-ink-2">
                  {rated ? (
                    <span className="text-xs tracking-[0.04em]" aria-label={`Rated ${Math.round(film.rating! * 2) / 2} out of 5`}>{stars(film.rating!)}</span>
                  ) : null}
                  {film.liked ? <HeartIcon label="Liked" /> : null}
                  {film.rewatch ? <RewatchIcon label="Rewatched" /> : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const focused = shown.find((film) => film.id === active) ?? shown[0]!;
  const focusedDate = watchedDate(focused.watchedAt, locale, timeZone);

  return (
    <div {...props} data-variant="strip" className={cn("w-full max-w-md space-y-2", className)}>
      {header}
      <div
        className="overflow-hidden rounded-ui bg-active shadow-[inset_0_0_0_1px_var(--ui-line-strong)]"
        onPointerLeave={() => setActive(null)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null); }}
      >
        <div ref={reel}>
          <Sprockets />
          <ul className="grid grid-flow-col auto-cols-fr px-1.5" style={{ gap: GAP }}>
            {shown.map((film) => {
              const date = watchedDate(film.watchedAt, locale, timeZone);
              const frame = <Poster film={film} className="aspect-[2/3] w-full rounded-[2px]" showTitle />;
              const common = {
                "aria-label": describe(film, date),
                onPointerEnter: () => setActive(film.id),
                onFocus: () => setActive(film.id),
                className: cn(
                  "block rounded-[2px] outline-none transition-opacity duration-120",
                  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
                  active && active !== film.id && "opacity-60",
                ),
              };
              return (
                <li key={film.id} data-frame className="min-w-0">
                  {film.href ? <a href={film.href} {...common}>{frame}</a> : <button type="button" {...common} className={cn(common.className, "w-full cursor-default")}>{frame}</button>}
                </li>
              );
            })}
          </ul>
          <Sprockets />
        </div>
      </div>
      {/* The readout names the frame under the pointer or focus, and the latest film otherwise. */}
      <div className="flex min-h-5 flex-wrap items-baseline gap-x-2 text-xs text-ink-2" aria-hidden="true">
        <span className="font-medium text-ink">{focused.title}</span>
        {focused.year ? <span className="font-mono text-ink-3">{focused.year}</span> : null}
        {typeof focused.rating === "number" && focused.rating > 0 ? <span className="tracking-[0.04em]">{stars(focused.rating)}</span> : null}
        {focused.liked ? <HeartIcon /> : null}
        {focused.rewatch ? <RewatchIcon /> : null}
        {focusedDate ? <span className="text-ink-3">{focusedDate.short}</span> : null}
      </div>
    </div>
  );
}

/** A row of sprocket holes: page-coloured gaps punched through the film base. */
function Sprockets() {
  return (
    <div
      aria-hidden="true"
      className="mx-1.5 my-1 h-1.5"
      style={{
        backgroundImage: "repeating-linear-gradient(90deg, var(--ui-surface) 0 5px, transparent 5px 11px)",
        backgroundPosition: "3px 0",
        borderRadius: 1,
      }}
    />
  );
}

function Poster({ film, className, showTitle = false }: { film: Film; className?: string; showTitle?: boolean }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <span aria-hidden="true" className={cn("relative flex shrink-0 items-end overflow-hidden bg-panel shadow-[inset_0_0_0_1px_var(--ui-line)]", className)}>
      {film.poster && !failed ? (
        <img key={film.poster} src={film.poster} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" onError={() => setFailed(true)} />
      ) : showTitle ? (
        <span className="line-clamp-3 p-1.5 text-left text-[10px] leading-tight text-ink-2">{film.title}</span>
      ) : null}
    </span>
  );
}

function HeartIcon({ label }: { label?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3 shrink-0" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path d="M8 14s-5.5-3.2-5.5-7.2A3 3 0 0 1 8 4.6a3 3 0 0 1 5.5 2.2C13.5 10.8 8 14 8 14Z" />
    </svg>
  );
}

function RewatchIcon({ label }: { label?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-3 shrink-0" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" />
    </svg>
  );
}
