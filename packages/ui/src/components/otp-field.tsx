import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import * as React from "react";
import { cn } from "../lib/cn";

export interface OTPFieldProps
  extends Omit<BaseOTPField.Root.Props, "className" | "children" | "render" | "style" | "length"> {
  /** Number of characters. Default 6. */
  length?: number;
  /**
   * Visual groups, e.g. `[3, 3]` draws a dash between two groups of three.
   * Must add up to `length`. Purely visual — the value has no dash.
   */
  groups?: readonly number[];
  /** Layout classes only. */
  className?: string;
}

/**
 * A one-time code: one mono box per character. Typing advances, Backspace
 * goes back, and pasting a whole code fills every box. Works inside `Field`.
 */
export function OTPField({ length = 6, groups, className, ...props }: OTPFieldProps) {
  const plan = groups && groups.reduce((a, b) => a + b, 0) === length ? groups : [length];
  let index = 0;
  return (
    <BaseOTPField.Root
      length={length}
      autoComplete="one-time-code"
      {...props}
      className={cn("flex items-center gap-1.5", className)}
    >
      {plan.map((size, g) => (
        <React.Fragment key={g}>
          {g > 0 ? (
            <BaseOTPField.Separator className="mx-0.5 h-px w-2.5 shrink-0 bg-ink-3" />
          ) : null}
          {Array.from({ length: size }, () => {
            const i = index++;
            return (
              <BaseOTPField.Input
                key={i}
                aria-label={i === 0 ? undefined : `Character ${i + 1} of ${length}`}
                className={cn(
                  "size-9 shrink-0 rounded-ui bg-surface p-0 text-center font-mono text-base text-ink caret-accent outline-none",
                  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-shadow duration-120",
                  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_12%)]",
                  "focus:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
                  "data-invalid:shadow-[inset_0_0_0_1px_var(--ui-err)]",
                  "data-invalid:focus:shadow-[inset_0_0_0_1px_var(--ui-err),0_0_0_3px_color-mix(in_oklab,var(--ui-err)_18%,transparent)]",
                  "disabled:cursor-not-allowed disabled:opacity-45",
                )}
              />
            );
          })}
        </React.Fragment>
      ))}
    </BaseOTPField.Root>
  );
}
