import * as React from "react";
import { cn } from "../lib/cn";
import { buttonClassName } from "./button";

export type PaginationSize = "sm" | "md";

export interface PaginationLinkProps {
  href: string;
  className: string;
  children: React.ReactNode;
  "aria-label": string;
  "aria-current"?: "page";
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface PaginationProps extends Omit<React.ComponentProps<"nav">, "children" | "onChange"> {
  /** Number of pages. Fewer than 1 is treated as a single page. */
  pageCount: number;
  /** Current page, 1-based. Use with `onPageChange` for a controlled pagination. */
  page?: number;
  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current one before an ellipsis. Defaults to 1. */
  siblings?: number;
  /** Height 28 / 32px, matching Button `sm` / `md`. */
  size?: PaginationSize;
  /** "Page 3 of 12" with previous/next only, for narrow places. */
  compact?: boolean;
  /** Render pages as links to these URLs instead of buttons, e.g. `(page) => \`?page=${page}\``. */
  getHref?: (page: number) => string;
  /** With `getHref`, render each link yourself, e.g. for a router: `(props) => <Link to={props.href} {...props} />`. */
  renderLink?: (props: PaginationLinkProps) => React.ReactElement;
}

type Slot = number | "gap-start" | "gap-end";

/**
 * First, last, the current page and its siblings, with ellipses for the
 * gaps. The row is always the same number of slots, so the arrows don't
 * shift as you page through; a gap of one page shows that page instead of
 * an ellipsis, because "…" standing in for a single number is a lie.
 */
function slots(page: number, count: number, siblings: number): Slot[] {
  const width = siblings * 2 + 5;
  if (count <= width) return Array.from({ length: count }, (_, i) => i + 1);
  // The window around the current page stays clear of the slot next to
  // each end, which holds either an ellipsis or the one page it would hide.
  const start = Math.max(3, Math.min(page - siblings, count - siblings * 2 - 2));
  const end = Math.min(count - 2, Math.max(page + siblings, siblings * 2 + 3));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, start > 3 ? "gap-start" : 2, ...middle, end < count - 2 ? "gap-end" : count - 1, count];
}

const clamp = (value: number, count: number) => Math.min(count, Math.max(1, Math.round(Number.isFinite(value) ? value : 1)));

/**
 * Moves through pages of a list or table. Buttons by default; links with
 * `getHref`, so every page has a real URL.
 */
export function Pagination({
  pageCount,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  siblings = 1,
  size = "md",
  compact = false,
  getHref,
  renderLink,
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  const count = Math.max(1, Math.floor(Number.isFinite(pageCount) ? pageCount : 1));
  const [internal, setInternal] = React.useState(() => clamp(defaultPage, count));
  const page = clamp(pageProp ?? internal, count);

  const go = (next: number) => {
    if (next === page || next < 1 || next > count) return;
    if (pageProp === undefined) setInternal(next);
    onPageChange?.(next);
  };

  const control = (target: number, label: string, children: React.ReactNode, options: { current?: boolean; disabled?: boolean; square?: boolean }) => {
    const className = cn(
      buttonClassName({ variant: "ghost", size, icon: options.square }),
      // Numbers keep a square footprint at one or two digits and grow for more.
      !options.square && (size === "sm" ? "min-w-7 px-1.5" : "min-w-8 px-2"),
      "font-mono tabular-nums",
      options.current && "relative bg-active font-medium text-ink hover:bg-active",
    );
    const marker = options.current ? (
      // The accent square means "you are here", as on the active sidebar item.
      <span aria-hidden className="absolute bottom-1 left-1/2 h-0.5 w-2.5 -translate-x-1/2 rounded-[1px] bg-accent" />
    ) : null;
    const content = <>{children}{marker}</>;

    if (options.disabled) {
      // A disabled link isn't a link; it's a dimmed label that keeps the slot.
      return getHref ? (
        <span aria-disabled="true" aria-label={label} className={cn(className, "pointer-events-none opacity-45")}>{content}</span>
      ) : (
        <button type="button" disabled aria-label={label} className={className}>{content}</button>
      );
    }
    if (getHref) {
      const linkProps: PaginationLinkProps = {
        href: getHref(target),
        className,
        children: content,
        "aria-label": label,
        "aria-current": options.current ? "page" : undefined,
        onClick: () => go(target),
      };
      return renderLink ? renderLink(linkProps) : <a {...linkProps} />;
    }
    return (
      <button type="button" aria-label={label} aria-current={options.current ? "page" : undefined} onClick={() => go(target)} className={className}>
        {content}
      </button>
    );
  };

  const previous = control(page - 1, "Previous page", <Arrow direction="left" />, { disabled: page <= 1, square: true });
  const next = control(page + 1, "Next page", <Arrow direction="right" />, { disabled: page >= count, square: true });

  return (
    <nav {...props} aria-label={ariaLabel} data-size={size} className={cn("flex items-center", className)}>
      {compact ? (
        <div className="flex items-center gap-1">
          {previous}
          <span className={cn("px-1.5 tabular-nums", size === "sm" ? "text-xs" : "text-ui")}>
            <span className="text-ink-2">Page </span>
            <span className="font-mono text-ink">{page}</span>
            <span className="text-ink-2"> of </span>
            <span className="font-mono text-ink">{count}</span>
          </span>
          {next}
        </div>
      ) : (
        <ul className="flex items-center gap-0.5">
          <li>{previous}</li>
          {slots(page, count, Math.max(0, Math.floor(siblings))).map((slot) =>
            typeof slot === "number" ? (
              <li key={slot}>{control(slot, `Page ${slot}`, slot, { current: slot === page })}</li>
            ) : (
              <li key={slot} aria-hidden className={cn("grid place-items-center font-mono text-ink-3 select-none", size === "sm" ? "h-7 w-5 text-xs" : "h-8 w-6 text-ui")}>…</li>
            ),
          )}
          <li>{next}</li>
        </ul>
      )}
    </nav>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {direction === "left" ? <path d="M10 3.5 5.5 8l4.5 4.5" /> : <path d="M6 3.5 10.5 8 6 12.5" />}
    </svg>
  );
}
