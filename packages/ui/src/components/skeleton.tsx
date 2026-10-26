import * as React from "react";
import { cn } from "../lib/cn";

export interface SkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Milliseconds to stay invisible before showing. Default 300. Most loads
   * finish before then, and a skeleton that blinks in and out for 80ms reads
   * as a glitch — so fast loads show nothing at all. The space is reserved
   * either way, so nothing jumps.
   */
  delay?: number;
  /** Render N text-like lines (the last one shorter) instead of one block. */
  lines?: number;
}

/**
 * A quiet placeholder for content that's loading. Size it with classes
 * (`h-4 w-40`) to match what's coming.
 */
export function Skeleton({ delay = 300, lines, className, ...props }: SkeletonProps) {
  const [visible, setVisible] = React.useState(delay <= 0);
  React.useEffect(() => {
    if (delay <= 0) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const block = cn(
    "rounded-[3px] bg-hover transition-opacity duration-150",
    visible ? "animate-pulse opacity-100 [animation-duration:2s] motion-reduce:animate-none" : "opacity-0",
  );

  if (lines !== undefined) {
    return (
      <div {...props} aria-hidden className={cn("flex w-full flex-col gap-2", className)}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={cn(block, "h-3", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
        ))}
      </div>
    );
  }
  return <div {...props} aria-hidden className={cn(block, "h-4 w-full", className)} />;
}
