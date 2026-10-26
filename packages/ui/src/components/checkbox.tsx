import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type * as React from "react";
import { cn } from "../lib/cn";

export interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, "className" | "children"> {
  /** Text next to the box. The whole label is clickable. */
  label?: React.ReactNode;
  /** Layout classes only. Applied to the label when `label` is set, otherwise to the box. */
  className?: string;
}

const box = [
  "group/checkbox ui-press relative inline-grid size-4 shrink-0 cursor-default place-items-center rounded-[3px] bg-surface",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-[background-color,box-shadow,transform] duration-120",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_20%)]",
  "data-checked:bg-accent data-checked:shadow-none data-indeterminate:bg-accent data-indeterminate:shadow-none",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "data-invalid:shadow-[inset_0_0_0_1px_var(--ui-err)]",
  "data-disabled:opacity-45",
].join(" ");

/**
 * A square checkbox. On = accent fill with a white check that scales in.
 * Supports `indeterminate` for "some of these".
 */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  const control = (
    <BaseCheckbox.Root {...props} className={cn(box, label === undefined && className)}>
      <BaseCheckbox.Indicator
        className={cn(
          "grid place-items-center text-on-accent transition-[scale,opacity] duration-150 ease-snap",
          "data-starting-style:scale-50 data-starting-style:opacity-0 data-ending-style:scale-50 data-ending-style:opacity-0 data-ending-style:duration-100",
        )}
      >
        <svg viewBox="0 0 12 12" className="size-3 group-data-indeterminate/checkbox:hidden" aria-hidden="true">
          <path d="M2.5 6.25 4.9 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg viewBox="0 0 12 12" className="hidden size-3 group-data-indeterminate/checkbox:block" aria-hidden="true">
          <path d="M3 6h6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
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
