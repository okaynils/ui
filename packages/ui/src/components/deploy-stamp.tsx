import * as React from "react";
import { cn } from "../lib/cn";
import { Link } from "./link";
import { StatusDot } from "./status";

export type DeployState = "live" | "deploying" | "failed";

export interface DeployStampProps extends Omit<React.ComponentProps<"p">, "children"> {
  /** When the deploy finished, or for `deploying`, when it started. ISO string, Date or Unix ms. */
  deployedAt: Date | string | number;
  /** Commit SHA. Shown shortened to 7 characters. */
  commit?: string;
  /** Link for the commit, e.g. its page on your forge. */
  commitHref?: string;
  /** Branch the deploy came from. */
  branch?: string;
  /** Where it went, e.g. "production". */
  environment?: string;
  /** Who or what deployed it, e.g. "nils" or "ci". */
  actor?: string;
  state?: DeployState;
  /** Locale for the relative and absolute times. */
  locale?: string;
  /** Zone for the absolute time shown before mount and in the tooltip. Fixed, so server and browser agree. */
  timeZone?: string;
}

const TONE = { live: "ok", deploying: "accent", failed: "err" } as const;

function instant(value: Date | string | number): number {
  return (value instanceof Date ? value : new Date(value)).getTime();
}

/** "just now", "14 min ago", "3 hr ago", "2 days ago". */
function ago(ms: number, locale: string): string {
  const minutes = Math.floor(Math.max(0, ms) / 60_000);
  if (minutes < 1) return "just now";
  let format: Intl.RelativeTimeFormat;
  try { format = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "short" }); }
  catch { format = new Intl.RelativeTimeFormat("en-GB", { numeric: "always", style: "short" }); }
  if (minutes < 60) return format.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return format.format(-hours, "hour");
  return format.format(-Math.floor(hours / 24), "day");
}

function absolute(time: number, locale: string, timeZone: string): string {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone, timeZoneName: "short" };
  try { return new Intl.DateTimeFormat(locale, options).format(time); }
  catch { return new Date(time).toISOString(); }
}

/**
 * Re-renders on every whole minute since `time`, so "14 min ago" turns into
 * "15 min ago" exactly when it should. Null until mounted: the server can't
 * know how long ago anything was by the time the page is read.
 */
function useNow(time: number): number | null {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!Number.isFinite(time)) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      const elapsed = Math.max(0, current - time);
      timer = setTimeout(tick, 60_000 - (elapsed % 60_000) + 50);
    };
    tick();
    // Background tabs throttle timers; catch up as soon as the tab is seen.
    const wake = () => { if (document.visibilityState === "visible") { clearTimeout(timer); tick(); } };
    document.addEventListener("visibilitychange", wake);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [time]);
  return now;
}

/**
 * One line that says what's running and how old it is: "Deployed 14 min ago
 * from a1b2c3d on main". The age keeps counting on its own; a deploy in
 * progress pulses until your app says it's done.
 */
export function DeployStamp({
  deployedAt,
  commit,
  commitHref,
  branch,
  environment,
  actor,
  state = "live",
  locale = "en-GB",
  timeZone = "UTC",
  className,
  ...props
}: DeployStampProps) {
  const time = instant(deployedAt);
  const now = useNow(time);
  const valid = Number.isFinite(time);
  const full = valid ? absolute(time, locale, timeZone) : null;
  const when = !valid ? null : (
    <time dateTime={new Date(time).toISOString()} title={full ?? undefined} className="tabular-nums">
      {now === null ? `on ${full}` : ago(now - time, locale)}
    </time>
  );

  const sha = commit ? (
    commitHref ? (
      <Link variant="quiet" href={commitHref} className="font-mono">{commit.slice(0, 7)}</Link>
    ) : <code className="font-mono text-ink">{commit.slice(0, 7)}</code>
  ) : null;
  const place = (
    <>
      {branch ? <> on <span className="font-mono text-ink">{branch}</span></> : null}
      {environment ? <> to <span className="text-ink">{environment}</span></> : null}
      {actor ? <> by <span className="text-ink">{actor}</span></> : null}
    </>
  );

  return (
    <p
      {...props}
      data-state={state}
      className={cn("m-0 inline-flex max-w-full flex-wrap items-center gap-x-1 text-xs text-ink-2", className)}
    >
      <span className="mr-1 inline-flex size-3 items-center justify-center">
        <StatusDot tone={TONE[state]} pulse={state === "deploying"} />
      </span>
      {state === "deploying" ? (
        <span>
          <span className="text-ink">Deploying…</span>
          {sha ? <> {sha}</> : null}
          {place}
          {when ? <>, started {when}</> : null}
        </span>
      ) : state === "failed" ? (
        <span>
          <span className="text-ink">Deploy failed</span>
          {sha ? <> for {sha}</> : null}
          {place}
          {when ? <> {when}</> : null}
        </span>
      ) : (
        <span>
          Deployed {when ?? "at an unknown time"}
          {sha ? <> from {sha}</> : null}
          {place}
        </span>
      )}
    </p>
  );
}
