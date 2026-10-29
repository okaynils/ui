import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

export interface ScratchCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** What's under the coating: a promo code, a date, an invite. */
  children: React.ReactNode;
  /** Printed on the coating; it scratches away with it. Pass "" for none. */
  hint?: string;
  /** Controlled revealed state. Setting it back to false puts a fresh coating on. */
  revealed?: boolean;
  defaultRevealed?: boolean;
  /** Called once when the visitor reveals the card, by scratching or with the button. */
  onReveal?: () => void;
  /** Share of the coating (0–1) that has to be scratched off before the rest falls away. */
  threshold?: number;
  /** Label of the button that reveals without scratching. */
  revealLabel?: string;
}

// A fingertip-sized brush: big enough that a few strokes clear the card,
// small enough that it still feels like scratching rather than wiping.
const BRUSH = 32;
// Coverage reads back every pixel, so it runs at most this often mid-stroke.
const CHECK_MS = 100;
const HATCH = 6;

type Point = { x: number; y: number };

function stroke(ctx: CanvasRenderingContext2D, points: readonly Point[]) {
  const [first] = points;
  if (!first) return;
  ctx.beginPath();
  if (points.length === 1) {
    ctx.arc(first.x, first.y, BRUSH / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.moveTo(first.x, first.y);
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

/**
 * A scratch-off card. The content sits under a hatched coating drawn on a
 * canvas; scratching erases it along the stroke, and once enough is gone
 * the rest falls away. A Reveal button does the same without a pointer.
 */
export function ScratchCard({
  children,
  hint = "Scratch to reveal",
  revealed: revealedProp,
  defaultRevealed = false,
  onReveal,
  threshold = 0.5,
  revealLabel = "Reveal",
  className,
  ...props
}: ScratchCardProps) {
  const [internal, setInternal] = React.useState(defaultRevealed);
  const revealed = revealedProp ?? internal;
  // The coating is only ever mounted if the card started covered or was
  // covered again; a card that starts revealed never draws one.
  const [coated, setCoated] = React.useState(!revealed);
  const [painted, setPainted] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const area = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const probe = React.useRef<HTMLSpanElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const strokes = React.useRef<Point[][]>([]);
  const scratching = React.useRef(false);
  const lastCheck = React.useRef(0);
  const done = React.useRef(revealed);
  const focusContent = React.useRef(false);
  const callback = React.useRef(onReveal);
  React.useEffect(() => { callback.current = onReveal; }, [onReveal]);

  const context = () => canvas.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const reveal = () => {
    if (done.current) return;
    done.current = true;
    scratching.current = false;
    setInternal(true);
    setMessage("Revealed.");
    callback.current?.();
  };

  // Covered again (a controlled reset): forget the old scratches.
  React.useEffect(() => {
    done.current = revealed;
    if (revealed) return;
    strokes.current = [];
    setCoated(true);
    setMessage("");
  }, [revealed]);

  React.useEffect(() => {
    if (!revealed || !focusContent.current) return;
    focusContent.current = false;
    content.current?.focus();
  }, [revealed]);

  React.useLayoutEffect(() => {
    if (revealed || !coated) return;
    const paint = () => {
      const element = canvas.current;
      const box = area.current;
      const colours = probe.current;
      const ctx = context();
      if (!element || !box || !colours || !ctx) return;
      const { width, height } = box.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      element.width = Math.max(1, Math.round(width * ratio));
      element.height = Math.max(1, Math.round(height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      // Tokens are light-dark() pairs, which a canvas can't read. A hidden
      // span carrying the token classes hands back resolved colours instead.
      const style = getComputedStyle(colours);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = style.borderTopColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -height; x < width; x += HATCH) {
        ctx.moveTo(x, height);
        ctx.lineTo(x + height, 0);
      }
      ctx.stroke();
      if (hint) {
        const text = hint.toUpperCase();
        ctx.font = `500 11px ${style.fontFamily}`;
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.66px";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const padded = ctx.measureText(text).width + 20;
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(width / 2 - padded / 2, height / 2 - 11, padded, 22);
        ctx.fillStyle = style.color;
        ctx.fillText(text, width / 2, height / 2);
      }

      // Resizes and theme changes repaint the coating; replaying the
      // strokes keeps what the visitor already scratched off.
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = BRUSH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.fillStyle = "#000";
      ctx.strokeStyle = "#000";
      for (const points of strokes.current) stroke(ctx, points);
      setPainted(true);
    };

    paint();
    const resize = new ResizeObserver(paint);
    if (area.current) resize.observe(area.current);
    const theme = new MutationObserver(paint);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    const scheme = window.matchMedia?.("(prefers-color-scheme: dark)");
    scheme?.addEventListener("change", paint);
    let live = true;
    document.fonts?.ready.then(() => { if (live) paint(); });
    return () => {
      live = false;
      resize.disconnect();
      theme.disconnect();
      scheme?.removeEventListener("change", paint);
    };
  }, [revealed, coated, hint]);

  const coverage = () => {
    const element = canvas.current;
    const ctx = context();
    if (!element || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, element.width, element.height);
    // Every pixel isn't needed to know "about half": a stride keeps the
    // read-back to a few thousand samples whatever the card's size.
    const stride = 4 * Math.max(1, Math.floor((element.width * element.height) / 4000));
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += stride) {
      total += 1;
      if (data[i]! < 128) clear += 1;
    }
    return total ? clear / total : 0;
  };

  const check = (force = false) => {
    const now = performance.now();
    if (!force && now - lastCheck.current < CHECK_MS) return;
    lastCheck.current = now;
    if (coverage() >= threshold) reveal();
  };

  const at = (event: { clientX: number; clientY: number }): Point => {
    const rect = canvas.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (done.current || (event.pointerType === "mouse" && event.button !== 0)) return;
    const ctx = context();
    if (!ctx) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratching.current = true;
    const point = at(event);
    strokes.current.push([point]);
    stroke(ctx, [point]);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!scratching.current || done.current) return;
    const ctx = context();
    const current = strokes.current.at(-1);
    if (!ctx || !current) return;
    // Coalesced events fill in the points a fast stroke skips between frames,
    // so a quick swipe draws a line rather than a row of dots.
    const events = event.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const sample of events.length ? events : [event.nativeEvent]) {
      const point = at(sample);
      stroke(ctx, [current.at(-1)!, point]);
      current.push(point);
    }
    check();
  };

  const onPointerEnd = () => {
    if (!scratching.current) return;
    scratching.current = false;
    check(true);
  };

  return (
    <div {...props} data-state={revealed ? "revealed" : "covered"} className={cn("inline-flex max-w-full flex-col items-start gap-2", className)}>
      <div
        ref={area}
        className={cn(
          "relative isolate min-w-60 max-w-full overflow-hidden rounded-box bg-panel",
          // The hairline is drawn above the coating, so the edge stays crisp while it's scratched.
          "after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-box after:shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
        )}
      >
        <div
          ref={content}
          tabIndex={-1}
          aria-hidden={!revealed || undefined}
          inert={!revealed}
          className="px-5 py-6 text-center text-ink outline-none"
        >
          {children}
        </div>
        {coated ? (
          <>
            {/* Until the canvas has painted (and during server render) a flat coat hides the content. */}
            {!painted && !revealed ? <div aria-hidden="true" className="absolute inset-0 z-10 bg-active" /> : null}
            <canvas
              ref={canvas}
              aria-hidden="true"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              className={cn(
                "absolute inset-0 z-10 size-full touch-none transition-opacity duration-180 ease-snap",
                revealed ? "pointer-events-none opacity-0" : "cursor-crosshair",
              )}
            />
          </>
        ) : null}
        <span ref={probe} aria-hidden="true" className="hidden border-line-strong bg-active font-mono text-ink-2" />
      </div>
      {!revealed ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            focusContent.current = true;
            reveal();
          }}
        >
          {revealLabel}
        </Button>
      ) : null}
      <span role="status" className="sr-only">{message}</span>
    </div>
  );
}
