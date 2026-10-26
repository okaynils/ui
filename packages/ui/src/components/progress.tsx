import { Meter as BaseMeter } from "@base-ui/react/meter";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import * as React from "react";
import { cn } from "../lib/cn";

export type BarTone = "accent" | "neutral" | "ok" | "warn" | "err";

const FILL: Record<BarTone, string> = {
  accent: "bg-accent",
  neutral: "bg-ink-2",
  ok: "bg-ok",
  warn: "bg-warn",
  err: "bg-err",
};

interface BarOptions {
  /** Text above the bar, left. */
  label?: React.ReactNode;
  /** Show the formatted value above the bar, right, in mono. Default: on when there's a label. */
  showValue?: boolean;
  /**
   * Draw the bar as N discrete blocks (e.g. 20) instead of a continuous fill —
   * the console look. Use for coarse quantities you read at a glance.
   */
  segments?: number;
  /** Layout classes only. */
  className?: string;
}

function Header({ label, value, Label, Value }: { label?: React.ReactNode; value: boolean; Label: React.ElementType; Value: React.ElementType }) {
  if (label === undefined && !value) return null;
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
      {label !== undefined ? <Label className="truncate text-ink-2">{label}</Label> : <span />}
      {value ? <Value className="shrink-0 font-mono text-ink tabular-nums" /> : null}
    </div>
  );
}

function Segments({ count, ratio, tone }: { count: number; ratio: number; tone: BarTone }) {
  const filled = Math.round(Math.min(1, Math.max(0, ratio)) * count);
  return (
    <div className="flex h-2 gap-0.5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn("flex-1 rounded-[1px] transition-colors duration-120", i < filled ? FILL[tone] : "bg-active")}
        />
      ))}
    </div>
  );
}

const track = "relative h-1 w-full overflow-hidden rounded-[1px] bg-active";

export interface ProgressProps extends Omit<BaseProgress.Root.Props, "className" | "children">, BarOptions {
  /** 0–100 by default (see `min`/`max`). `null` means "working, unknown how long". */
  value: number | null;
}

/**
 * How far a task has got. Accent fill, 4px track. With `value={null}` it's
 * indeterminate: a short segment slides across, on a linear curve like a
 * spinner, because it's a loop, not a response.
 */
export function Progress({ label, showValue, segments, className, value, min = 0, max = 100, ...props }: ProgressProps) {
  const ratio = value === null ? 0 : (value - min) / (max - min || 1);
  return (
    <BaseProgress.Root {...props} value={value} min={min} max={max} className={cn("w-full", className)}>
      <Header
        label={label}
        value={(showValue ?? label !== undefined) && value !== null}
        Label={BaseProgress.Label}
        Value={BaseProgress.Value}
      />
      {segments && value !== null ? (
        <Segments count={segments} ratio={ratio} tone="accent" />
      ) : (
        <BaseProgress.Track className={track}>
          {value === null ? (
            <Indeterminate />
          ) : (
            <BaseProgress.Indicator className="h-full bg-accent transition-[width] duration-200 ease-snap" />
          )}
        </BaseProgress.Track>
      )}
    </BaseProgress.Root>
  );
}

function Indeterminate() {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const animation = el.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(250%)" }], {
      duration: 1100,
      iterations: Infinity,
      easing: "linear",
    });
    return () => animation.cancel();
  }, []);
  return <span ref={ref} className="absolute inset-y-0 left-0 w-2/5 bg-accent" />;
}

export interface MeterProps extends Omit<BaseMeter.Root.Props, "className" | "children">, BarOptions {
  /** 0–100 by default (see `min`/`max`). */
  value: number;
  /**
   * Turn the fill amber at `warn` and red at `err` (in value units). Below
   * `warn` it stays neutral — colour only appears when it means something.
   */
  thresholds?: { warn?: number; err?: number };
  /** Force a tone instead of using thresholds. */
  tone?: BarTone;
}

/**
 * A level within a known range: disk used, quota, memory. Neutral by
 * default; `thresholds` make it warn when it matters. For a task moving
 * towards done, use `Progress`.
 */
export function Meter({ label, showValue, segments, thresholds, tone, className, value, min = 0, max = 100, ...props }: MeterProps) {
  const resolved: BarTone =
    tone ??
    (thresholds?.err !== undefined && value >= thresholds.err
      ? "err"
      : thresholds?.warn !== undefined && value >= thresholds.warn
        ? "warn"
        : "neutral");
  const ratio = (value - min) / (max - min || 1);
  return (
    <BaseMeter.Root {...props} value={value} min={min} max={max} className={cn("w-full", className)} data-tone={resolved}>
      <Header label={label} value={showValue ?? label !== undefined} Label={BaseMeter.Label} Value={BaseMeter.Value} />
      {segments ? (
        <Segments count={segments} ratio={ratio} tone={resolved} />
      ) : (
        <BaseMeter.Track className={track}>
          <BaseMeter.Indicator className={cn("h-full transition-[width,background-color] duration-200 ease-snap", FILL[resolved])} />
        </BaseMeter.Track>
      )}
    </BaseMeter.Root>
  );
}
