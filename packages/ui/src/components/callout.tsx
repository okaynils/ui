import type * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { StatusDot, type StatusTone } from "./status";

export type CalloutTone = "neutral" | "info" | "ok" | "warn" | "err";

const DOT: Record<CalloutTone, StatusTone> = {
  neutral: "neutral",
  info: "accent",
  ok: "ok",
  warn: "warn",
  err: "err",
};

export interface CalloutProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Colours the dot only — the box stays panel grey. `info` is the accent blue. */
  tone?: CalloutTone;
  /** One short line in ink. */
  title?: React.ReactNode;
  /** Replaces the status dot, e.g. an icon. It is tinted in the tone colour. */
  icon?: React.ReactNode;
  /** One action, usually a `Button size="sm"`. */
  action?: React.ReactNode;
  /** Shows a close button. You own the state: hide the callout when this fires. */
  onDismiss?: () => void;
  /** `inline` is a box inside content; `banner` spans the top of a page with only a bottom hairline. */
  variant?: "inline" | "banner";
}

const ICON_TONE: Record<CalloutTone, string> = {
  neutral: "text-ink-3",
  info: "text-accent",
  ok: "text-ok",
  warn: "text-warn",
  err: "text-err",
};

/**
 * A note that sits in the page: a status dot, an ink title, ink-2 body text,
 * and optionally one action. Colour lives in the dot, never in a wash.
 */
export function Callout({
  tone = "neutral",
  title,
  icon,
  action,
  onDismiss,
  variant = "inline",
  className,
  children,
  ...props
}: CalloutProps) {
  const banner = variant === "banner";
  const marker = icon ? (
    <span className={cn("flex size-4 shrink-0 items-center justify-center [&_svg]:size-4", ICON_TONE[tone])}>{icon}</span>
  ) : (
    <span className="flex size-4 shrink-0 items-center justify-center">
      <StatusDot tone={DOT[tone]} />
    </span>
  );

  const dismiss = onDismiss ? (
    <Button variant="ghost" size="sm" icon aria-label="Dismiss" onClick={onDismiss} className="-my-1 -mr-1.5 text-ink-3">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden className="size-3.5">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </Button>
  ) : null;

  if (banner) {
    return (
      <div
        {...props}
        data-tone={tone}
        className={cn("flex min-h-10 w-full items-center gap-3 border-b border-line bg-panel px-4 py-2 text-ui", className)}
      >
        {marker}
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
          {title ? <span className="font-medium text-ink">{title}</span> : null}
          {children ? <span className="text-ink-2">{children}</span> : null}
        </div>
        {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        {dismiss}
      </div>
    );
  }

  return (
    <div
      {...props}
      data-tone={tone}
      className={cn(
        "flex w-full gap-3 rounded-box bg-panel p-3 text-ui shadow-[inset_0_0_0_1px_var(--ui-line)]",
        className,
      )}
    >
      <div className="flex h-5 items-center">{marker}</div>
      <div className="min-w-0 flex-1">
        {title ? <div className="font-medium text-ink">{title}</div> : null}
        {children ? <div className={cn("text-ink-2 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2", title && "mt-0.5")}>{children}</div> : null}
        {action ? <div className="mt-2.5 flex flex-wrap items-center gap-2">{action}</div> : null}
      </div>
      {dismiss ? <div className="flex h-5 items-center">{dismiss}</div> : null}
    </div>
  );
}
