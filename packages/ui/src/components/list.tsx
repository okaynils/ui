import * as React from "react";
import { cn } from "../lib/cn";

export interface ListProps extends React.ComponentProps<"ul"> {}

/** Flat rows separated by hairlines. Put it in a `Panel flush` for an edge, or use it bare. */
export function List({ className, ...props }: ListProps) {
  return <ul {...props} className={cn("flex flex-col divide-y divide-line", className)} />;
}

export interface ListItemProps extends Omit<React.ComponentProps<"li">, "title" | "onClick"> {
  /** Icon, avatar or StatusDot before the text. */
  leading?: React.ReactNode;
  title: React.ReactNode;
  /** A second line in ink-2. Truncated to one line. */
  description?: React.ReactNode;
  /** Short value right after the title on the same line, e.g. a mono ID. */
  meta?: React.ReactNode;
  /** Right-aligned content: a Kbd, a mono value, a chevron, a small ghost Button. */
  trailing?: React.ReactNode;
  /** Makes the whole row a link. */
  href?: string;
  /** Makes the whole row a button. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Render the pressable part as another element, e.g. a router `<Link to="…" />`. */
  render?: React.ReactElement<Record<string, unknown>>;
  /** Marks the row as the current one: active fill and a 2px accent edge. */
  selected?: boolean;
  disabled?: boolean;
}

/**
 * One row. Pass `href`, `onClick` or `render` and the whole row becomes the
 * pressable — it answers with tone, never scale.
 */
export function ListItem({
  leading,
  title,
  description,
  meta,
  trailing,
  href,
  onClick,
  render,
  selected = false,
  disabled = false,
  className,
  ...props
}: ListItemProps) {
  const interactive = href !== undefined || onClick !== undefined || render !== undefined;

  const content = (
    <>
      {leading !== undefined ? (
        <span className="flex shrink-0 items-center text-ink-2 [&_svg:not([class*='size-'])]:size-4">{leading}</span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="truncate text-ui font-medium text-ink">{title}</span>
          {meta !== undefined ? <span className="shrink-0 font-mono text-xs text-ink-3">{meta}</span> : null}
        </span>
        {description !== undefined ? <span className="truncate text-xs text-ink-2">{description}</span> : null}
      </span>
      {trailing !== undefined ? (
        <span className="flex shrink-0 items-center gap-2 text-xs text-ink-2 [&_svg:not([class*='size-'])]:size-4">{trailing}</span>
      ) : null}
    </>
  );

  const rowClass = cn(
    "relative flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left",
    selected && "bg-active before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:bg-accent",
  );

  if (!interactive) {
    return (
      <li {...props} aria-current={selected || undefined} className={cn(rowClass, className)}>
        {content}
      </li>
    );
  }

  // Hover eases in on the shared 120ms curve; keyboard focus lands instantly,
  // because focus follows the arrow keys and any lag there reads as sluggish.
  const pressableClass = cn(
    rowClass,
    "cursor-default outline-none transition-colors duration-120",
    !selected && "hover:bg-hover focus-visible:bg-hover",
    "focus-visible:transition-none focus-visible:shadow-[inset_0_0_0_1px_var(--ui-accent)]",
    disabled && "pointer-events-none opacity-45",
  );

  const shared = {
    className: pressableClass,
    onClick,
    "aria-current": selected ? ("page" as const) : undefined,
    "aria-disabled": disabled || undefined,
  };

  let pressable: React.ReactNode;
  if (render) {
    const own = render.props as { className?: string };
    pressable = React.cloneElement(render, { ...shared, className: cn(pressableClass, own.className), children: content });
  } else if (href !== undefined) {
    pressable = (
      <a href={disabled ? undefined : href} {...shared}>
        {content}
      </a>
    );
  } else {
    pressable = (
      <button type="button" disabled={disabled} {...shared}>
        {content}
      </button>
    );
  }

  return (
    <li {...props} className={cn("flex", className)}>
      {pressable}
    </li>
  );
}
