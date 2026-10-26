import * as React from "react";
import { cn } from "../lib/cn";

export interface NumberRollProps extends Omit<React.ComponentProps<"span">, "children" | "prefix"> {
  /** The number to show. When it changes, only the digits that changed roll. */
  value: number;
  /** `Intl.NumberFormat` options: `{ style: "currency", currency: "USD" }`, `{ notation: "compact" }`, `{ maximumFractionDigits: 1 }`… */
  format?: Intl.NumberFormatOptions;
  /** Locale for formatting. Defaults to the browser's. */
  locale?: Intl.LocalesArgument;
  /** Text before the number, e.g. "~". Doesn't roll. */
  prefix?: React.ReactNode;
  /** Text after the number, e.g. " GPU-h". Doesn't roll. */
  suffix?: React.ReactNode;
  /** Classes on each digit's clipping box, e.g. to draw odometer cells. Separators are not boxed. */
  digitClassName?: string;
  /** Which way digits roll. `auto` follows the change; a countdown wants `down` even when 00 wraps to 59. */
  direction?: "auto" | "up" | "down";
}

const DIGIT = /\d/;
const DURATION = 180;
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

/**
 * A number whose changed digits roll to their new value — the library's
 * signature "this just changed" moment. Up when the value grows, down when
 * it shrinks. Never animates on first render.
 */
export function NumberRoll({ value, format, locale, prefix, suffix, digitClassName, direction: forced = "auto", className, ...props }: NumberRollProps) {
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, format), [locale, JSON.stringify(format)]);
  const text = formatter.format(value);

  // Derived-state pattern: remember the previous value to know which way to roll.
  const [prev, setPrev] = React.useState(value);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  if (!Object.is(value, prev)) {
    setDirection(value > prev ? 1 : -1);
    setPrev(value);
  }

  const chars = [...text];
  return (
    <span {...props} className={cn("inline-flex items-baseline tabular-nums whitespace-nowrap", className)}>
      <span className="sr-only">
        {typeof prefix === "string" ? prefix : null}
        {text}
        {typeof suffix === "string" ? suffix : null}
      </span>
      <span aria-hidden className="inline-flex items-baseline">
        {prefix}
        {chars.map((char, i) => (
          // Keyed from the right, so the ones digit stays the ones digit when the length changes.
          <Reel key={chars.length - i} char={char} direction={forced === "auto" ? direction : forced === "up" ? 1 : -1} className={digitClassName} />
        ))}
        {suffix}
      </span>
    </span>
  );
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function Reel({ char, direction, className }: { char: string; direction: 1 | -1; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const last = React.useRef<string | null>(null);
  const ghost = React.useRef<HTMLSpanElement | null>(null);

  React.useLayoutEffect(() => {
    const before = last.current;
    last.current = char;
    const el = ref.current;
    if (!el || before === null || before === char) return;
    if (!DIGIT.test(before) || !DIGIT.test(char) || prefersReducedMotion()) return;
    if (typeof el.animate !== "function") return;

    // A previous roll still running: drop its ghost so digits never stack.
    ghost.current?.remove();

    const out = document.createElement("span");
    out.textContent = before;
    out.setAttribute("aria-hidden", "true");
    // Inherit padding so a boxed digit's ghost sits exactly where the digit did.
    out.style.cssText = "position:absolute;inset:0;text-align:center;padding:inherit;box-sizing:border-box;";
    el.appendChild(out);
    ghost.current = out;

    const shift = direction === 1 ? "100%" : "-100%";
    const back = direction === 1 ? "-100%" : "100%";
    const timing = { duration: DURATION, easing: EASE };
    el.firstElementChild?.animate([{ transform: `translateY(${shift})` }, { transform: "translateY(0)" }], timing);
    out.animate([{ transform: "translateY(0)" }, { transform: `translateY(${back})` }], timing).finished.then(
      () => {
        out.remove();
        if (ghost.current === out) ghost.current = null;
      },
      () => out.remove(),
    );
  }, [char, direction]);

  if (!DIGIT.test(char)) return <span className="whitespace-pre">{char}</span>;
  return (
    // leading-none: the clip box is one em tall, so a digit travels exactly
    // its own height instead of the whole (often 1.45×) line box.
    <span ref={ref} className={cn("relative inline-block overflow-hidden leading-none", className)}>
      <span className="inline-block">{char}</span>
    </span>
  );
}
