import type * as React from "react";
import { cn } from "../lib/cn";
import { NumberRoll } from "./number-roll";

export type VisitorCounterVariant = "odometer" | "plain";

export interface VisitorCounterProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The count the app supplies. This widget never generates or inflates traffic. */
  count: number;
  /** Digits to pad the count to, e.g. `6` shows `000042`. Defaults to the count's own length, at least 6. */
  digits?: number;
  /** Label above the counter. Defaults to "Visitors". */
  label?: React.ReactNode;
  /** Note after the digits, e.g. "since 1998". */
  caption?: React.ReactNode;
  /** `odometer` draws each digit in its own cell; `plain` is a bare mono number. Both roll changed digits. */
  variant?: VisitorCounterVariant;
  /** Locale for the spoken number. */
  locale?: Intl.LocalesArgument;
}

// A 1px seam across the middle of each cell is what makes it read as a
// mechanical wheel rather than a box with a number in it.
const CELL = [
  "relative mx-px px-[5px] py-1.5 rounded-ui bg-panel text-ink",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
  "after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-line",
].join(" ");

/**
 * The old-web visitor counter: an odometer whose changed digits roll in their
 * cells. The number is supplied — log a hit in your own storage or analytics
 * and pass the total.
 */
export function VisitorCounter({
  count,
  digits,
  label = "Visitors",
  caption,
  variant = "odometer",
  locale,
  className,
  ...props
}: VisitorCounterProps) {
  const valid = Number.isFinite(count) && count >= 0;
  const value = valid ? Math.floor(count) : 0;
  const width = Math.max(digits === undefined ? 6 : Math.max(1, Math.floor(digits)), String(value).length);
  const odometer = variant === "odometer";

  return (
    <div
      {...props}
      role="group"
      aria-label={typeof label === "string" ? label : "Visitors"}
      data-state={valid ? "ready" : "unavailable"}
      data-variant={variant}
      className={cn("inline-flex max-w-full flex-col gap-1.5", className)}
    >
      {label ? <span className="ui-label">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {valid ? (
          <>
            <span className="sr-only">{new Intl.NumberFormat(locale).format(value)} visitors</span>
            <NumberRoll
              aria-hidden="true"
              value={value}
              // Latin digits and no grouping: the wheels of an odometer sit side by side.
              locale="en"
              format={{ minimumIntegerDigits: width, useGrouping: false }}
              digitClassName={odometer ? CELL : undefined}
              className={cn("font-mono", odometer ? "-mx-px text-xl font-medium" : "text-2xl text-ink")}
            />
          </>
        ) : (
          <span className="font-mono text-2xl text-ink-3">—</span>
        )}
        {caption ? <span className="text-xs text-ink-3">{caption}</span> : null}
      </div>
    </div>
  );
}
