import type * as React from "react";
import { cn } from "../lib/cn";

export type StatusTone = "ok" | "warn" | "err" | "accent" | "neutral";

const TONE: Record<StatusTone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  err: "bg-err",
  accent: "bg-accent",
  neutral: "bg-ink-3",
};

export interface StatusDotProps extends React.ComponentProps<"span"> {
  tone?: StatusTone;
  /** A slow opacity breath that means "live right now". Use for at most one thing per view. */
  pulse?: boolean;
}

/** A 6px status dot. The colour carries the meaning; pair it with a word (see `Status`). */
export function StatusDot({ tone = "neutral", pulse = false, className, ...props }: StatusDotProps) {
  return (
    <span
      aria-hidden
      {...props}
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        TONE[tone],
        pulse && "animate-pulse [animation-duration:2.4s] motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export interface StatusProps extends React.ComponentProps<"span"> {
  tone?: StatusTone;
  pulse?: boolean;
}

/** Dot + word: `● Online`. The word stays ink; only the dot is coloured. */
export function Status({ tone = "neutral", pulse, className, children, ...props }: StatusProps) {
  return (
    <span {...props} className={cn("inline-flex items-center gap-2 text-ui text-ink", className)}>
      <StatusDot tone={tone} pulse={pulse} />
      {children}
    </span>
  );
}
