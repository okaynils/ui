import * as React from "react";
import { cn } from "../lib/cn";

export type StampTone = "ink" | "accent" | "ok" | "err";

export interface StampProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** The word on the stamp: "Shipped", "Paid", "Read". Keep it to one or two words. */
  children: React.ReactNode;
  /** Ink colour. Use status tones for what they mean: `ok` for done, `err` for void or rejected. */
  tone?: StampTone;
  /** A date line under the word, like a date stamp. */
  date?: Date | string | number;
  locale?: string;
  /** Tilt in degrees. Defaults to -6; vary it a little when stamps sit side by side. */
  rotate?: number;
  /**
   * Land with a thunk when it mounts after the page has loaded, i.e. as the
   * result of an action. Stamps rendered with the page never animate.
   */
  land?: boolean;
}

const TONE: Record<StampTone, string> = {
  ink: "text-ink-2",
  accent: "text-accent",
  ok: "text-ok",
  err: "text-err",
};

// Rubber never inks evenly. A fractal-noise mask knocks small gaps out of
// the ink, the same everywhere, so it reads as texture rather than damage.
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 2.1'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>",
)}")`;

// Anything mounting this soon after navigation is part of the page, not the
// answer to something the visitor just did.
const PAGE_LOAD_MS = 1000;

function formatDate(value: Date | string | number, locale: string): { text: string; iso: string } | null {
  const date = new Date(value instanceof Date ? value.getTime() : value);
  if (!Number.isFinite(date.getTime())) return null;
  let text: string;
  try { text = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date); }
  catch { text = date.toISOString().slice(0, 10); }
  return { text, iso: date.toISOString() };
}

/**
 * A rubber stamp: a word in a double-ruled box, tilted, with uneven ink.
 * Mounted after an action, it lands with a short thunk.
 */
export function Stamp({ children, tone = "ink", date, locale = "en-GB", rotate = -6, land = true, className, style, ref: forwardedRef, ...props }: StampProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const setRef = (node: HTMLSpanElement | null) => {
    ref.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  const stamped = date === undefined ? null : formatDate(date, locale);

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!land || !element || typeof element.animate !== "function") return;
    if (performance.now() < PAGE_LOAD_MS) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    element.animate(
      [{ opacity: 0, scale: "1.15" }, { opacity: 1, scale: "1" }],
      { duration: 160, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
    );
  }, [land]);

  const mask: React.CSSProperties = { maskImage: GRAIN, WebkitMaskImage: GRAIN, maskSize: "160px", WebkitMaskSize: "160px" };

  return (
    <span
      {...props}
      ref={setRef}
      data-tone={tone}
      style={{ rotate: `${rotate}deg`, ...mask, ...style }}
      className={cn(
        "inline-flex shrink-0 flex-col items-center rounded-ui border-[3px] border-double border-current px-2.5 py-1 select-none",
        "font-mono text-sm leading-5 font-semibold tracking-[0.14em] uppercase",
        TONE[tone],
        className,
      )}
    >
      <span>{children}</span>
      {stamped ? <time dateTime={stamped.iso} className="text-[10px] leading-3 tracking-[0.1em]">{stamped.text}</time> : null}
    </span>
  );
}
