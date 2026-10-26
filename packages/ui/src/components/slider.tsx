import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "../lib/cn";

export interface SliderProps
  extends Omit<BaseSlider.Root.Props<number | readonly number[]>, "className" | "children" | "render" | "style"> {
  /** Show the current value (formatted with `format`) in mono at the right. */
  showValue?: boolean;
  /** Values to draw tick marks at, e.g. `[0, 25, 50, 75, 100]`. */
  marks?: readonly number[];
  /** Print each mark's value under its tick. */
  markLabels?: boolean;
  /**
   * Accessible names, one per thumb. Required for range sliders
   * (`["Minimum price", "Maximum price"]`); for a single thumb without a
   * surrounding `Field` label, pass one.
   */
  thumbLabels?: readonly string[];
  /** Layout classes (e.g. `w-64`). Defaults to full width. */
  className?: string;
}

/**
 * Pick a number (or a range, with an array value) by dragging. Arrow keys
 * step, ⇧/PageUp take large steps. For exact entry, pair it with — or use —
 * `NumberField`.
 */
export function Slider({
  showValue = false,
  marks,
  markLabels = false,
  thumbLabels,
  className,
  min = 0,
  max = 100,
  defaultValue,
  value,
  ...props
}: SliderProps) {
  const initial = value ?? defaultValue ?? min;
  const thumbCount = Array.isArray(initial) ? initial.length : 1;
  const percent = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <BaseSlider.Root
      {...props}
      min={min}
      max={max}
      defaultValue={defaultValue}
      value={value}
      className={cn("group/slider w-full min-w-0 data-disabled:opacity-45", className)}
    >
      <div className="flex items-center gap-3">
        <BaseSlider.Control className="flex h-5 min-w-0 flex-1 touch-none items-center select-none data-disabled:cursor-not-allowed">
          <BaseSlider.Track className="relative h-1 w-full rounded-[1px] bg-active select-none">
            <BaseSlider.Indicator className="rounded-[1px] bg-accent select-none group-data-disabled/slider:bg-ink-3" />
            {marks?.map((mark) => (
              <span
                key={mark}
                aria-hidden
                className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-line-strong"
                style={{ left: `${percent(mark)}%` }}
              />
            ))}
            {Array.from({ length: thumbCount }, (_, index) => (
              <BaseSlider.Thumb
                key={index}
                index={thumbCount > 1 ? index : undefined}
                aria-label={thumbLabels?.[index]}
                className={cn(
                  "size-3.5 rounded-[3px] bg-surface select-none",
                  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
                  "transition-[box-shadow,scale] duration-120 ease-snap",
                  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_25%)]",
                  "data-dragging:scale-110 data-dragging:shadow-[inset_0_0_0_1px_var(--ui-accent)]",
                  "has-[:focus-visible]:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_22%,transparent)]",
                  "group-data-disabled/slider:shadow-[inset_0_0_0_1px_var(--ui-line-strong)]",
                )}
              />
            ))}
          </BaseSlider.Track>
        </BaseSlider.Control>
        {showValue ? (
          <BaseSlider.Value className="min-w-[4ch] shrink-0 text-right font-mono text-xs text-ink-2 tabular-nums" />
        ) : null}
      </div>
      {marks && markLabels ? (
        <div aria-hidden className={cn("relative mt-1 h-4 select-none", showValue && "mr-[calc(4ch+0.75rem)]")}>
          {marks.map((mark) => (
            <span
              key={mark}
              className="absolute -translate-x-1/2 font-mono text-[11px] text-ink-3 tabular-nums"
              style={{ left: `${percent(mark)}%` }}
            >
              {mark}
            </span>
          ))}
        </div>
      ) : null}
    </BaseSlider.Root>
  );
}
