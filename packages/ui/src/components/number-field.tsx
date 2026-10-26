import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import type * as React from "react";
import { cn } from "../lib/cn";

export type NumberFieldSize = "sm" | "md" | "lg";

export interface NumberFieldProps
  extends Omit<BaseNumberField.Root.Props, "className" | "children" | "render" | "style"> {
  /**
   * A short label inside the field, before the number (e.g. "W", "X", or an
   * icon). Drag it left/right to scrub the value — the cursor turns to ↔.
   */
  leading?: React.ReactNode;
  /** Unit after the number, in ink-3 (e.g. "px", "GB", "%"). Display only — use `format` for currency/percent formatting. */
  unit?: React.ReactNode;
  /** Show − / + buttons at the right edge. */
  steppers?: boolean;
  /** Pixels of drag per step while scrubbing. Lower is faster. */
  scrubSensitivity?: number;
  /** Height 28 / 32 / 36px, matching Button and Input. */
  size?: NumberFieldSize;
  placeholder?: string;
  /** Needed when there's no visible label (no surrounding `Field`). */
  "aria-label"?: string;
  /** Layout classes for the field (e.g. `w-32`). Defaults to full width. */
  className?: string;
}

const SIZE: Record<NumberFieldSize, string> = {
  sm: "h-7 text-xs",
  md: "h-8 text-ui",
  lg: "h-9 text-sm",
};

// Spelled out per side so Tailwind sees every class.
const PAD_L: Record<NumberFieldSize, string> = { sm: "pl-2", md: "pl-2.5", lg: "pl-3" };
const PAD_R: Record<NumberFieldSize, string> = { sm: "pr-2", md: "pr-2.5", lg: "pr-3" };

const groupSurface = [
  "rounded-ui bg-surface text-ink",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-shadow duration-120",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_12%)]",
  "has-[input:focus]:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
  "has-[input[data-invalid]]:shadow-[inset_0_0_0_1px_var(--ui-err)]",
  "has-[input[data-invalid]:focus]:shadow-[inset_0_0_0_1px_var(--ui-err),0_0_0_3px_color-mix(in_oklab,var(--ui-err)_18%,transparent)]",
  "data-disabled:cursor-not-allowed data-disabled:opacity-45",
].join(" ");

const stepper =
  "ui-press flex h-full w-7 shrink-0 cursor-default items-center justify-center text-ink-2 outline-none select-none hover:bg-hover hover:text-ink data-disabled:pointer-events-none data-disabled:opacity-45";

/**
 * A number input. Arrow keys step (⇧ ×10, ⌥ ×0.1), the wheel scrubs while
 * focused, and dragging the `leading` label scrubs like a design tool.
 * Works inside `Field`.
 */
export function NumberField({
  leading,
  unit,
  steppers = false,
  scrubSensitivity = 2,
  size = "md",
  placeholder,
  className,
  "aria-label": ariaLabel,
  ...props
}: NumberFieldProps) {
  return (
    <BaseNumberField.Root {...props} className={cn("w-full min-w-0", className)}>
      <BaseNumberField.Group className={cn(groupSurface, SIZE[size], "flex w-full min-w-0 items-stretch overflow-hidden")}>
        {leading !== undefined ? (
          <BaseNumberField.ScrubArea
            pixelSensitivity={scrubSensitivity}
            className={cn(
              "flex shrink-0 cursor-ew-resize items-center pr-1 font-mono text-[11px] text-ink-3 select-none hover:text-ink-2 data-scrubbing:text-accent",
              "[&>svg]:size-3.5",
              PAD_L[size],
            )}
          >
            {leading}
            <BaseNumberField.ScrubAreaCursor>
              <ScrubCursor />
            </BaseNumberField.ScrubAreaCursor>
          </BaseNumberField.ScrubArea>
        ) : null}
        <BaseNumberField.Input
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(
            "h-full w-full min-w-0 bg-transparent text-ink tabular-nums outline-none placeholder:text-ink-3 disabled:cursor-not-allowed",
            leading !== undefined ? "pl-1" : PAD_L[size],
            unit !== undefined || steppers ? "pr-1" : PAD_R[size],
          )}
        />
        {unit !== undefined ? (
          <span className={cn("flex shrink-0 items-center text-ink-3 select-none", steppers ? "pr-2" : PAD_R[size])}>
            {unit}
          </span>
        ) : null}
        {steppers ? (
          <span className="flex shrink-0 border-l border-line-strong">
            <BaseNumberField.Decrement aria-label="Decrease" className={stepper}>
              <MinusIcon />
            </BaseNumberField.Decrement>
            <BaseNumberField.Increment aria-label="Increase" className={cn(stepper, "border-l border-line")}>
              <PlusIcon />
            </BaseNumberField.Increment>
          </span>
        ) : null}
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** The ↔ shown in place of the pointer while scrubbing (the real one is locked). */
function ScrubCursor() {
  return (
    <svg width="24" height="14" viewBox="0 0 24 14" aria-hidden="true">
      <path
        d="M18.5 5.5H5.5V2L1 7l4.5 5V8.5h13V12L23 7l-4.5-5v3.5Z"
        fill="var(--ui-ink)"
        stroke="var(--ui-surface)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
