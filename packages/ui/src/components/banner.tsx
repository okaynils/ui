import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { StatusDot, type StatusTone } from "./status";

export type BannerTone = "neutral" | "accent" | "warn" | "err";

export interface BannerProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Colours the dot only; the bar stays panel grey. */
  tone?: BannerTone;
  /** A short word or two after the dot, in ink: "Maintenance", "Free plan". */
  label?: React.ReactNode;
  /** One action at the end, e.g. a `Button size="sm" variant="ghost"` or a link. */
  action?: React.ReactNode;
  /**
   * Shows a dismiss button. The bar collapses itself; remembering that it
   * was dismissed (so it stays gone on reload) is your app's job.
   */
  onDismiss?: () => void;
  /** Accessible name of the dismiss button. */
  dismissLabel?: string;
}

const DOT: Record<BannerTone, StatusTone> = {
  neutral: "neutral",
  accent: "accent",
  warn: "warn",
  err: "err",
};

// Matches the exit budget in DESIGN.md: things leave faster than they arrive.
const COLLAPSE_MS = 150;

/**
 * A full-width, one-line announcement across the top of a page or app.
 * Tone lives in a dot beside a word; the bar itself is always panel grey
 * with a hairline underneath, so it never shouts louder than the page.
 */
export function Banner({
  tone = "neutral",
  label,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
  children,
  ...props
}: BannerProps) {
  const [closing, setClosing] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const dismiss = () => {
    if (closing) return;
    setClosing(true);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // Tell the app once the bar has gone, so removing it doesn't cut the collapse short.
    timer.current = setTimeout(() => onDismiss?.(), reduced ? 0 : COLLAPSE_MS);
  };

  return (
    <div
      {...props}
      // Errors interrupt; everything else waits its turn.
      role={tone === "err" ? "alert" : "status"}
      data-tone={tone}
      data-state={closing ? "closing" : "open"}
      aria-hidden={closing || undefined}
      className={cn(
        // Collapsing grid rows animates to the content's real height, with no measuring.
        "grid w-full grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-150 ease-snap",
        closing && "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="flex min-h-10 items-center gap-3 border-b border-line bg-panel px-4 py-1.5 text-ui">
          <span className="flex size-4 shrink-0 items-center justify-center">
            <StatusDot tone={DOT[tone]} />
          </span>
          <p className="m-0 min-w-0 flex-1 text-ink-2">
            {label ? <span className="mr-2 font-medium text-ink">{label}</span> : null}
            {children}
          </p>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
          {onDismiss ? (
            <Button variant="ghost" size="sm" icon aria-label={dismissLabel} onClick={dismiss} className="-mr-1.5 shrink-0 text-ink-3">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden className="size-3.5">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
