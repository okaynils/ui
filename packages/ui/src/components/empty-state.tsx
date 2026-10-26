import type * as React from "react";
import { cn } from "../lib/cn";

export interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** A single icon (16px), shown in a small hairline square. Optional. */
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
        <div className="mb-3 grid size-8 place-items-center rounded-ui bg-panel text-ink-2 shadow-[inset_0_0_0_1px_var(--ui-line-strong)] [&_svg:not([class*='size-'])]:size-4">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-ui text-ink-2">{description}</p> : null}
      {children ? <div className="mt-4 flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}
