import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import * as React from "react";
import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./button";
import { withClass } from "./overlay-utils";

export interface ToolbarProps extends BaseToolbar.Root.Props {
  /** `plain` sits flush in a bar; `panel` gets its own panel tone and hairline, for a floating or in-canvas toolbar. */
  variant?: "plain" | "panel";
}

/**
 * A row of related controls with one tab stop: Tab enters the toolbar, the
 * arrow keys move between its controls. Fill it with ToolbarButton,
 * ToolbarToggle, ToolbarGroup and ToolbarSeparator.
 */
export function Toolbar({ variant = "plain", className, ...props }: ToolbarProps) {
  return (
    <BaseToolbar.Root
      {...props}
      className={withClass(
        cn(
          "flex items-center gap-0.5 data-[orientation=vertical]:flex-col",
          variant === "panel" && "w-fit rounded-box bg-panel p-1 shadow-[inset_0_0_0_1px_var(--ui-line)]",
        ),
        className,
      )}
    />
  );
}

export type ToolbarGroupProps = BaseToolbar.Group.Props;

/** Controls that belong together (e.g. text alignment). Give it an `aria-label`. */
export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return <BaseToolbar.Group {...props} className={withClass("flex items-center gap-0.5 data-[orientation=vertical]:flex-col", className)} />;
}

export type ToolbarSeparatorProps = BaseToolbar.Separator.Props;

/** A short hairline between groups. */
export function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <BaseToolbar.Separator
      {...props}
      className={withClass(
        "mx-1 h-4 w-px shrink-0 bg-line-strong data-[orientation=horizontal]:mx-0 data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-4",
        className,
      )}
    />
  );
}

export interface ToolbarButtonProps extends Omit<ButtonProps, "render"> {
  /**
   * A popup trigger to merge with, so the toolbar button opens a menu or
   * popover: `render={<MenuTrigger />}`. It keeps the Button look.
   */
  render?: React.ReactElement<{ render?: React.ReactElement }>;
}

/**
 * A Button that joins the toolbar's arrow-key navigation. Defaults to
 * `ghost` / `sm`. Icon-only ones need an `aria-label` (and usually a Tooltip:
 * `<Tooltip content="Bold"><ToolbarButton … /></Tooltip>`).
 */
export function ToolbarButton({ variant = "ghost", size = "sm", render, ...props }: ToolbarButtonProps) {
  const button = <Button variant={variant} size={size} />;
  return <BaseToolbar.Button {...props} render={render ? React.cloneElement(render, { render: button }) : button} />;
}

export interface ToolbarToggleProps extends Omit<ButtonProps, "render" | "onClick"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Identifies the toggle inside a ToolbarGroup used as a toggle group. */
  value?: string;
}

/** An on/off button in the toolbar (bold, a view option). Pressed shows the active fill. */
export function ToolbarToggle({
  pressed,
  defaultPressed,
  onPressedChange,
  value,
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: ToolbarToggleProps) {
  return (
    <BaseToolbar.Button
      {...props}
      render={
        <BaseToggle
          pressed={pressed}
          defaultPressed={defaultPressed}
          onPressedChange={onPressedChange ? (next) => onPressedChange(next) : undefined}
          value={value}
          render={
            <Button
              variant={variant}
              size={size}
              className={cn("data-pressed:bg-active data-pressed:text-ink", typeof className === "string" ? className : undefined)}
            />
          }
        />
      }
    />
  );
}
