import { Button as BaseButton } from "@base-ui/react/button";
import type * as React from "react";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

export type ButtonVariant = "primary" | "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  // The one action a screen wants you to take. At most one per view.
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  // A committing action that isn't *the* action (e.g. inside a dialog next to primary-less flows).
  solid: "bg-ink text-surface hover:bg-ink/85",
  // The default. A hairline contains it without adding weight.
  outline: "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--ui-line-strong)] hover:bg-hover",
  // Toolbars, rows, inline actions. No fill until hover.
  ghost: "text-ink-2 hover:bg-hover hover:text-ink",
  // Destructive. Red text on a hairline; red only says "this deletes".
  danger: "bg-surface text-err shadow-[inset_0_0_0_1px_var(--ui-line-strong)] hover:bg-err/8",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-7 gap-1.5 px-2.5 text-xs",
  md: "h-8 gap-2 px-3 text-ui",
  lg: "h-9 gap-2 px-3.5 text-sm",
};

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: "size-7",
  md: "size-8",
  lg: "size-9",
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square, icon-only button. Give it an `aria-label`. */
  icon?: boolean;
}

/**
 * The button's classes, for an element that must stay something else
 * (e.g. a router `<Link>`) but should look and press exactly like a Button.
 */
export function buttonClassName({ variant = "outline", size = "md", icon = false }: ButtonStyleOptions = {}): string {
  return cn(
    "ui-press relative inline-flex shrink-0 cursor-default select-none items-center justify-center whitespace-nowrap rounded-ui font-medium",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:pointer-events-none disabled:opacity-45 data-disabled:pointer-events-none data-disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    icon ? cn(ICON_SIZE[size], "p-0") : SIZE[size],
    VARIANT[variant],
  );
}

export interface ButtonProps extends BaseButton.Props, ButtonStyleOptions {
  /** Shows a spinner and blocks interaction; the label keeps its width. */
  loading?: boolean;
  /** Keyboard hint rendered at the end, e.g. "⌘S". Display only — bind the key yourself. */
  shortcut?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * The pressable. Defaults to `outline`/`md`. Use `variant="primary"` for the
 * single main action of a view.
 */
export function Button({
  variant = "outline",
  size = "md",
  icon = false,
  loading = false,
  shortcut,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      className={(state) =>
        cn(
          buttonClassName({ variant, size, icon }),
          loading && "pointer-events-none opacity-100",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {loading ? (
        <>
          <span className="invisible inline-flex items-center gap-[inherit]">{children}</span>
          <span className="absolute inset-0 grid place-items-center">
            <Spinner />
          </span>
        </>
      ) : (
        children
      )}
      {shortcut && !icon ? (
        <Kbd className={cn("-mr-1", variant === "primary" && "bg-white/15 text-on-accent/80 shadow-none")}>{shortcut}</Kbd>
      ) : null}
    </BaseButton>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 animate-spin [animation-duration:600ms]" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
