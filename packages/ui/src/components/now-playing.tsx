import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Status } from "./status";

export type NowPlayingState = "playing" | "paused" | "offline";
export type NowPlayingVariant = "card" | "row" | "inline";

export interface NowPlayingTrack {
  title: string;
  artist: string;
  album?: string;
  /** Album artwork URL. Missing or broken artwork falls back to a music note. */
  artwork?: string;
  /** An explicit destination for the track title, e.g. its music-service page. */
  href?: string;
  /** Track duration in seconds. Progress needs a positive, finite duration. */
  duration?: number;
}

export interface NowPlayingProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Current track, or null when nothing is playing. */
  track: NowPlayingTrack | null;
  state?: NowPlayingState;
  /** Playback position in seconds, as last reported by the player. */
  position?: number;
  /**
   * While playing, count the position forward from the last supplied value, so
   * the bar moves between updates. Set false if your app pushes every second.
   */
  advance?: boolean;
  loading?: boolean;
  /** Requests playback to toggle; update `state` once the player confirms it. Card and row only. */
  onPlaybackToggle?: () => void;
  /**
   * `card` is the standalone badge. `row` is one compact line for lists and
   * sidebars. `inline` sits inside a sentence and scales with the text.
   */
  variant?: NowPlayingVariant;
}

function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = String(whole % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
}

/**
 * Counts forward from the last reported position while playing. Measured
 * from the wall clock, so a throttled background tab catches up instead of
 * drifting, and a new report always wins.
 */
function useAdvancingPosition(position: number | undefined, running: boolean): number | undefined {
  const [base, setBase] = React.useState(position);
  const [offset, setOffset] = React.useState(0);
  if (!Object.is(base, position)) {
    setBase(position);
    setOffset(0);
  }
  // Pausing keeps the counted-forward position; resuming continues from it.
  const held = React.useRef(offset);
  React.useEffect(() => { held.current = offset; });
  React.useEffect(() => {
    if (!running || typeof position !== "number" || !Number.isFinite(position)) return;
    const start = Date.now() - held.current * 1000;
    const timer = setInterval(() => setOffset((Date.now() - start) / 1000), 1000);
    return () => clearInterval(timer);
  }, [position, running]);
  return typeof position === "number" ? position + offset : position;
}

/** A listening badge driven by the app's player or service data. */
export function NowPlaying({
  track,
  state = "playing",
  position: reported,
  advance = true,
  loading = false,
  onPlaybackToggle,
  variant = "card",
  className,
  ...props
}: NowPlayingProps) {
  const label = state === "offline" ? "Offline" : !track ? "Nothing playing" : state === "paused" ? "Paused" : "Playing";
  const duration = track?.duration;
  const playing = !loading && Boolean(track) && state === "playing";
  const position = useAdvancingPosition(reported, advance && playing);
  const hasProgress = !loading && track && state !== "offline" && typeof duration === "number" && Number.isFinite(duration) && duration > 0 && typeof position === "number" && Number.isFinite(position);
  const elapsed = hasProgress ? Math.min(duration, Math.max(0, position)) : 0;
  const dataState = loading ? "loading" : !track && state !== "offline" ? "idle" : state;
  const toggle = onPlaybackToggle && track && state !== "offline" ? (
    <Button icon size="sm" variant="ghost" aria-label={state === "playing" ? "Pause playback" : "Resume playback"} onClick={onPlaybackToggle}>
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {state === "playing" ? <path d="M4 3h3v10H4zm5 0h3v10H9z" /> : <path d="m5 3 8 5-8 5z" />}
      </svg>
    </Button>
  ) : null;

  if (variant === "inline") {
    return (
      <span
        // Same attributes, rendered as a span so it can sit inside a <p>.
        {...(props as React.ComponentProps<"span">)}
        aria-busy={loading || undefined}
        data-state={dataState}
        data-variant="inline"
        className={cn("inline-flex max-w-full items-baseline gap-[0.35em] align-baseline", className)}
      >
        {loading ? (
          <Skeleton delay={0} className="inline-block h-[1em] w-24 translate-y-[0.15em]" />
        ) : track && state !== "offline" ? (
          <>
            {/* Sit the art on the text's baseline area instead of the line box, so it reads as part of the line. */}
            <Artwork key={track.artwork} src={track.artwork} className="size-[1.3em] translate-y-[0.25em] self-baseline rounded-[3px]" />
            <span className="inline-flex h-[0.8em] items-end self-baseline"><Equaliser playing={playing} size="inline" /></span>
            <span className="min-w-0 truncate">
              {track.href ? (
                <a href={track.href} className="rounded-ui font-medium text-accent underline decoration-accent/30 underline-offset-[3px] outline-none hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{track.title}</a>
              ) : <span className="font-medium text-ink">{track.title}</span>}
              <span className="text-ink-2"> by {track.artist}</span>
              {state === "paused" ? <span className="text-ink-3"> (paused)</span> : null}
            </span>
          </>
        ) : <span className="text-ink-3">{state === "offline" ? "nothing I can see right now" : "nothing at the moment"}</span>}
      </span>
    );
  }

  if (variant === "row") {
    return (
      <div
        role="group"
        aria-label="Listening activity"
        {...props}
        aria-busy={loading || undefined}
        data-state={dataState}
        data-variant="row"
        className={cn("relative flex h-8 w-full min-w-0 items-center gap-2 text-ui", className)}
      >
        {loading ? (
          <>
            <Skeleton delay={0} className="size-6 shrink-0 rounded-[3px]" />
            <Skeleton delay={0} className="h-3 w-40" />
          </>
        ) : (
          <>
            <Artwork key={track?.artwork} src={track?.artwork} className="size-6 rounded-[3px]" />
            <div className="min-w-0 flex-1 truncate">
              {track ? (
                <>
                  {track.href ? (
                    <a href={track.href} className="rounded-ui font-medium text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{track.title}</a>
                  ) : <span className="font-medium text-ink">{track.title}</span>}
                  <span className="text-ink-2"> · {track.artist}</span>
                </>
              ) : <span className="text-ink-2">{state === "offline" ? "Listening activity is unavailable." : "Nothing playing"}</span>}
            </div>
            {track && state !== "offline" ? (
              <span className="flex shrink-0 items-center gap-1.5">
                <Equaliser playing={playing} />
                <span className="sr-only">{label}</span>
                {hasProgress ? (
                  <span className="font-mono text-[11px] text-ink-3 tabular-nums" aria-label={`${formatTime(elapsed)} of ${formatTime(duration)}`}>
                    {formatTime(elapsed)}
                  </span>
                ) : <span className="text-xs text-ink-2" aria-hidden="true">{label}</span>}
              </span>
            ) : track ? <Status tone="neutral" className="shrink-0 text-xs">{label}</Status> : null}
            {toggle}
            {/* The row's progress is a hairline along its bottom edge: present, never louder than the track name. */}
            {hasProgress ? (
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line">
                <span className="block h-full bg-ink-3 transition-[width] duration-200 ease-snap" style={{ width: `${(elapsed / duration) * 100}%` }} />
              </span>
            ) : null}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Listening activity"
      {...props}
      aria-busy={loading || undefined}
      data-state={dataState}
      className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface p-3", className)}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="ui-label">Listening</span>
        {loading ? <span className="text-xs text-ink-2">Loading</span> : track && state !== "offline" ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-ink"><Equaliser playing={playing} />{label}</span>
        ) : <Status tone="neutral" className="text-xs">{label}</Status>}
      </div>
      {loading ? (
        <div className="flex items-center gap-3" aria-label="Loading listening activity">
          <Skeleton delay={0} className="size-12 shrink-0 rounded-ui" />
          <div className="flex min-w-0 flex-1 flex-col gap-2"><Skeleton delay={0} className="h-3 w-3/4" /><Skeleton delay={0} className="h-3 w-1/2" /></div>
        </div>
      ) : track ? (
        <div className="flex items-center gap-3">
          <Artwork key={track.artwork} src={track.artwork} />
          <div className="min-w-0 flex-1">
            {track.href ? (
              <a href={track.href} className="block truncate rounded-ui text-ui font-medium text-accent outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{track.title}</a>
            ) : <div className="truncate text-ui font-medium text-ink">{track.title}</div>}
            <div className="truncate text-xs text-ink-2">{track.artist}</div>
            {track.album ? <div className="mt-0.5 truncate text-xs text-ink-3">{track.album}</div> : null}
          </div>
          {toggle}
        </div>
      ) : <p className="text-ui text-ink-2">{state === "offline" ? "Listening activity is unavailable." : "A little quiet right now."}</p>}
      {hasProgress ? (
        <div className="mt-3">
          <Progress value={elapsed} max={duration} aria-label="Track progress" aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`} />
          <div aria-hidden="true" className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-3 tabular-nums"><span>{formatTime(elapsed)}</span><span>{formatTime(duration)}</span></div>
        </div>
      ) : null}
    </div>
  );
}

// Resting heights double as the paused pose and the reduced-motion pose.
const BARS = [
  { duration: "520ms", delay: "-120ms", rest: 0.45 },
  { duration: "740ms", delay: "-360ms", rest: 0.85 },
  { duration: "610ms", delay: "-200ms", rest: 0.6 },
];

/**
 * Three bars that bounce while playing and settle when paused: the badge's
 * one moving part. `inline` sizes them in em so they follow the sentence.
 */
function Equaliser({ playing, size = "fixed" }: { playing: boolean; size?: "fixed" | "inline" }) {
  return (
    <span aria-hidden="true" className={cn("inline-flex items-end", size === "inline" ? "h-[0.8em] gap-[0.12em] [&>span]:w-[0.18em]" : "h-3 gap-[2px]")}>
      {BARS.map((bar, i) => (
        <span
          key={i}
          className={cn(
            "h-full w-[3px] origin-bottom rounded-[1px] transition-colors duration-120",
            playing ? "animate-[ui-eq_var(--eq-duration)_ease-in-out_var(--eq-delay)_infinite_alternate] bg-ok motion-reduce:animate-none" : "bg-ink-3",
          )}
          style={{ transform: `scaleY(${playing ? bar.rest : bar.rest * 0.5})`, "--eq-duration": bar.duration, "--eq-delay": bar.delay } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

function Artwork({ src, className }: { src?: string; className?: string }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <span aria-hidden="true" className={cn("inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-ui bg-panel text-ink-3 shadow-[inset_0_0_0_1px_var(--ui-line)]", className)}>
      {src && !failed ? <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} /> : (
        <svg viewBox="0 0 24 24" className="size-[45%]" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 17V6l11-2v11M9 9l11-2" /><ellipse cx="6" cy="17" rx="3" ry="2.5" /><ellipse cx="17" cy="15" rx="3" ry="2.5" /></svg>
      )}
    </span>
  );
}
