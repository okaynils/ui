import * as React from "react";
import { cn } from "../lib/cn";
import { Menu, MenuContent, MenuLinkItem, MenuTrigger } from "./menu";

export interface BreadcrumbItem {
  label: React.ReactNode;
  /** Omit on the last item (the current page). */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<React.ComponentProps<"nav">, "children"> {
  /** From the root to the current page. The last item is the current page. */
  items: BreadcrumbItem[];
  /**
   * Longest trail shown in full. Longer trails keep the first item and the
   * last `maxItems - 1`, and fold the middle into a "…" menu.
   */
  maxItems?: number;
  /**
   * Render a link yourself, e.g. for a router: `(item, props) => <Link to={item.href} {...props} />`.
   * Defaults to a plain `<a>`.
   */
  renderLink?: (item: BreadcrumbItem, props: { className: string; children: React.ReactNode }) => React.ReactElement;
}

const link = "max-w-[18ch] truncate rounded-[2px] text-ink-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * Where you are, as a trail of links: `Projects / turbine / Settings`.
 * Ink-2 links, faint slashes, the current page in ink.
 */
export function Breadcrumbs({ items, maxItems = 4, renderLink, className, ...props }: BreadcrumbsProps) {
  const fold = items.length > maxItems && maxItems >= 2;
  const head = fold ? items.slice(0, 1) : items;
  const hidden = fold ? items.slice(1, items.length - (maxItems - 1)) : [];
  const tail = fold ? items.slice(items.length - (maxItems - 1)) : [];

  const renderItem = (item: BreadcrumbItem, current: boolean) => {
    if (current || item.href === undefined) {
      return (
        <span aria-current={current ? "page" : undefined} className={cn("max-w-[24ch] truncate", current ? "font-medium text-ink" : "text-ink-2")}>
          {item.label}
        </span>
      );
    }
    const linkProps = { className: link, children: item.label };
    return renderLink ? renderLink(item, linkProps) : <a href={item.href} {...linkProps} />;
  };

  const all: React.ReactNode[] = [];
  const push = (key: string, node: React.ReactNode) => {
    if (all.length > 0) {
      all.push(
        <li key={`${key}-sep`} aria-hidden className="shrink-0 text-line-strong select-none">
          /
        </li>,
      );
    }
    all.push(
      <li key={key} className="flex min-w-0 items-center">
        {node}
      </li>,
    );
  };

  head.forEach((item, i) => push(`h${i}`, renderItem(item, !fold && i === items.length - 1)));
  if (fold) {
    push(
      "fold",
      <Menu>
        <MenuTrigger
          aria-label={`${hidden.length} more`}
          className="rounded-[2px] px-0.5 font-mono text-ink-3 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent data-popup-open:text-ink"
        >
          …
        </MenuTrigger>
        <MenuContent>
          {hidden.map((item, i) => (
            <MenuLinkItem key={i} href={item.href}>
              {item.label}
            </MenuLinkItem>
          ))}
        </MenuContent>
      </Menu>,
    );
    tail.forEach((item, i) => push(`t${i}`, renderItem(item, i === tail.length - 1)));
  }

  return (
    <nav aria-label="Breadcrumb" {...props} className={cn("min-w-0 text-ui", className)}>
      <ol className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">{all}</ol>
    </nav>
  );
}
