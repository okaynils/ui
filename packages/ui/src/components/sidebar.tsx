import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { cn } from "../lib/cn";
import { SidebarNavigateContext } from "./shell-context";

export interface SidebarProps extends React.ComponentProps<"nav"> {}

/**
 * The navigation column: panel tone, full height, scrolls on its own.
 * Inside an AppShell it gets its width and hairline from the shell; on its
 * own, give it a width.
 */
export function Sidebar({ className, "aria-label": ariaLabel = "Main", ...props }: SidebarProps) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn("flex h-full min-h-0 w-full flex-col overflow-y-auto overscroll-contain bg-panel", className)}
    />
  );
}

export interface SidebarHeaderProps extends React.ComponentProps<"div"> {}

/** The top row (48px, the same height as a TopBar): brand on the left, maybe a version or button on the right. */
export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return <div {...props} className={cn("flex h-12 shrink-0 items-center justify-between gap-2 px-4", className)} />;
}

export interface SidebarSectionProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Section label in the `ui-label` voice. Omit for the first, unlabelled group. */
  label?: React.ReactNode;
  /** A small control beside the label, e.g. an icon-only "+" Button (size sm). */
  action?: React.ReactNode;
}

/** A group of items with an optional mono label. Sections are separated by space, not lines. */
export function SidebarSection({ label, action, className, children, ...props }: SidebarSectionProps) {
  const id = React.useId();
  return (
    <div {...props} className={cn("px-2 pb-4 first:pt-1", className)}>
      {label !== undefined || action !== undefined ? (
        <div className="flex h-6 items-center justify-between pr-0.5 pl-2">
          {label !== undefined ? (
            <div id={id} className="ui-label truncate">
              {label}
            </div>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      <ul aria-labelledby={label !== undefined ? id : undefined} className="flex flex-col">
        {children}
      </ul>
    </div>
  );
}

export interface SidebarItemProps extends Omit<useRender.ComponentProps<"button">, "children"> {
  /** Leading icon (16px). */
  icon?: React.ReactNode;
  /** The label. Keep it to one or two words. */
  children: React.ReactNode;
  /**
   * Shown at the end. A number or short string renders as a mono count;
   * anything else (a Kbd, a StatusDot) renders as-is.
   */
  trailing?: React.ReactNode;
  /** The current page. Marks it with the active fill and the accent square, and sets `aria-current`. */
  active?: boolean;
  /** Render as a link. For a router link, use `render={<Link to="…" />}` instead. */
  href?: string;
  disabled?: boolean;
}

/**
 * One row in the sidebar: a link with `href` (or `render`), otherwise a
 * button. 28px tall; answers hover with tone, never scale.
 */
export function SidebarItem({
  icon,
  trailing,
  active = false,
  href,
  disabled,
  render,
  className,
  children,
  onClick,
  ...props
}: SidebarItemProps) {
  const onNavigate = React.useContext(SidebarNavigateContext);
  const isLink = href !== undefined || render !== undefined;
  const element = useRender({
    defaultTagName: href !== undefined ? "a" : "button",
    render,
    props: mergeProps<"button">(
      ({
        ...(href !== undefined ? { href } : {}),
        ...(!isLink ? { type: "button" as const, disabled } : {}),
        "aria-current": active ? (isLink ? "page" : "true") : undefined,
        "aria-disabled": isLink && disabled ? true : undefined,
        "data-active": active ? "" : undefined,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          if (isLink && disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
          if (!event.defaultPrevented) onNavigate?.();
        },
        className: cn(
          "group/item relative flex h-7 w-full min-w-0 cursor-default select-none items-center gap-2 rounded-ui px-2 text-left text-ui",
          "outline-none transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          active
            ? "bg-active font-medium text-ink"
            : "text-ink-2 hover:bg-hover hover:text-ink [&_svg]:text-ink-3 hover:[&_svg]:text-ink-2",
          disabled && "pointer-events-none opacity-45",
          typeof className === "string" ? className : undefined,
        ),
        children: (
          <>
            {active ? <span aria-hidden className="absolute top-1/2 -left-1.5 size-1 -translate-y-1/2 bg-accent" /> : null}
            {icon}
            <span className="min-w-0 flex-1 truncate">{children}</span>
            {trailing !== undefined && trailing !== null ? (
              typeof trailing === "string" || typeof trailing === "number" ? (
                <span className="shrink-0 font-mono text-[11px] text-ink-3 tabular-nums">{trailing}</span>
              ) : (
                <span className="flex shrink-0 items-center">{trailing}</span>
              )
            ) : null}
          </>
        ),
      }) as React.ComponentProps<"button">,
      props,
    ),
  });
  return <li className="flex">{element}</li>;
}

export interface SidebarFooterProps extends React.ComponentProps<"div"> {}

/** Pinned to the bottom of the sidebar on a hairline: account, settings, theme. */
export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      {...props}
      className={cn("sticky bottom-0 mt-auto flex shrink-0 flex-col gap-0.5 border-t border-line bg-panel p-2", className)}
    />
  );
}
