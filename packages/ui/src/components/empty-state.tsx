import type * as React from "react";
import { cn } from "../lib/cn";

export interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** A single icon (18px), shown on a small grey tile. Optional. */
  icon?: React.ReactNode;
  /** The fact, as a short sentence: "No projects yet." */
  title: React.ReactNode;
  /** One sentence on why it's empty or what will appear here. */
  description?: React.ReactNode;
  /** The next action, usually one Button. Put it in `children`. */
  children?: React.ReactNode;
  align?: "start" | "center";
}

/** What a list, table or page shows when there is nothing in it. Quiet; no illustrations. */
export function EmptyState({ icon, title, description, align = "center", className, children, ...props }: EmptyStateProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col py-10",
        align === "center" ? "items-center px-6 text-center" : "items-start",
        className,
      )}
    >
      {icon ? (
        <div className="mb-3 grid size-9 place-items-center rounded-box bg-hover text-ink-2 [&_svg:not([class*='size-'])]:size-[18px]">
          {icon}
        </div>
      ) : null}
      <p className="text-ui font-semibold text-ink">{title}</p>
      {description ? <p className="mt-0.5 max-w-sm text-ui text-ink-2">{description}</p> : null}
      {children ? <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}
