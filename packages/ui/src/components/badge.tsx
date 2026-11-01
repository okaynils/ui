import type * as React from "react";
import { cn } from "../lib/cn";
import { StatusDot, type StatusTone } from "./status";

export interface BadgeProps extends React.ComponentProps<"span"> {
  /** Adds a leading status dot. The badge itself is never filled with colour. */
  tone?: StatusTone;
  /** Mono type, for IDs, versions, hashes and counts. */
  mono?: boolean;
}

/**
 * A 20px label for a count, a state or a tag: `v0.1.0`, `3`, `● Beta`.
 * A faint grey tile and ink-2 text — so many of them on a screen stay quiet.
 */
export function Badge({ tone, mono = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-ui px-1.5 whitespace-nowrap text-ink-2",
        "bg-hover",
        mono ? "font-mono text-[11px] tabular-nums" : "text-xs font-medium",
        "[&_svg]:size-3 [&_svg]:shrink-0",
        className,
      )}
    >
      {tone ? <StatusDot tone={tone} /> : null}
      {children}
    </span>
  );
}
