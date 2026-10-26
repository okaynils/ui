import { Input as BaseInput } from "@base-ui/react/input";
import type * as React from "react";
import { cn } from "../lib/cn";
import { fieldSurface } from "../lib/surfaces";

export interface TextareaProps extends Omit<React.ComponentProps<"textarea">, "className"> {
  /** Grow with the content (CSS `field-sizing: content`) instead of scrolling. Cap it with `className="max-h-60"`. */
  autoGrow?: boolean;
  /** Layout classes only. */
  className?: string;
}

/**
 * A multi-line text field. Works inside `Field`. Resizes vertically by hand,
 * or grows with its content when `autoGrow` is set.
 */
export function Textarea({ autoGrow = false, rows = 3, className, ...props }: TextareaProps) {
  return (
    <BaseInput
      render={<textarea rows={rows} {...props} />}
      className={cn(
        fieldSurface,
        "block w-full min-w-0 px-2.5 py-1.5 leading-5",
        autoGrow ? "field-sizing-content min-h-[calc(3*20px+14px)] resize-none" : "resize-y",
        className,
      )}
    />
  );
}
