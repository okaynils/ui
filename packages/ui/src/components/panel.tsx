import type * as React from "react";
import { cn } from "../lib/cn";

export interface PanelProps extends Omit<React.ComponentProps<"section">, "title"> {
  /** What the panel holds, in sentence case: "Reservations". */
  title?: React.ReactNode;
  /** One quiet line under the title: scope, period, units. "All pools · Nov 1". */
  description?: React.ReactNode;
  /** Controls at the right end of the header row, e.g. a small ghost Button. */
  actions?: React.ReactNode;
  /** Content of a bottom row on a recessed tone, e.g. a hint and a Save button. */
  footer?: React.ReactNode;
  /** `surface` (white, default) or `panel` (recessed grey). */
  tone?: "surface" | "panel";
  /** Drop the body padding, for a `List` or table that runs edge to edge. */
  flush?: boolean;
}

/**
 * A grouped region with a hairline edge. This library's replacement for
 * "cards": no shadow, one ring, an optional header and footer row.
 */
export function Panel({ title, description, actions, footer, tone = "surface", flush = false, className, children, ...props }: PanelProps) {
  const hasHeader = title !== undefined || description !== undefined || actions !== undefined;
  return (
    <section
      {...props}
      className={cn(
        "overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line)]",
        tone === "panel" ? "bg-panel" : "bg-surface",
        className,
      )}
    >
      {hasHeader ? (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-line py-2 pr-2 pl-3">
          <div className="min-w-0">
            {title !== undefined ? <h3 className="truncate text-ui font-medium text-ink">{title}</h3> : null}
            {description !== undefined ? <p className="truncate text-ui text-ink-2">{description}</p> : null}
          </div>
          {actions !== undefined ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn(!flush && "p-3")}>{children}</div>
      {footer !== undefined ? (
        <footer
          className={cn(
            "flex min-h-11 items-center justify-between gap-3 border-t border-line py-2 pr-2 pl-3 text-ui text-ink-2",
            tone === "panel" ? "bg-surface" : "bg-panel",
          )}
        >
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
