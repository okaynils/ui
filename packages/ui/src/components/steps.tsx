import type * as React from "react";
import { cn } from "../lib/cn";

export type StepState = "complete" | "current" | "upcoming" | "error";
export type StepsOrientation = "horizontal" | "vertical";

export interface StepItem {
  label: React.ReactNode;
  /** A quieter second line: what happens in this step, or why it failed. */
  description?: React.ReactNode;
  /** Overrides the state derived from `current`, e.g. `"error"` for a failed step. */
  state?: StepState;
}

export interface StepsProps extends Omit<React.ComponentProps<"ol">, "children"> {
  steps: readonly StepItem[];
  /** Index of the step in progress. Earlier steps are complete, later ones upcoming. Past the end means all done. */
  current?: number;
  orientation?: StepsOrientation;
  /** Makes completed steps buttons, so people can go back and revisit them. Upcoming steps are never clickable. */
  onStepClick?: (index: number, step: StepItem) => void;
}

const SPOKEN: Record<StepState, string> = {
  complete: "Completed",
  current: "Current",
  upcoming: "Upcoming",
  error: "Failed",
};

// The marker carries the state; the one accent on the row goes to "you are
// here", so completed steps stay neutral and don't compete with it.
const MARKER: Record<StepState, string> = {
  complete: "bg-active text-ink",
  current: "bg-accent text-on-accent",
  upcoming: "text-ink-3 shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
  error: "text-err shadow-[inset_0_0_0_1px_var(--ui-err)]",
};

const LABEL: Record<StepState, string> = {
  complete: "text-ink",
  current: "font-medium text-ink",
  upcoming: "text-ink-2",
  error: "font-medium text-ink",
};

function stateOf(step: StepItem, index: number, current: number): StepState {
  return step.state ?? (index < current ? "complete" : index === current ? "current" : "upcoming");
}

/**
 * Progress through a multi-step flow: numbered squares joined by hairlines.
 * The line behind you darkens; the step you're on is the accent.
 */
export function Steps({
  steps,
  current = 0,
  orientation = "horizontal",
  onStepClick,
  className,
  "aria-label": ariaLabel = "Progress",
  ...props
}: StepsProps) {
  const vertical = orientation === "vertical";
  const states = steps.map((step, index) => stateOf(step, index, current));

  return (
    <ol
      {...props}
      aria-label={ariaLabel}
      data-orientation={orientation}
      className={cn(vertical ? "flex flex-col" : "flex w-full items-start", className)}
    >
      {steps.map((step, index) => {
        const state = states[index]!;
        const last = index === steps.length - 1;
        // A connector counts as travelled once the step it leaves is done.
        const passed = state === "complete";
        const clickable = onStepClick !== undefined && state === "complete";

        const marker = (
          <span
            aria-hidden="true"
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-ui font-mono text-[11px] leading-none font-medium tabular-nums transition-colors duration-120",
              MARKER[state],
            )}
          >
            {state === "complete" ? <CheckIcon /> : state === "error" ? "!" : index + 1}
          </span>
        );

        const text = (
          <span className={cn("flex min-w-0 flex-col", vertical ? "pt-px" : "")}>
            <span className={cn("text-ui", LABEL[state])}>
              <span className="sr-only">{SPOKEN[state]}: </span>
              {step.label}
            </span>
            {step.description !== undefined ? (
              <span className={cn("text-xs", state === "error" ? "text-err" : "text-ink-2")}>{step.description}</span>
            ) : null}
          </span>
        );

        const head = clickable ? (
          <button
            type="button"
            onClick={() => onStepClick(index, step)}
            className="-m-1 flex min-w-0 items-start gap-2 rounded-ui p-1 text-left outline-none transition-colors duration-120 hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent"
          >
            {marker}
            {text}
          </button>
        ) : (
          <span className="flex min-w-0 items-start gap-2">
            {marker}
            {text}
          </span>
        );

        if (vertical) {
          return (
            <li key={index} aria-current={state === "current" ? "step" : undefined} data-state={state} className={cn("relative", !last && "pb-5")}>
              {head}
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn("absolute top-6 bottom-1 left-2.5 w-px -translate-x-1/2 transition-colors duration-120", passed ? "bg-ink-2" : "bg-line-strong")}
                />
              ) : null}
            </li>
          );
        }

        return (
          <li
            key={index}
            aria-current={state === "current" ? "step" : undefined}
            data-state={state}
            className={cn("flex min-w-0 items-start gap-3", !last && "flex-1")}
          >
            {head}
            {!last ? (
              <span
                aria-hidden="true"
                // Sits on the markers' centre line; min width keeps it visible when labels crowd it.
                className={cn("mt-2.5 mr-3 h-px min-w-4 flex-1 transition-colors duration-120", passed ? "bg-ink-2" : "bg-line-strong")}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}
