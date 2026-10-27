import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import * as React from "react";
import { cn } from "../lib/cn";
import { buttonClassName } from "./button";

export type ToggleSize = "sm" | "md";
export type ToggleVariant = "outline" | "ghost";

export interface ToggleProps extends Omit<BaseToggle.Props, "className" | "onPressedChange"> {
  /** Height 28 / 32px, matching Button `sm` / `md`. Inside a ToggleGroup, the group decides. */
  size?: ToggleSize;
  /** `outline` stands alone; `ghost` sits in a row of controls. Inside a ToggleGroup, the group decides. */
  variant?: ToggleVariant;
  /** Square, icon-only toggle. Give it an `aria-label`. */
  icon?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Layout classes only. */
  className?: string;
}

// Pressed is a tone, not a colour: bg-active + ink. Accent is reserved for the
// one primary action and "you are here", and a row of pressed toggles would
// otherwise spend it several times over.
const pressed = "data-pressed:bg-active data-pressed:text-ink data-pressed:hover:bg-active";

interface GroupContext {
  size: ToggleSize;
  variant: ToggleGroupVariant;
}

const ToggleGroupContext = React.createContext<GroupContext | null>(null);

/**
 * A button that stays pressed: bold, pin, mute, "show archived". On and off
 * are the only states, and the change applies immediately.
 */
export function Toggle({ size, variant, icon = false, onPressedChange, className, ...props }: ToggleProps) {
  const group = React.useContext(ToggleGroupContext);
  const resolvedSize = group?.size ?? size ?? "md";
  return (
    <BaseToggle
      {...props}
      onPressedChange={onPressedChange ? (next) => onPressedChange(next) : undefined}
      className={cn(
        group?.variant === "outline"
          // Inside a framed group the tiles fill its height, with corners
          // concentric to the frame (4px − 2px padding).
          ? cn(
              buttonClassName({ variant: "ghost", size: resolvedSize, icon }),
              "h-full rounded-[2px]",
              icon ? "aspect-square size-auto" : resolvedSize === "sm" ? "px-2" : "px-2.5",
            )
          : buttonClassName({ variant: group ? "ghost" : (variant ?? "outline"), size: resolvedSize, icon }),
        pressed,
        className,
      )}
    />
  );
}

export type ToggleGroupVariant = "plain" | "outline";

export interface ToggleGroupProps extends Omit<BaseToggleGroup.Props, "className"> {
  /** Height of every toggle in the group, 28 / 32px. */
  size?: ToggleSize;
  /** `plain` is a loose row of ghost toggles, like a toolbar group; `outline` frames them as one control. */
  variant?: ToggleGroupVariant;
  /** Layout classes only. */
  className?: string;
}

/**
 * Toggles that share one value: an array of the pressed toggles' `value`s.
 * Single choice by default (pressing one releases the others, and pressing
 * the pressed one empties the group); `multiple` lets several stay pressed.
 * One tab stop, arrow keys between items.
 */
export function ToggleGroup({ size = "md", variant = "plain", className, ...props }: ToggleGroupProps) {
  const context = React.useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <ToggleGroupContext.Provider value={context}>
      <BaseToggleGroup
        {...props}
        className={cn(
          "inline-flex items-center gap-0.5 data-[orientation=vertical]:flex-col",
          variant === "outline" && cn(
            "items-stretch rounded-ui bg-surface p-0.5 shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
            size === "sm" ? "h-7" : "h-8",
          ),
          className,
        )}
      />
    </ToggleGroupContext.Provider>
  );
}
