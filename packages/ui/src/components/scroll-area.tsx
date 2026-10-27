import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import type * as React from "react";
import { cn } from "../lib/cn";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps extends Omit<BaseScrollArea.Root.Props, "className" | "children"> {
  /** Which way the content scrolls. */
  orientation?: ScrollAreaOrientation;
  /**
   * Fade the edges that have more content past them. Only an edge with
   * something hidden fades, and the fade grows as you scroll away from it.
   */
  fade?: boolean;
  /** Length of the edge fade in px. */
  fadeSize?: number;
  /** Classes on the root. Give it a height (or width) to scroll within; layout classes only. */
  className?: string;
  /** Classes on the content wrapper, e.g. padding. */
  contentClassName?: string;
  children?: React.ReactNode;
}

// Each fade reads Base UI's distance-to-edge variables, so an edge with
// nothing past it stays sharp, and the fade grows over the first few pixels
// of scroll instead of popping in. The end-side fallback shows the fade
// before hydration, when there's almost always more content below.
function edgeMask(axis: "x" | "y", size: number) {
  const direction = axis === "y" ? "to bottom" : "to right";
  const start = `var(--scroll-area-overflow-${axis}-start, 0px)`;
  const end = `var(--scroll-area-overflow-${axis}-end, ${size}px)`;
  return `linear-gradient(${direction}, transparent 0, #000 min(${size}px, ${start}), #000 calc(100% - min(${size}px, ${end})), transparent 100%)`;
}

const scrollbar = [
  // Overlay scrollbars: hidden until the pointer is over the area or it's
  // scrolling, so they never take space from content or draw attention.
  "pointer-events-none flex touch-none p-0.5 opacity-0 select-none transition-opacity duration-150",
  "data-hovering:pointer-events-auto data-hovering:opacity-100",
  // Appear on the frame the scroll starts; only the fade-out is animated.
  "data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0",
  "data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col",
].join(" ");

const thumb = [
  "relative flex-1 rounded-[2px] bg-ink-3/60 transition-colors duration-120",
  "hover:bg-ink-3 active:bg-ink-2",
  // A wider invisible hit area than the 6px bar you see.
  "before:absolute before:-inset-1",
].join(" ");

/**
 * A scroll container with thin overlay scrollbars and optional edge fades.
 * The browser does the scrolling, so wheel, touch, keyboard and find-in-page
 * all behave natively; only the scrollbar is drawn.
 */
export function ScrollArea({
  orientation = "vertical",
  fade = true,
  fadeSize = 24,
  className,
  contentClassName,
  children,
  ...props
}: ScrollAreaProps) {
  const vertical = orientation !== "horizontal";
  const horizontal = orientation !== "vertical";
  const masks = fade ? [vertical && edgeMask("y", fadeSize), horizontal && edgeMask("x", fadeSize)].filter(Boolean).join(", ") : "";
  const maskStyle: React.CSSProperties | undefined = masks
    ? {
        maskImage: masks,
        WebkitMaskImage: masks,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        // Both fades must apply at once: a corner fades on both axes.
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }
    : undefined;

  return (
    <BaseScrollArea.Root
      {...props}
      className={cn(
        "relative min-h-0 overflow-hidden",
        // The ring lives on the root: the viewport's mask would clip an outline drawn on it.
        "has-[>[data-ui-scroll-viewport]:focus-visible]:outline-2 has-[>[data-ui-scroll-viewport]:focus-visible]:outline-offset-2 has-[>[data-ui-scroll-viewport]:focus-visible]:outline-accent",
        className,
      )}
    >
      <BaseScrollArea.Viewport
        data-ui-scroll-viewport=""
        style={maskStyle}
        className={cn(
          "h-full max-h-[inherit] overscroll-contain outline-none",
          // Base UI sets overflow inline, so only an !important class can clip the other axis.
          !vertical && "overflow-y-hidden!",
          !horizontal && "overflow-x-hidden!",
        )}
      >
        <BaseScrollArea.Content className={cn(!horizontal && "min-w-0", contentClassName)}>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {vertical ? (
        <BaseScrollArea.Scrollbar orientation="vertical" className={scrollbar}>
          <BaseScrollArea.Thumb className={thumb} />
        </BaseScrollArea.Scrollbar>
      ) : null}
      {horizontal ? (
        <BaseScrollArea.Scrollbar orientation="horizontal" className={scrollbar}>
          <BaseScrollArea.Thumb className={thumb} />
        </BaseScrollArea.Scrollbar>
      ) : null}
      {vertical && horizontal ? <BaseScrollArea.Corner /> : null}
    </BaseScrollArea.Root>
  );
}
