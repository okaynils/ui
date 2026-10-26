import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type * as React from "react";
import { cn } from "../lib/cn";

export interface SwitchProps extends Omit<BaseSwitch.Root.Props, "className" | "children"> {
  /** Text before the switch. The whole label is clickable. */
  label?: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

const track = [
  "relative inline-flex h-[18px] w-[30px] shrink-0 cursor-default items-center rounded-full p-0.5",
  "bg-line-strong transition-colors duration-150 ease-snap data-checked:bg-accent",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "data-disabled:opacity-45",
].join(" ");

/**
 * An on/off setting that takes effect immediately. If the change only
 * applies after "Save", use a `Checkbox` instead.
 */
export function Switch({ label, className, ...props }: SwitchProps) {
  const control = (
    <BaseSwitch.Root {...props} className={cn(track, label === undefined && className)}>
      <BaseSwitch.Thumb
        className={cn(
          "block size-3.5 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2),0_0_0_0.5px_rgb(0_0_0/0.06)]",
          "transition-transform duration-150 ease-snap data-checked:translate-x-3",
        )}
      />
    </BaseSwitch.Root>
  );
  if (label === undefined) return control;
  return (
    <label
      className={cn(
        "inline-flex cursor-default items-center justify-between gap-3 text-ui text-ink select-none has-data-disabled:text-ink-3",
        className,
      )}
    >
      {label}
      {control}
    </label>
  );
}
