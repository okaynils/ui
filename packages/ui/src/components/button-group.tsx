import type * as React from "react";
import { cn } from "../lib/cn";

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  /** What the group does, for screen readers: "Export". */
  "aria-label"?: string;
}

/**
 * Buttons joined into one control: a split button ("Export summary" + a caret
 * that opens more formats) or a small set of related actions. Children are
 * `Button`s (or `MenuTrigger`s rendering one) of the same variant and size.
 */
export function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      {...props}
      className={cn(
        "isolate inline-flex items-stretch",
        // Inner corners square off; the 1px overlap merges two hairlines into one.
        "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        // Lift the hovered or focused button so its whole ring shows.
        "[&>*:focus-visible]:z-10 [&>*:hover]:z-10",
        className,
      )}
    />
  );
}
