import { Input as BaseInput } from "@base-ui/react/input";
import type * as React from "react";
import { cn } from "../lib/cn";
import { fieldSurface } from "../lib/surfaces";

export type InputSize = "sm" | "md" | "lg";

const SIZE: Record<InputSize, string> = {
  sm: "h-7 px-2 text-xs",
  md: "h-8 px-2.5 text-ui",
  lg: "h-9 px-3 text-sm",
};

// The adorned variant draws the field on a wrapper, so the ring follows the
// inner input's focus and validity. Kept literal so Tailwind can see it.
const adornedSurface = [
  "rounded-ui bg-surface text-ink",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-shadow duration-120",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_12%)]",
  "has-[input:focus-visible]:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
  "has-[input[data-invalid]]:shadow-[inset_0_0_0_1px_var(--ui-err)]",
  "has-[input[data-invalid]:focus-visible]:shadow-[inset_0_0_0_1px_var(--ui-err),0_0_0_3px_color-mix(in_oklab,var(--ui-err)_18%,transparent)]",
  "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-45",
].join(" ");

const ADORNED_SIZE: Record<InputSize, string> = {
  sm: "h-7 gap-1.5 px-2 text-xs",
  md: "h-8 gap-2 px-2.5 text-ui",
  lg: "h-9 gap-2 px-3 text-sm",
};

export interface InputProps extends Omit<BaseInput.Props, "size" | "className"> {
  /** Height 28 / 32 / 36px, matching Button sizes. */
  size?: InputSize;
  /** Content before the text: an icon or a short unit like "$". Rendered in ink-3. */
  leading?: React.ReactNode;
  /** Content after the text: a unit like "kg", a Kbd hint, or an icon. Rendered in ink-3. */
  trailing?: React.ReactNode;
  /** Layout classes. Applied to the wrapper when `leading`/`trailing` are set. */
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * A single-line text field. Works inside `Field` (label, description and
 * error wire up automatically).
 */
export function Input({ size = "md", leading, trailing, className, ...props }: InputProps) {
  if (leading === undefined && trailing === undefined) {
    return <BaseInput {...props} className={cn(fieldSurface, "w-full min-w-0", SIZE[size], className)} />;
  }
  return (
    <div
      className={cn(
        adornedSurface,
        ADORNED_SIZE[size],
        "flex w-full min-w-0 items-center",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      {leading !== undefined ? <span className="flex shrink-0 items-center text-ink-3 select-none">{leading}</span> : null}
      <BaseInput
        {...props}
        className="h-full w-full min-w-0 bg-transparent text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed"
      />
      {trailing !== undefined ? <span className="flex shrink-0 items-center text-ink-3 select-none">{trailing}</span> : null}
    </div>
  );
}
