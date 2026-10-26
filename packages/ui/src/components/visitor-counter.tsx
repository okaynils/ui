import * as React from "react";
import { cn } from "../lib/cn";
import { NumberRoll } from "./number-roll";

export interface VisitorCounterProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The count the app supplies. This widget never generates or inflates traffic. */
  count: number;
  /** Digits to pad the count to, e.g. `6` shows `000042`. Defaults to the count's own length, at least 6. */
  digits?: number;
  /** Section label above the number, e.g. "Visitors". Defaults to "Visitors". */
  label?: React.ReactNode;
  /** Note under the number, e.g. "since 1998". */
  caption?: React.ReactNode;
  /** Draw each digit in its own inset cell, like an old mechanical counter. */
  mechanical?: boolean;
  /** Roll changed digits with `NumberRoll`. Ignored by `mechanical`, which keeps its cells still. */
  animate?: boolean;
  /** Locale for digit grouping. */
  locale?: Intl.LocalesArgument;
}

/**
 * A visitor counter for a personal site. The number is supplied — log a hit in
 * your own storage or analytics and pass the total. There is no polling, no
 * fake padding and no backend here.
 */
export function VisitorCounter({
  count,
  digits,
  label = "Visitors",
  caption,
  mechanical = false,
  animate = true,
  locale,
  className,
  ...props
}: VisitorCounterProps) {
  const valid = Number.isFinite(count) && count >= 0;
  const value = valid ? Math.floor(count) : 0;
  const requested = digits === undefined ? 6 : Math.max(1, Math.floor(digits));
  const width = Math.max(requested, String(value).length);
  const padded = String(value).padStart(width, "0");
  // Visual: an odometer keeps the digits together, so no grouping separators.
  // Spoken: the same number read as a quantity, e.g. "8,675,309".
  const spaced = new Intl.NumberFormat(locale, { minimumIntegerDigits: width, useGrouping: false }).format(value);
  const spokenCount = new Intl.NumberFormat(locale).format(value);

  return (
    <div
      {...props}
      role="group"
      aria-label={typeof label === "string" ? label : "Visitors"}
      data-state={valid ? "ready" : "unavailable"}
      className={cn("w-full max-w-sm rounded-box border border-line-strong bg-surface p-3", className)}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="ui-label">{label}</span>
        {caption ? <span className="truncate text-xs text-ink-3">{caption}</span> : null}
      </div>

      {valid ? (
        <>
          <span className="sr-only">{spokenCount} visitors</span>
          {mechanical ? (
            <span aria-hidden="true" className="inline-flex items-center gap-1">
              {[...padded].map((character, index) =>
                /\d/.test(character) ? (
                  <span
                    key={index}
                    className="inline-flex h-7 min-w-6 items-center justify-center rounded-ui bg-panel px-1 font-mono text-lg text-ink tabular-nums shadow-[inset_0_0_0_1px_var(--ui-line)]"
                  >
                    {character}
                  </span>
                ) : (
                  <span key={index} className="px-0.5 font-mono text-lg text-ink-3">
                    {character}
                  </span>
                ),
              )}
            </span>
          ) : animate ? (
            <NumberRoll
              aria-hidden="true"
              value={value}
              locale={locale}
              format={{ minimumIntegerDigits: width, useGrouping: false }}
              className="font-mono text-2xl text-ink"
            />
          ) : (
            <span aria-hidden="true" className="font-mono text-2xl text-ink tabular-nums">
              {spaced}
            </span>
          )}
        </>
      ) : (
        <span className="font-mono text-2xl text-ink-3">—</span>
      )}
    </div>
  );
}
