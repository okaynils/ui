import type * as React from "react";
import { cn } from "../lib/cn";

export interface KbdProps extends React.ComponentProps<"kbd"> {}

/**
 * A keyboard key hint, e.g. <Kbd>⌘K</Kbd>. Display only. Put one per chord
 * (`⌘K`), or one per key when the sequence matters (`<Kbd>G</Kbd> <Kbd>I</Kbd>`).
 */
export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[3px] bg-panel px-1",
        "font-mono text-[11px] leading-none font-normal text-ink-2 tracking-normal",
        "shadow-[inset_0_0_0_1px_var(--ui-line-strong),inset_0_-1px_0_var(--ui-line-strong)]",
        className,
      )}
    />
  );
}
