import type * as React from "react";
import { cn } from "../lib/cn";

export type SpinnerSize = "sm" | "md" | "lg";

const SIZE: Record<SpinnerSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-5",
};

export interface SpinnerProps extends Omit<React.ComponentProps<"svg">, "children"> {
  /** 12 / 14 / 20px. `md` matches text-ui. */
  size?: SpinnerSize;
  /**
   * What screen readers hear. Pass `""` when something else already says
   * the thing is busy (e.g. `aria-busy` on a button), so it isn't read twice.
   */
  label?: string;
}

/**
 * A small ring that turns once every 600ms. Linear on purpose: a spinner has
 * no start or end, so easing would read as stutter. Takes `currentColor`.
 */
export function Spinner({ size = "md", label = "Loading", className, ...props }: SpinnerProps) {
  const decorative = label === "";
  return (
    <svg
      viewBox="0 0 16 16"
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      {...props}
      className={cn(SIZE[size], "shrink-0 animate-spin [animation-duration:600ms] [animation-timing-function:linear]", className)}
    >
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
