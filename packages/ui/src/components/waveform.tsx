import { Slider as BaseSlider } from "@base-ui/react/slider";
import * as React from "react";
import { cn } from "../lib/cn";

export interface WaveformProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Normalised peak amplitudes, from 0 to 1. Invalid values become silence. */
  samples: readonly number[];
  /** Total audio duration in seconds. Non-positive or non-finite values disable seeking. */
  duration: number;
  /** Supplied playback position in seconds. This component does not advance time itself. */
  currentTime?: number;
  /** Track name, also used to name the seek control. */
  label?: string;
  /** Request a seek. The app updates currentTime from its actual player. */
  onSeek?: (seconds: number) => void;
  /** Called after a pointer or keyboard seek completes. Useful for expensive player updates. */
  onSeekCommitted?: (seconds: number) => void;
  disabled?: boolean;
  showTime?: boolean;
}

function formatTime(value: number): string {
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
}

function bars(samples: readonly number[]): string {
  // Keep peaks when reducing a long recording: averaging would hide brief sounds.
  const count = Math.min(180, samples.length);
  const slot = 1000 / count;
  const path: string[] = [];
  for (let i = 0; i < count; i++) {
    let peak = 0;
    const end = Math.floor((i + 1) * samples.length / count);
    for (let j = Math.floor(i * samples.length / count); j < end; j++) {
      const sample = samples[j]!;
      if (Number.isFinite(sample)) peak = Math.max(peak, Math.min(1, Math.max(0, sample)));
    }
    const height = Math.max(2, peak * 40);
    const x = i * slot + slot * 0.175;
    const y = (48 - height) / 2;
    const width = slot * 0.65;
    path.push(`M${x},${y}h${width}v${height}h-${width}Z`);
  }
  return path.join("");
}

/** A supplied audio waveform with optional player-controlled seeking. */
export function Waveform({
  samples, duration, currentTime = 0, label = "Audio", onSeek, onSeekCommitted,
  disabled = false, showTime = true, className, ...props
}: WaveformProps) {
  const available = Number.isFinite(duration) && duration > 0;
  const total = available ? duration : 0;
  const position = Number.isFinite(currentTime) ? Math.max(0, Math.min(total, currentTime)) : 0;
  const percentage = total > 0 ? position / total * 100 : 0;
  const path = React.useMemo(() => bars(samples), [samples]);
  const clamp = (value: number) => Math.max(0, Math.min(total, value));
  const drawing = (
    <>
      <svg aria-hidden="true" viewBox="0 0 1000 48" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full fill-current text-ink-3/45">
        {path ? <path d={path} /> : <path d="M0 23h1000v2H0Z" />}
      </svg>
      {path ? (
        <svg aria-hidden="true" viewBox="0 0 1000 48" preserveAspectRatio="none" style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }} className="pointer-events-none absolute inset-0 h-full w-full fill-current text-accent">
          <path d={path} />
        </svg>
      ) : null}
    </>
  );

  return (
    <div {...props} role={props.role ?? "group"} aria-label={props["aria-label"] ?? label} className={cn("w-full min-w-0 space-y-2", disabled && "opacity-45", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-ui font-medium text-ink">{label}</span>
        {showTime ? <span className="font-mono text-xs text-ink-2 tabular-nums">{formatTime(position)} / {available ? formatTime(total) : "—"}</span> : null}
      </div>
      {onSeek ? (
        <BaseSlider.Root<number>
          min={0}
          max={total || 1}
          step={Math.min(1, total || 1)}
          largeStep={10}
          value={position}
          disabled={disabled || !available}
          onValueChange={(value) => onSeek(clamp(value))}
          onValueCommitted={(value) => onSeekCommitted?.(clamp(value))}
          className="group/waveform w-full"
        >
          <BaseSlider.Control className="relative flex h-12 w-full touch-none items-center rounded-ui outline-none select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent data-disabled:cursor-not-allowed">
            <BaseSlider.Track className="relative h-12 w-full">
              {drawing}
              <BaseSlider.Thumb
                aria-label={`Seek ${label}`}
                getAriaValueText={(_, value) => `${formatTime(value)} of ${formatTime(total)}`}
                className="h-12 w-0.5 bg-accent outline-none"
              />
            </BaseSlider.Track>
          </BaseSlider.Control>
        </BaseSlider.Root>
      ) : <div aria-hidden="true" className="relative h-12 w-full">{drawing}</div>}
      {!available || samples.length === 0 ? <p className="text-xs text-ink-3">{!available ? "Duration unavailable" : "Waveform unavailable"}</p> : null}
    </div>
  );
}
