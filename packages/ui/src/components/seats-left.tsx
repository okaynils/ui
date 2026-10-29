import * as React from "react";
import { cn } from "../lib/cn";
import { NumberRoll } from "./number-roll";

export interface SeatsLeftProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Every seat there is. */
  total: number;
  /** Seats already claimed, as counted by your app. */
  taken: number;
  /** Label above the count. Defaults to "Spots". */
  label?: React.ReactNode;
  /** What a seat is, for the count line: "spots", "seats", "places". Defaults to "spots". */
  noun?: string;
  /** A quiet line under the seats, e.g. "Price goes up after the last one." */
  caption?: React.ReactNode;
  /** Shown instead of the count when every seat is taken. Defaults to "All {total} {noun} are taken." */
  soldOut?: React.ReactNode;
  locale?: string;
}

// Up to this many seats get a square each. Beyond it a square stands for
// several seats and the caption says how many, so the row never becomes a wall.
const MAX_SQUARES = 60;
const SQUARES_WHEN_GROUPED = 40;
// Rows hold at most this many, and are split evenly, so 24 seats are two
// rows of 12 rather than a row of 20 and an orphaned four.
const PER_ROW = 20;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Honest scarcity: every seat drawn as a square, the taken ones filled. When
 * a seat is claimed, its square lights up and the count rolls down.
 */
export function SeatsLeft({
  total,
  taken,
  label = "Spots",
  noun = "spots",
  caption,
  soldOut,
  locale = "en-GB",
  className,
  ...props
}: SeatsLeftProps) {
  const seats = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
  const claimed = Number.isFinite(taken) ? Math.min(seats, Math.max(0, Math.floor(taken))) : 0;
  const left = seats - claimed;
  const grouped = seats > MAX_SQUARES;
  const squares = grouped ? SQUARES_WHEN_GROUPED : seats;
  const perSquare = grouped ? seats / squares : 1;
  // A grouped square only fills once every seat in it is gone, so the row
  // never claims more scarcity than the count does.
  const filled = grouped ? Math.floor(claimed / perSquare) : claimed;
  const count = new Intl.NumberFormat(locale);
  const columns = squares > 0 ? Math.ceil(squares / Math.ceil(squares / PER_ROW)) : 1;

  const cells = React.useRef<(HTMLSpanElement | null)[]>([]);
  const previous = React.useRef(filled);
  React.useLayoutEffect(() => {
    const before = previous.current;
    previous.current = filled;
    if (filled <= before || prefersReducedMotion()) return;
    for (let i = before; i < filled; i++) {
      const cell = cells.current[i];
      if (!cell || typeof cell.animate !== "function") continue;
      // The change flash, sized for a square: it arrives in accent and
      // settles to ink, after the seat has already been counted as taken.
      cell.animate(
        [{ backgroundColor: "var(--ui-accent)", scale: "1.3" }, { backgroundColor: "var(--ui-ink)", scale: "1" }],
        { duration: 700, delay: (i - before) * 30, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "backwards" },
      );
    }
  }, [filled]);

  return (
    <div
      role="group"
      aria-label={typeof label === "string" ? label : undefined}
      {...props}
      data-state={left === 0 && seats > 0 ? "sold-out" : "open"}
      className={cn("inline-flex max-w-full flex-col gap-2", className)}
    >
      {label ? <span className="ui-label">{label}</span> : null}

      {seats === 0 ? (
        <span className="text-ui text-ink-3">No {noun} to claim.</span>
      ) : left === 0 ? (
        <span className="text-ui text-ink">{soldOut ?? `All ${count.format(seats)} ${noun} are taken.`}</span>
      ) : (
        <div className="flex items-baseline gap-1.5 text-ui text-ink-2">
          <NumberRoll value={left} locale={locale} className="font-mono text-[26px] leading-8 font-medium text-ink" />
          <span>of {count.format(seats)} {noun} left</span>
        </div>
      )}

      {seats > 0 ? (
        <div aria-hidden="true" className="grid w-max max-w-full gap-1" style={{ gridTemplateColumns: `repeat(${columns}, 10px)` }}>
          {Array.from({ length: squares }, (_, i) => (
            <span
              key={i}
              ref={(node) => { cells.current[i] = node; }}
              className={cn(
                "size-2.5 rounded-[2px]",
                i < filled ? "bg-ink" : "shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
              )}
            />
          ))}
        </div>
      ) : null}

      {grouped || caption ? (
        <p className="m-0 text-xs text-ink-3">
          {grouped ? `Each square is ${Number.isInteger(perSquare) ? "" : "about "}${count.format(Math.round(perSquare))} ${noun}.` : null}
          {grouped && caption ? " " : null}
          {caption}
        </p>
      ) : null}
    </div>
  );
}
