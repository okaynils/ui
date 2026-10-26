import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Status } from "./status";

export type NowPlayingState = "playing" | "paused" | "offline";

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
  /** Supplied playback position in seconds. This widget never invents playback progress. */
  position?: number;
  loading?: boolean;
  /** Requests playback to toggle; update `state` once the player confirms it. */
  onPlaybackToggle?: () => void;
}

function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = String(whole % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
}

/** A listening badge driven by the app's player or service data. */
export function NowPlaying({
  track,
  state = "playing",
  position,
  loading = false,
  onPlaybackToggle,
  className,
  ...props
}: NowPlayingProps) {
  const label = state === "offline" ? "Offline" : !track ? "Nothing playing" : state === "paused" ? "Paused" : "Playing";
  const duration = track?.duration;
  const hasProgress = !loading && track && state !== "offline" && typeof duration === "number" && Number.isFinite(duration) && duration > 0 && typeof position === "number" && Number.isFinite(position);
  const elapsed = hasProgress ? Math.min(duration, Math.max(0, position)) : 0;
  return (
    <div
      role="group"
      aria-label="Listening activity"
      {...props}
      aria-busy={loading || undefined}
      data-state={loading ? "loading" : !track && state !== "offline" ? "idle" : state}
      className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface p-3", className)}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="ui-label">Listening</span>
        {loading ? <span className="text-xs text-ink-2">Loading</span> : <Status tone={track && state === "playing" ? "ok" : "neutral"} className="text-xs">{label}</Status>}
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
          {onPlaybackToggle && state !== "offline" ? (
            <Button icon size="sm" variant="ghost" aria-label={state === "playing" ? "Pause playback" : "Resume playback"} onClick={onPlaybackToggle}>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                {state === "playing" ? <path d="M4 3h3v10H4zm5 0h3v10H9z" /> : <path d="m5 3 8 5-8 5z" />}
              </svg>
            </Button>
          ) : null}
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

function Artwork({ src }: { src?: string }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <div aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-ui bg-panel text-ink-3 shadow-[inset_0_0_0_1px_var(--ui-line)]">
      {src && !failed ? <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} /> : (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 17V6l11-2v11M9 9l11-2" /><ellipse cx="6" cy="17" rx="3" ry="2.5" /><ellipse cx="17" cy="15" rx="3" ry="2.5" /></svg>
      )}
    </div>
  );
}
