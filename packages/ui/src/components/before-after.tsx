import * as React from "react";
import { cn } from "../lib/cn";

export interface BeforeAfterImage {
  src: string;
  /** Describe the picture itself. "Before" and "after" belong in the labels, not here. */
  alt: string;
}

export interface BeforeAfterProps extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  /** The left-hand image, revealed up to the divider. */
  before: BeforeAfterImage;
  /** The right-hand image, visible from the divider to the edge. */
  after: BeforeAfterImage;
  /** Divider position as a percentage from the left. Leave it out to let the widget own the state. */
  value?: number;
  /** Starting position for the uncontrolled divider. Defaults to 50. */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  beforeLabel?: React.ReactNode;
  afterLabel?: React.ReactNode;
  /** Accessible name of the divider. Defaults to "Reveal before and after". */
  dividerLabel?: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value * 10) / 10));

/**
 * Two images with a draggable divider: drag anywhere, or focus the handle and
 * use the arrow keys. The handle is a real `slider` with a percentage value,
 * so the comparison works without a pointer.
 */
export function BeforeAfter({
  before,
  after,
  value,
  defaultValue = 50,
  onValueChange,
  beforeLabel = "Before",
  afterLabel = "After",
  dividerLabel = "Reveal before and after",
  className,
  ...props
}: BeforeAfterProps) {
  const [internal, setInternal] = React.useState(() => clamp(defaultValue));
  const [dragging, setDragging] = React.useState(false);
  const surface = React.useRef<HTMLDivElement>(null);

  const current = value === undefined ? internal : clamp(value);

  const commit = (next: number) => {
    const clamped = clamp(next);
    if (value === undefined) setInternal(clamped);
    if (clamped !== current) onValueChange?.(clamped);
  };

  const positionAt = (clientX: number) => {
    const rect = surface.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const next = positionAt(event.clientX);
    if (next === null) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    commit(next);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const next = positionAt(event.clientX);
    if (next !== null) commit(next);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    const moves: Record<string, number> = {
      ArrowLeft: -step,
      ArrowDown: -step,
      ArrowRight: step,
      ArrowUp: step,
      PageDown: -10,
      PageUp: 10,
    };
    if (event.key === "Home") {
      event.preventDefault();
      commit(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      commit(100);
      return;
    }
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    commit(current + move);
  };

  return (
    <div
      {...props}
      ref={surface}
      role="group"
      aria-label="Image comparison"
      data-value={current}
      data-dragging={dragging || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "relative aspect-[4/3] w-full max-w-lg touch-none overflow-hidden rounded-box border border-line-strong bg-panel select-none",
        dragging ? "cursor-ew-resize" : "cursor-col-resize",
        className,
      )}
    >
      <img src={after.src} alt={after.alt} draggable={false} className="absolute inset-0 size-full object-cover" />
      <img
        src={before.src}
        alt={before.alt}
        draggable={false}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: `inset(0 ${100 - current}% 0 0)` }}
      />

      <span className="pointer-events-none absolute top-2 left-2 rounded-ui bg-surface px-1.5 py-0.5 text-xs text-ink-2 shadow-[inset_0_0_0_1px_var(--ui-line)]">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-2 right-2 rounded-ui bg-surface px-1.5 py-0.5 text-xs text-ink-2 shadow-[inset_0_0_0_1px_var(--ui-line)]">
        {afterLabel}
      </span>

      <div className="absolute inset-y-0 z-10 flex w-8 -translate-x-1/2 items-center justify-center" style={{ left: `${current}%` }}>
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink-3" />
        <div
          role="slider"
          tabIndex={0}
          aria-label={dividerLabel}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${Math.round(current)}% before, ${Math.round(100 - current)}% after`}
          onKeyDown={handleKeyDown}
          className={cn(
            "relative flex size-7 items-center justify-center rounded-ui bg-surface text-ink-2 outline-none",
            "shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 4 3 8l3 4M10 4l3 4-3 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
