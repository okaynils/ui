/*
 * Internal helpers shared by the overlay components (popover, menu, dialog,
 * tooltip, toast). Not exported from the package.
 */
import type * as React from "react";
import { cn } from "../lib/cn";

type StateClass<S> = string | ((state: S) => string | undefined) | undefined;

/** Merge library classes with a Base UI `className`, which may be a function of state. */
export function withClass<S>(base: string, className: StateClass<S>) {
  return (state: S) => cn(base, typeof className === "function" ? className(state) : className);
}

const icon = { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "aria-hidden": true } as const;

export function CheckGlyph(props: React.ComponentProps<"svg">) {
  return (
    <svg {...icon} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export function CaretRightGlyph(props: React.ComponentProps<"svg">) {
  return (
    <svg {...icon} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 3.5 4.5 4.5L6 12.5" />
    </svg>
  );
}

export function XGlyph(props: React.ComponentProps<"svg">) {
  return (
    <svg {...icon} strokeWidth={1.5} strokeLinecap="round" {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
