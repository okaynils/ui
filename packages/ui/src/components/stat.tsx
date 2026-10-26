import type * as React from "react";
import { cn } from "../lib/cn";
import { NumberRoll } from "./number-roll";

export interface StatProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** What the number is, in the mono label voice: "GPU hours". */
  label: React.ReactNode;
  /** A number rolls when it changes; a string renders as-is; `null` shows a quiet "—". */
  value: number | string | null;
  /** `Intl.NumberFormat` options for a numeric `value`. */
  format?: Intl.NumberFormatOptions;
  /**
   * Change against a reference period, as a fraction: `0.12` is +12%.
   * Rendered as an arrow and a number, coloured by whether it's good news.
   */
  delta?: number;
  /** `Intl.NumberFormat` options for `delta`. Defaults to a percentage with up to one decimal. */
  deltaFormat?: Intl.NumberFormatOptions;
  /**
   * Which direction is good news. `"up"` (default) colours a rise green; `"down"` is for costs,
   * latency and errors; `"none"` keeps the delta in ink.
   */
  better?: "up" | "down" | "none";
  /** Small text under the value, e.g. "vs. last week". */
  caption?: React.ReactNode;
  /** `md` (default) for dashboards, `sm` for dense side panels. */
  size?: "sm" | "md";
}

const DEFAULT_DELTA: Intl.NumberFormatOptions = { style: "percent", maximumFractionDigits: 1 };

/**
 * One metric: label, value, and optionally how it moved. The value rolls when
 * it updates, so a live dashboard shows *what* changed without a flash.
 */
export function Stat({
  label,
  value,
  format,
  delta,
  deltaFormat = DEFAULT_DELTA,
  better = "up",
  caption,
  size = "md",
  className,
  ...props
}: StatProps) {
  return (
    <div {...props} className={cn("flex min-w-0 flex-col gap-1", className)}>
      <div className="ui-label truncate">{label}</div>
      <div className="flex min-w-0 items-baseline gap-2.5">
        <div
          className={cn(
            "truncate font-medium tracking-[-0.02em] text-ink tabular-nums",
            size === "md" ? "text-[24px] leading-8" : "text-[17px] leading-6",
          )}
        >
          {value === null ? (
            <span className="text-ink-3">—</span>
          ) : typeof value === "number" ? (
            <NumberRoll value={value} format={format} />
          ) : (
            value
          )}
        </div>
        {delta !== undefined && Number.isFinite(delta) ? <Delta value={delta} format={deltaFormat} better={better} /> : null}
      </div>
      {caption !== undefined ? <div className="truncate text-xs text-ink-3">{caption}</div> : null}
    </div>
  );
}

function Delta({ value, format, better }: { value: number; format: Intl.NumberFormatOptions; better: "up" | "down" | "none" }) {
  const sign = value > 0 ? 1 : value < 0 ? -1 : 0;
  const good = better === "none" || sign === 0 ? null : (sign === 1) === (better === "up");
  const text = new Intl.NumberFormat(undefined, { ...format, signDisplay: "never" }).format(value);
  const arrow = sign === 1 ? "▲" : sign === -1 ? "▼" : "–";
  const spoken = sign === 1 ? "up" : sign === -1 ? "down" : "unchanged";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-baseline gap-1 font-mono text-xs tabular-nums",
        good === null ? "text-ink-2" : good ? "text-ok" : "text-err",
      )}
    >
      <span aria-hidden className="text-[9px]">
        {arrow}
      </span>
      <span className="sr-only">{spoken} </span>
      {text}
    </span>
  );
}

export interface StatGroupProps extends React.ComponentProps<"div"> {
  /** Drop the outer hairline, e.g. inside a `Panel` that already has one. */
  flush?: boolean;
}

/**
 * A row of `Stat`s divided by hairlines. Wraps onto more rows on narrow
 * screens; the dividers follow.
 */
export function StatGroup({ flush = false, className, children, ...props }: StatGroupProps) {
  return (
    <div
      {...props}
      className={cn("overflow-hidden", !flush && "rounded-box shadow-[0_0_0_1px_var(--ui-line-strong)]", className)}
    >
      {/* The -1px margins tuck the first column's and first row's dividers out
          of sight. Flex (not grid) so a stat that wraps alone stretches the full
          width and its divider spans the row. */}
      <div className="-mt-px -ml-px flex flex-wrap [&>*]:flex-[1_1_168px] [&>*]:border-t [&>*]:border-l [&>*]:border-line [&>*]:px-4 [&>*]:py-3.5">
        {children}
      </div>
    </div>
  );
}
