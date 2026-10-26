import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type * as React from "react";
import { cn } from "../lib/cn";

export interface TooltipProviderProps {
  /** Hover time before the first tooltip opens, in ms. */
  delay?: number;
  /** After one closes, the next opens instantly if within this many ms. */
  timeout?: number;
  children?: React.ReactNode;
}

/**
 * Wrap a toolbar (or the whole app) so that once one tooltip is showing,
 * moving to the next shows it instantly — no second wait, no second animation.
 */
export function TooltipProvider({ delay = 500, timeout = 400, children }: TooltipProviderProps) {
  return (
    <BaseTooltip.Provider delay={delay} timeout={timeout}>
      {children}
    </BaseTooltip.Provider>
  );
}

export interface TooltipProps {
  /** The trigger: one element that accepts a ref and props, e.g. a `<Button icon>`. */
  children: React.ReactElement;
  /** What the tooltip says. Short: a name or a few words, never a sentence of help. */
  content: React.ReactNode;
  /** Keyboard hint shown after the text, e.g. "⌘,". Display only. */
  shortcut?: string;
  side?: BaseTooltip.Positioner.Props["side"];
  align?: BaseTooltip.Positioner.Props["align"];
  sideOffset?: number;
  /** Hover time before opening, in ms. Inherits from TooltipProvider when unset. */
  delay?: number;
  /** Don't show the tooltip (e.g. when the label is already visible). */
  disabled?: boolean;
  className?: string;
}

/**
 * A small dark label for an icon-only control. Opens on hover (after a beat)
 * or keyboard focus; never holds anything interactive.
 */
export function Tooltip({
  children,
  content,
  shortcut,
  side = "top",
  align = "center",
  sideOffset = 6,
  delay,
  disabled,
  className,
}: TooltipProps) {
  return (
    <BaseTooltip.Root disabled={disabled}>
      <BaseTooltip.Trigger render={children} delay={delay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset} className="z-60">
          <BaseTooltip.Popup
            className={cn(
              "flex h-6 items-center gap-2 rounded-ui bg-ink px-2 text-xs font-medium whitespace-nowrap text-surface",
              "origin-(--transform-origin) transition-[opacity,translate] duration-100 ease-snap data-ending-style:duration-75",
              "data-starting-style:opacity-0 data-ending-style:opacity-0",
              "data-[side=top]:data-starting-style:translate-y-0.5 data-[side=bottom]:data-starting-style:-translate-y-0.5",
              "data-[side=left]:data-starting-style:translate-x-0.5 data-[side=right]:data-starting-style:-translate-x-0.5",
              // Moving between tooltips in a group: no animation at all.
              "data-instant:transition-none",
              className,
            )}
          >
            {content}
            {shortcut ? <span className="-mr-0.5 font-mono text-[11px] font-normal text-surface/60">{shortcut}</span> : null}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
