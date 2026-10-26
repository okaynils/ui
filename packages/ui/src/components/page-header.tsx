import type * as React from "react";
import { cn } from "../lib/cn";

export interface PageHeaderProps extends Omit<React.ComponentProps<"header">, "title"> {
  /** The page's name. Rendered as the page's `<h1>`. */
  title: React.ReactNode;
  /** One sentence about what this page is for. */
  description?: React.ReactNode;
  /** A `<Breadcrumbs>` above the title, when the TopBar doesn't already carry them. */
  breadcrumbs?: React.ReactNode;
  /** Buttons on the right, primary last. Wraps under the title when space runs out. */
  actions?: React.ReactNode;
  /** A row of facts under the title: IDs, status, dates. Put each fact in its own element. */
  meta?: React.ReactNode;
  /** A hairline under the header, for pages whose content starts with a list or table. */
  bordered?: boolean;
}

/**
 * The top of a page: optional breadcrumbs, the title (26px), a description,
 * actions on the right, and a mono meta row of facts.
 */
export function PageHeader({ title, description, breadcrumbs, actions, meta, bordered = false, className, ...props }: PageHeaderProps) {
  return (
    <header {...props} className={cn("flex flex-col gap-3", bordered && "border-b border-line pb-5", className)}>
      {breadcrumbs}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1 basis-64">
          <h1 className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-balance text-ink">{title}</h1>
          {description !== undefined ? <p className="mt-1.5 max-w-[60ch] text-sm text-ink-2">{description}</p> : null}
        </div>
        {actions !== undefined ? <div className="flex shrink-0 flex-wrap items-center gap-2 pt-0.5">{actions}</div> : null}
      </div>
      {meta !== undefined ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-2 [&>*]:flex [&>*]:items-center [&>*]:gap-1.5">
          {meta}
        </div>
      ) : null}
    </header>
  );
}
