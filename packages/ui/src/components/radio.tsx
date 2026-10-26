import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import * as React from "react";
import { cn } from "../lib/cn";

export interface RadioGroupProps<Value = string> extends Omit<BaseRadioGroup.Props<Value>, "className"> {
  /** Visible group label, linked with `aria-labelledby`. Rendered as a `ui-label`. */
  label?: React.ReactNode;
  /** Lay radios out in a row instead of a column. */
  orientation?: "vertical" | "horizontal";
  /** Layout classes only. */
  className?: string;
}

/** One choice out of a few (2–5) that should all be visible. Children are `Radio`s. */
export function RadioGroup<Value = string>({
  label,
  orientation = "vertical",
  className,
  children,
  ...props
}: RadioGroupProps<Value>) {
  const id = React.useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label !== undefined ? (
        <div id={id} className="ui-label">
          {label}
        </div>
      ) : null}
      <BaseRadioGroup
        aria-labelledby={label !== undefined ? id : undefined}
        {...props}
        className={cn("flex", orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap gap-x-5 gap-y-2")}
      >
        {children}
      </BaseRadioGroup>
    </div>
  );
}

export interface RadioProps<Value = string> extends Omit<BaseRadio.Root.Props<Value>, "className" | "children"> {
  /** Text next to the circle. The whole label is clickable. */
  label?: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

const circle = [
  "ui-press relative inline-grid size-4 shrink-0 cursor-default place-items-center rounded-full bg-surface",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-[background-color,box-shadow,transform] duration-120",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_20%)]",
  "data-checked:bg-accent data-checked:shadow-none",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "data-disabled:opacity-45",
].join(" ");

/** A single option inside a `RadioGroup`. */
export function Radio<Value = string>({ label, className, ...props }: RadioProps<Value>) {
  const control = (
    <BaseRadio.Root {...props} className={cn(circle, label === undefined && className)}>
      <BaseRadio.Indicator
        className={cn(
          "size-1.5 rounded-full bg-on-accent transition-[scale,opacity] duration-150 ease-snap",
          "data-starting-style:scale-0 data-starting-style:opacity-0 data-ending-style:scale-0 data-ending-style:opacity-0 data-ending-style:duration-100",
        )}
      />
    </BaseRadio.Root>
  );
  if (label === undefined) return control;
  return (
    <label
      className={cn(
        "inline-flex cursor-default items-center gap-2 text-ui text-ink select-none has-data-disabled:text-ink-3",
        className,
      )}
    >
      {control}
      {label}
    </label>
  );
}
