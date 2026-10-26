import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type * as React from "react";
import { cn } from "../lib/cn";

export interface SeparatorProps extends Omit<BaseSeparator.Props, "children"> {
  /** Short text set into the line, in the `ui-label` voice. Horizontal only. */
  label?: React.ReactNode;
  /** Where the label sits on the line. */
  align?: "start" | "center";
  ref?: React.Ref<HTMLDivElement>;
}

/** A hairline between groups of content. Horizontal by default. */
export function Separator({ orientation = "horizontal", label, align = "start", className, ...props }: SeparatorProps) {
  if (label !== undefined && orientation === "horizontal") {
    return (
      <BaseSeparator
        {...props}
        orientation={orientation}
        className={(state) =>
          cn(
            "flex w-full items-center gap-3",
            "before:h-px before:bg-line after:h-px after:flex-1 after:bg-line",
            align === "center" ? "before:flex-1" : "before:w-3 before:shrink-0",
            typeof className === "function" ? className(state) : className,
          )
        }
      >
        <span className="ui-label shrink-0">{label}</span>
      </BaseSeparator>
    );
  }
  return (
    <BaseSeparator
      {...props}
      orientation={orientation}
      className={(state) =>
        cn(
          "shrink-0 bg-line",
          orientation === "vertical" ? "w-px self-stretch" : "h-px w-full",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}
