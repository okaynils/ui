import * as React from "react";
import { buttonClassName } from "./button";
import { cn } from "../lib/cn";
import { NumberRoll } from "./number-roll";

export interface KudosProps extends Omit<React.ComponentProps<"button">, "children" | "onClick" | "value" | "defaultValue"> {
  /** Everyone's kudos, as your app last counted them. */
  count: number;
  /** Kudos this visitor has already given, e.g. from their earlier visits. Controlled. */
  given?: number;
  /** Starting value for `given` when uncontrolled. */
  defaultGiven?: number;
  /** Most kudos one visitor can give. Defaults to 16. */
  max?: number;
  /**
   * Receives a batch of new kudos once the visitor pauses, so a burst of
   * presses becomes one request. Persist it and pass the new `count` back.
   */
  onGive?: (delta: number) => void;
  /** Replaces the default spark icon. */
  icon?: React.ReactNode;
  /** Names the thing being appreciated, e.g. "this post". Used in the accessible name. */
  subject?: string;
  locale?: string;
}

// Holding starts repeating after a beat, so a tap is always exactly one.
const HOLD_DELAY = 400;
const REPEAT = 120;
// Long enough to finish a burst, short enough that the request still feels
// connected to the presses.
const BATCH_PAUSE = 600;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function Spark({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
      <path d="M8 1.5 9.5 6.5 14.5 8 9.5 9.5 8 14.5 6.5 9.5 1.5 8 6.5 6.5Z" />
    </svg>
  );
}

/**
 * An applause button. Click for one, press and hold to keep going; each
 * kudo rolls the count up and floats a little "+1". New kudos reach your app
 * in one batch after the visitor pauses.
 */
export function Kudos({
  count,
  given: givenProp,
  defaultGiven = 0,
  max = 16,
  onGive,
  icon,
  subject,
  locale = "en-GB",
  className,
  disabled,
  ...props
}: KudosProps) {
  const [ownGiven, setOwnGiven] = React.useState(defaultGiven);
  const controlled = givenProp !== undefined;
  // Presses not yet reported, and reported ones the app hasn't reflected in
  // `count` / `given` yet. Together they keep the number from jumping back
  // while the request is in flight.
  const [unsent, setUnsent] = React.useState(0);
  const [awaitingCount, setAwaitingCount] = React.useState(0);
  const [awaitingGiven, setAwaitingGiven] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState("");

  const lastCount = React.useRef(count);
  if (lastCount.current !== count) {
    lastCount.current = count;
    if (awaitingCount !== 0) setAwaitingCount(0);
  }
  const lastGiven = React.useRef(givenProp);
  if (lastGiven.current !== givenProp) {
    lastGiven.current = givenProp;
    if (awaitingGiven !== 0) setAwaitingGiven(0);
  }

  const total = (Number.isFinite(count) ? count : 0) + awaitingCount + unsent;
  const visitor = (controlled ? givenProp + awaitingGiven : ownGiven) + unsent;
  const done = visitor >= max;

  const counter = React.useRef<HTMLSpanElement>(null);
  const flushTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const holdTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const unsentRef = React.useRef(0);
  const visitorRef = React.useRef(visitor);
  visitorRef.current = visitor;
  const onGiveRef = React.useRef(onGive);
  onGiveRef.current = onGive;
  const lastKey = React.useRef(0);

  const flush = React.useCallback(() => {
    clearTimeout(flushTimer.current);
    const delta = unsentRef.current;
    if (delta === 0) return;
    unsentRef.current = 0;
    setUnsent(0);
    setAwaitingCount((value) => value + delta);
    if (controlled) setAwaitingGiven((value) => value + delta);
    else setOwnGiven((value) => value + delta);
    setAnnouncement(`You gave ${delta} kudos.`);
    onGiveRef.current?.(delta);
  }, [controlled]);

  // A visitor who leaves mid-burst still has their kudos counted.
  React.useEffect(() => () => {
    clearTimeout(holdTimer.current);
    flush();
  }, [flush]);

  const floatPlusOne = () => {
    const anchor = counter.current;
    if (!anchor || typeof anchor.animate !== "function" || prefersReducedMotion()) return;
    const plus = document.createElement("span");
    plus.textContent = "+1";
    plus.setAttribute("aria-hidden", "true");
    plus.style.cssText = "position:absolute;right:0;bottom:100%;font:500 11px/1 var(--font-mono);color:var(--ui-ink-2);pointer-events:none;";
    anchor.appendChild(plus);
    plus.animate(
      [{ transform: "translateY(2px)", opacity: 1 }, { transform: "translateY(-8px)", opacity: 0 }],
      { duration: 300, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
    ).finished.then(() => plus.remove(), () => plus.remove());
  };

  const give = () => {
    if (disabled || visitorRef.current >= max) return false;
    unsentRef.current += 1;
    visitorRef.current += 1;
    setUnsent(unsentRef.current);
    floatPlusOne();
    clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, BATCH_PAUSE);
    return true;
  };

  const repeat = () => {
    holdTimer.current = setTimeout(function step() {
      if (give()) holdTimer.current = setTimeout(step, REPEAT);
    }, HOLD_DELAY);
  };
  const stop = () => {
    clearTimeout(holdTimer.current);
    holdTimer.current = undefined;
  };

  const name = `Give kudos${subject ? ` to ${subject}` : ""}. ${new Intl.NumberFormat(locale).format(total)} so far${done ? ", and you've given the most you can" : ""}.`;

  return (
    <>
    <button
      {...props}
      type="button"
      disabled={disabled}
      aria-label={name}
      aria-disabled={done || disabled || undefined}
      data-state={done ? "done" : visitor > 0 ? "given" : "idle"}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (give()) repeat();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(event) => {
        // A long press on touch would otherwise open the context menu mid-burst.
        if (holdTimer.current) event.preventDefault();
      }}
      onKeyDown={(event) => {
        if (event.key !== " " && event.key !== "Enter") return;
        event.preventDefault();
        // Key repeat while held is the keyboard's press-and-hold, slowed to
        // the same pace as holding the pointer.
        if (event.repeat && Date.now() - lastKey.current < REPEAT) return;
        lastKey.current = Date.now();
        give();
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") event.preventDefault();
      }}
      onClick={(event) => {
        // Pointer presses and keys are counted where they happen, and both
        // cancel the click. One that still arrives with no pointer behind
        // it is assistive technology activating the button: count it.
        if (event.detail === 0) give();
      }}
      className={cn(
        buttonClassName({ variant: "outline" }),
        "touch-manipulation gap-1.5 select-none",
        done && "active:scale-100",
        className,
      )}
    >
      <span className={cn("flex", visitor > 0 ? "text-ink" : "text-ink-2")}>{icon ?? <Spark filled={visitor > 0} />}</span>
      <span ref={counter} className="relative">
        <NumberRoll value={total} locale={locale} className="font-mono text-ui text-ink" />
      </span>
      {done ? <span className="font-mono text-[11px] text-ink-3">Thanks</span> : null}
    </button>
    <span role="status" className="sr-only">{announcement}</span>
    </>
  );
}
