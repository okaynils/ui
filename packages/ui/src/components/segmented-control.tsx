import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import * as React from "react";
import { cn } from "../lib/cn";

export type SegmentedControlSize = "sm" | "md";

export interface SegmentedControlItem<Value extends string = string> {
  value: Value;
  label: React.ReactNode;
  /** Required when `label` is icon-only. */
  "aria-label"?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<Value extends string = string> {
  items: readonly SegmentedControlItem<Value>[];
  /** The selected value. Use with `onValueChange` for a controlled control. */
  value?: Value;
  /** Initial value when uncontrolled. Defaults to the first item. */
  defaultValue?: Value;
  onValueChange?: (value: Value) => void;
  /** Height 28 / 32px, matching Button `sm` / `md`. */
  size?: SegmentedControlSize;
  disabled?: boolean;
  /** Stretch to the container and split it evenly. */
  fill?: boolean;
  "aria-label"?: string;
  /** Layout classes only. */
  className?: string;
}

const SIZE: Record<SegmentedControlSize, string> = {
  sm: "h-7 text-xs",
  md: "h-8 text-ui",
};

/**
 * Pick one of 2–5 short options, all visible: a view mode, a time range, a
 * unit. The selected segment is a raised tile that slides to the new choice,
 * so the eye follows the change. One option is always selected.
 */
export function SegmentedControl<Value extends string = string>({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = "md",
  disabled,
  fill = false,
  className,
  ...aria
}: SegmentedControlProps<Value>) {
  const [uncontrolled, setUncontrolled] = React.useState<Value | undefined>(defaultValue ?? items[0]?.value);
  const value = valueProp !== undefined ? valueProp : uncontrolled;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState<{ x: number; w: number } | null>(null);
  // The first placement must not animate (it would slide in from 0 on mount).
  const [animate, setAnimate] = React.useState(false);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const el = root.querySelector<HTMLElement>("[data-pressed]");
      setIndicator(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [value, items]);

  React.useEffect(() => {
    if (indicator && !animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [indicator, animate]);

  return (
    <ToggleGroup
      ref={rootRef}
      {...aria}
      disabled={disabled}
      value={value !== undefined ? [value] : []}
      onValueChange={(next) => {
        // Single choice that can't be emptied: ignore "unpress the current one".
        const v = next[0] as Value | undefined;
        if (v === undefined || v === value) return;
        if (valueProp === undefined) setUncontrolled(v);
        onValueChange?.(v);
      }}
      className={cn(
        "relative isolate inline-flex items-stretch rounded-ui bg-panel p-0.5",
        "shadow-[inset_0_0_0_1px_var(--ui-line)] data-disabled:opacity-45",
        SIZE[size],
        fill && "flex w-full",
        className,
      )}
    >
      {indicator ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 bottom-0.5 left-0 -z-10 rounded-[3px] bg-surface",
            "shadow-[0_0_0_1px_var(--ui-line-strong),0_1px_2px_rgb(0_0_0/0.05)]",
            animate && "transition-[translate,width] duration-180 ease-snap",
          )}
          style={{ translate: `${indicator.x}px 0`, width: indicator.w }}
        />
      ) : null}
      {items.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          aria-label={item["aria-label"]}
          className={cn(
            "inline-flex min-w-0 cursor-default items-center justify-center gap-1.5 rounded-[3px] px-2.5 font-medium whitespace-nowrap select-none",
            "text-ink-2 transition-colors duration-120 hover:text-ink data-pressed:text-ink",
            "outline-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-accent",
            "data-disabled:opacity-45",
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            fill && "flex-1",
          )}
        >
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
