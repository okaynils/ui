import * as React from "react";
import { cn } from "../lib/cn";

export type SparklineVariant = "line" | "area" | "bars";
export type SparklineTone = "neutral" | "accent" | "ok" | "warn" | "err";

export interface SparklineProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** Values in order, oldest first. Non-finite values are gaps, never zeros. */
  data: readonly number[];
  variant?: SparklineVariant;
  /** Pixel height. Defaults to 24, a text line's worth. */
  height?: number;
  /** Pixel width. Omit to fill the container. */
  width?: number;
  /**
   * Stroke colour. `neutral` is the default; a status or accent tone must
   * mean something, such as a metric that is currently failing.
   */
  tone?: SparklineTone;
  /** Mark the last value with a dot, so the eye lands on "now". */
  dot?: boolean;
  /** Fix the bottom of the scale instead of fitting the data, e.g. 0. */
  min?: number;
  /** Fix the top of the scale, e.g. 100 for a percentage. */
  max?: number;
  /** A hairline at this value: a target, a limit, last period's average. */
  baseline?: number;
  /** Names for each value (dates, versions), shown in the hover readout. */
  labels?: readonly string[];
  /** Formats values for the readout and the spoken summary. */
  format?: (value: number) => string;
  /** Replace the generated spoken summary. */
  label?: string;
  /** Show a crosshair and the value under the pointer. Defaults to true. */
  interactive?: boolean;
}

const TONE: Record<SparklineTone, string> = {
  neutral: "text-ink-2",
  accent: "text-accent",
  ok: "text-ok",
  warn: "text-warn",
  err: "text-err",
};

// Room above and below the plot so a 1.5px stroke at the extremes isn't clipped.
const PAD = 2;
// 1.5px: a 2px chart line is heavy at 24px tall, and a 1px one disappears next to text.
const STROKE = 1.5;

const finite = (value: number | undefined): value is number => typeof value === "number" && Number.isFinite(value);

/**
 * A word-sized trend: line, area or bars, drawn from supplied values. Sits
 * inside a Stat, a table cell or a sentence. Gaps in the data stay gaps.
 */
export function Sparkline({
  data,
  variant = "line",
  height = 24,
  width,
  tone = "neutral",
  dot = false,
  min,
  max,
  baseline,
  labels,
  format,
  label,
  interactive = true,
  className,
  style,
  ...props
}: SparklineProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const values = data.filter(finite);
  const n = data.length;
  const fmt = format ?? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format;

  // Scale: fit the data plus the baseline, unless fixed. Bars always include 0,
  // because a bar's length *is* its value.
  const extent = [...values, ...(finite(baseline) ? [baseline] : []), ...(variant === "bars" ? [0] : [])];
  const lo = finite(min) ? min : extent.length ? Math.min(...extent) : 0;
  const hi = finite(max) ? max : extent.length ? Math.max(...extent) : 1;
  const flat = hi === lo;
  // A flat series draws through the middle rather than pinned to an edge.
  const y = (value: number) => (flat ? height / 2 : PAD + (1 - (value - lo) / (hi - lo)) * (height - PAD * 2));
  // x in viewBox units 0..1000: the SVG stretches to any width, strokes stay crisp via non-scaling-stroke.
  const W = 1000;
  const slot = n > 0 ? W / n : W;
  const x = (index: number) => (variant === "bars" ? slot * index + slot / 2 : n > 1 ? (index / (n - 1)) * W : W / 2);

  // Each run of consecutive finite values is its own segment, so a missing day is visible.
  const segments: [number, number][][] = [];
  data.forEach((value, index) => {
    if (!finite(value)) return;
    const previous = segments.at(-1);
    const point: [number, number] = [x(index), y(value)];
    if (previous && finite(data[index - 1])) previous.push(point);
    else segments.push([point]);
  });

  let lastIndex = -1;
  data.forEach((value, index) => { if (finite(value)) lastIndex = index; });
  const summary = label ?? (values.length === 0
    ? "No data"
    : `Trend of ${values.length} ${values.length === 1 ? "value" : "values"}${values.length < n ? ` (${n - values.length} missing)` : ""}: from ${fmt(values[0]!)} to ${fmt(values.at(-1)!)}, low ${fmt(Math.min(...values))}, high ${fmt(Math.max(...values))}`);

  const pct = (vx: number) => `${(vx / W) * 100}%`;
  const zero = y(Math.min(Math.max(0, lo), hi));

  const onPointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!interactive || n === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const index = variant === "bars" ? Math.min(n - 1, Math.floor(ratio * n)) : Math.round(ratio * (n - 1));
    setHover(index);
  };

  const hovered = hover !== null && finite(data[hover]) ? hover : null;

  // A span, not a div: a sparkline is allowed inside a sentence's <p>.
  return (
    <span
      {...props}
      role="img"
      aria-label={summary}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHover(null)}
      className={cn("relative inline-block shrink-0 align-middle", width === undefined && "w-full", TONE[tone], className)}
      style={{ height, width, ...style }}
    >
      <svg aria-hidden="true" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        {finite(baseline) ? (
          <line x1={0} x2={W} y1={y(baseline)} y2={y(baseline)} stroke="var(--ui-line-strong)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ) : null}
        {values.length === 0 ? (
          <line x1={0} x2={W} y1={height / 2} y2={height / 2} stroke="var(--ui-line)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ) : variant === "bars" ? (
          data.map((value, index) => {
            if (!finite(value)) return null;
            const top = Math.min(y(value), zero);
            // A zero still gets a 1px sliver, so "nothing" is distinguishable from "missing".
            const h = Math.max(1, Math.abs(zero - y(value)));
            // A 25% gap of the slot keeps neighbouring bars from merging into a block.
            return <rect key={index} x={slot * index + slot * 0.125} width={slot * 0.75} y={top} height={h} fill="currentColor" opacity={hovered === null || hovered === index ? 1 : 0.45} />;
          })
        ) : (
          segments.map((points, index) => {
            const d = points.map(([px, py], i) => `${i ? "L" : "M"}${px},${py}`).join("");
            return (
              <g key={index}>
                {variant === "area" && points.length > 1 ? (
                  <path d={`${d}L${points.at(-1)![0]},${height}L${points[0]![0]},${height}Z`} fill="currentColor" opacity={0.1} />
                ) : null}
                <path d={d} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })
        )}
      </svg>

      {/* Dots are HTML, not SVG: the stretched viewBox would squash a circle into an ellipse. */}
      {variant !== "bars" ? (
        <>
          {segments.filter((points) => points.length === 1).map(([point]) => (
            // A lone value between gaps has no line to sit on; draw it as a point.
            <Dot key={point![0]} left={pct(point![0])} top={point![1]} />
          ))}
          {dot && lastIndex >= 0 && hovered === null ? <Dot left={pct(x(lastIndex))} top={y(data[lastIndex]!)} /> : null}
        </>
      ) : null}

      {hovered !== null ? (
        <>
          {variant !== "bars" ? (
            <>
              <span aria-hidden className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-line-strong" style={{ left: pct(x(hovered)) }} />
              <Dot left={pct(x(hovered))} top={y(data[hovered]!)} />
            </>
          ) : null}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-full z-10 mb-1.5 rounded-ui bg-raised px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-ink shadow-pop tabular-nums"
            // Keep the readout inside the chart's span at the edges instead of hanging off it.
            style={{ left: pct(x(hovered)), transform: `translateX(-${(x(hovered) / W) * 100}%)` }}
          >
            {fmt(data[hovered]!)}
            {labels?.[hovered] ? <span className="ml-1.5 text-ink-3">{labels[hovered]}</span> : null}
          </span>
        </>
      ) : null}
    </span>
  );
}

function Dot({ left, top }: { left: string; top: number }) {
  return (
    <span
      aria-hidden
      // A 2px ring in the surface colour keeps the dot legible where it sits on the line.
      className="pointer-events-none absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_0_0_2px_var(--ui-surface)]"
      style={{ left, top }}
    />
  );
}
