import * as React from "react";
import { cn } from "../lib/cn";
import { NumberRoll } from "./number-roll";

export type StarButtonSize = "sm" | "md";

export interface StarButtonProps extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  /** Total stars, as your app or the forge reports them. */
  count: number;
  /** Controlled starred state. With it, your app also owns `count`. */
  starred?: boolean;
  /** Initial state when uncontrolled. The shown count then follows the visitor's own clicks. */
  defaultStarred?: boolean;
  /** Called with the new state when the visitor stars or unstars. */
  onStarredChange?: (starred: boolean) => void;
  /** Makes the count a link, e.g. to the stargazers page. */
  href?: string;
  /** Button text before starring. Defaults to "Star". */
  label?: string;
  /** Button text after starring. Defaults to "Starred". */
  starredLabel?: string;
  size?: StarButtonSize;
  /** Locale for the count's digit grouping. */
  locale?: string;
  disabled?: boolean;
}

const HEIGHT: Record<StarButtonSize, string> = { sm: "h-7 text-xs", md: "h-8 text-ui" };
const STAR = "M8 1.6l1.95 3.95 4.36.63-3.15 3.08.74 4.34L8 11.55 4.1 13.6l.74-4.34L1.7 6.18l4.36-.63L8 1.6z";

/**
 * A "Star · 1,284" split button. Starring turns the outline star into a
 * filled one and rolls the count up by one; unstarring rolls it back down.
 */
export function StarButton({
  count,
  starred: starredProp,
  defaultStarred = false,
  onStarredChange,
  href,
  label = "Star",
  starredLabel = "Starred",
  size = "sm",
  locale = "en-GB",
  disabled = false,
  className,
  ...props
}: StarButtonProps) {
  const [starredState, setStarredState] = React.useState(defaultStarred);
  const controlled = starredProp !== undefined;
  const starred = controlled ? starredProp : starredState;
  // Uncontrolled, the widget is its own optimistic update: the visitor's
  // click shows in the count straight away. Controlled, the app decides.
  const shown = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0) + (controlled ? 0 : Number(starred) - Number(defaultStarred)));

  const toggle = () => {
    const next = !starred;
    if (!controlled) setStarredState(next);
    onStarredChange?.(next);
  };

  const countText = new Intl.NumberFormat(locale).format(shown);
  const countInner = <NumberRoll value={shown} locale={locale} aria-hidden="true" className="font-mono" />;
  const countClass = "flex h-full items-center px-2.5 text-ink tabular-nums";

  return (
    <div
      {...props}
      data-starred={starred || undefined}
      className={cn(
        "inline-flex shrink-0 items-stretch overflow-hidden rounded-ui bg-surface font-medium shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
        HEIGHT[size],
        disabled && "opacity-45",
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={starred}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "ui-press inline-flex items-center gap-1.5 rounded-l-ui px-2.5 text-ink outline-none select-none hover:bg-hover",
          "focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none",
        )}
      >
        <StarGlyphs starred={starred} />
        {/* Both labels share one grid cell, so the button never changes width. */}
        <span className="grid justify-items-start">
          <span className={cn("col-start-1 row-start-1 transition-opacity duration-150 ease-snap", starred && "opacity-0")}>{label}</span>
          <span aria-hidden className={cn("col-start-1 row-start-1 transition-opacity duration-150 ease-snap", !starred && "opacity-0")}>{starredLabel}</span>
        </span>
      </button>
      <span aria-hidden className="w-px bg-line-strong" />
      {href ? (
        <a
          href={href}
          aria-label={`${countText} stars`}
          className={cn(countClass, "rounded-r-ui outline-none hover:bg-hover hover:text-accent focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent")}
        >
          {countInner}
        </a>
      ) : (
        <span className={countClass}>
          <span className="sr-only">{countText} stars</span>
          {countInner}
        </span>
      )}
    </div>
  );
}

/** Outline star → filled star, crossfading and scaling like CopyButton's copy → check. */
function StarGlyphs({ starred }: { starred: boolean }) {
  return (
    <span aria-hidden className="relative inline-grid size-3.5 shrink-0">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinejoin="round"
        className={cn("absolute inset-0 size-3.5 text-ink-2 transition-[opacity,scale] duration-150 ease-snap", starred ? "scale-50 opacity-0" : "scale-100 opacity-100")}
      >
        <path d={STAR} />
      </svg>
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinejoin="round"
        className={cn("absolute inset-0 size-3.5 text-ink transition-[opacity,scale] duration-150 ease-snap", starred ? "scale-100 opacity-100" : "scale-50 opacity-0")}
      >
        <path d={STAR} />
      </svg>
    </span>
  );
}
