import * as React from "react";
import { cn } from "../lib/cn";

export interface SplitFlapProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** The text to show. Changing it flips the cells that differ. */
  value?: string;
  /** Rotate through these instead of a fixed value. Ignored when `value` is set. */
  words?: readonly string[];
  /** Time each word stays up, in ms. Defaults to 3000. Rotation pauses on hover and focus. */
  interval?: number;
  /** Number of cells. Defaults to the longest value or word, so the board never changes width. */
  length?: number;
}

// One flip is a top half falling and a bottom half landing. 70ms each, three
// to five per cell, staggered 25ms: a full board settles in about half a second.
const STEP = 70;
const STAGGER = 25;
const MAX_STAGGER = 150;
const ALPHABETS = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789"];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** A plausible character to pass through on the way to `target`. */
function passing(target: string): string {
  const alphabet = ALPHABETS.find((set) => set.includes(target)) ?? ALPHABETS[1]!;
  return alphabet[Math.floor(Math.random() * alphabet.length)]!;
}

/**
 * Text on a split-flap departure board. When the text changes, each cell
 * that differs flips through a few characters before landing on its own.
 */
export function SplitFlap({ value, words, interval = 3000, length, className, ...props }: SplitFlapProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const rotating = value === undefined && words !== undefined && words.length > 1;

  React.useEffect(() => {
    if (!rotating || paused) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((current) => current + 1);
    }, Math.max(1000, interval));
    return () => clearInterval(timer);
  }, [rotating, paused, interval]);

  const text = value ?? (words?.length ? words[index % words.length]! : "");
  const cells = Math.max(length ?? 0, text.length, ...(value === undefined ? (words ?? []).map((word) => word.length) : []));
  const padded = text.padEnd(cells, " ");

  return (
    <span
      {...props}
      onPointerEnter={rotating ? () => setPaused(true) : undefined}
      onPointerLeave={rotating ? () => setPaused(false) : undefined}
      onFocus={rotating ? () => setPaused(true) : undefined}
      onBlur={rotating ? () => setPaused(false) : undefined}
      className={cn("inline-flex align-middle font-mono font-medium text-ink", className)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex gap-[0.08em]">
        {[...padded].map((char, i) => (
          <Cell key={i} char={char} delay={Math.min(i * STAGGER, MAX_STAGGER)} flips={3 + (i % 3)} />
        ))}
      </span>
    </span>
  );
}

const HALF = "absolute inset-x-0 h-1/2 overflow-hidden bg-panel";
const GLYPH = "absolute inset-x-0 flex h-[200%] items-center justify-center";

function Cell({ char, delay, flips }: { char: string; delay: number; flips: number }) {
  // React renders the first character once; every later change is drawn
  // directly, so a re-render can never jump a flip to its end.
  const [initial] = React.useState(char);
  const shown = React.useRef(char);
  const topStatic = React.useRef<HTMLSpanElement>(null);
  const bottomStatic = React.useRef<HTMLSpanElement>(null);
  const topFlap = React.useRef<HTMLSpanElement>(null);
  const bottomFlap = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const from = shown.current;
    shown.current = char;
    const parts = [topStatic.current, bottomStatic.current, topFlap.current, bottomFlap.current];
    const settle = () => parts.forEach((part) => { if (part) part.textContent = char; });
    if (from === char) return;
    if (prefersReducedMotion() || typeof topFlap.current?.animate !== "function") return settle();

    const route = [...Array.from({ length: flips - 1 }, () => passing(char)), char];
    const timers = route.map((next, step) => setTimeout(() => {
      const previous = step === 0 ? from : route[step - 1]!;
      const [top, bottom, falling, landing] = parts;
      if (!top || !bottom || !falling || !landing) return;
      top.textContent = next;
      falling.textContent = previous;
      landing.textContent = next;
      falling.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], { duration: STEP / 2, easing: "ease-in" });
      landing.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], { duration: STEP / 2, delay: STEP / 2, easing: "ease-out", fill: "backwards" })
        .finished.then(() => { bottom.textContent = next; }, () => {});
    }, delay + step * STEP));
    return () => {
      timers.forEach(clearTimeout);
      settle();
    };
  }, [char, delay, flips]);

  return (
    <span
      className={cn(
        "relative inline-block h-[1.4em] w-[calc(1ch+0.35em)] [perspective:400px]",
        // Hairline ring and the hinge across the middle, drawn over the halves.
        "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-ui after:shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:z-10 before:h-px before:-translate-y-1/2 before:bg-line-strong",
      )}
    >
      <span className={cn(HALF, "top-0 rounded-t-ui")}><span ref={topStatic} className={cn(GLYPH, "top-0")}>{initial}</span></span>
      <span className={cn(HALF, "bottom-0 rounded-b-ui")}><span ref={bottomStatic} className={cn(GLYPH, "bottom-0")}>{initial}</span></span>
      <span className={cn(HALF, "top-0 origin-bottom rounded-t-ui [backface-visibility:hidden] [transform:rotateX(-90deg)]")}>
        <span ref={topFlap} className={cn(GLYPH, "top-0")}>{initial}</span>
      </span>
      <span className={cn(HALF, "bottom-0 origin-top rounded-b-ui [backface-visibility:hidden] [transform:rotateX(90deg)]")}>
        <span ref={bottomFlap} className={cn(GLYPH, "bottom-0")}>{initial}</span>
      </span>
    </span>
  );
}
