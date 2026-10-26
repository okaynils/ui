import { Select as BaseSelect } from "@base-ui/react/select";
import type * as React from "react";
import { cn } from "../lib/cn";
import { fieldSurface, popupItem, popupList, popupSurface } from "../lib/surfaces";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectItemData<Value> {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<Value> {
  /** The options, in order. */
  items: readonly SelectItemData<Value>[];
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null) => void;
  /** Shown in ink-3 while nothing is selected. */
  placeholder?: React.ReactNode;
  /** Height 28 / 32 / 36px, matching Button and Input. */
  size?: SelectSize;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  /** Needed when there's no visible label (no surrounding `Field`). */
  "aria-label"?: string;
  /** Layout classes for the trigger (e.g. `w-48`). Defaults to full width. */
  className?: string;
}

/**
 * Pick one option from a list that's too long (or too unimportant) to show
 * all at once. For 2–5 always-visible options, use `SegmentedControl` or
 * `RadioGroup`. For actions, use `Menu`.
 */
export function Select<Value>({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  size = "md",
  name,
  disabled,
  required,
  className,
  "aria-label": ariaLabel,
}: SelectProps<Value>) {
  return (
    <SelectRoot<Value>
      items={items as SelectItemData<Value>[]}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(v as Value | null)}
      name={name}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger size={size} placeholder={placeholder} aria-label={ariaLabel} className={className} />
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={String(item.value)} value={item.value} disabled={item.disabled}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

/* ---- Parts, for groups, separators or custom item content ---- */

export type SelectRootProps<Value> = BaseSelect.Root.Props<Value, false>;

/** State and behaviour. Pass `items` so the trigger can show the selected label. */
export function SelectRoot<Value>(props: SelectRootProps<Value>) {
  return <BaseSelect.Root<Value, false> {...props} />;
}

const TRIGGER_SIZE: Record<SelectSize, string> = {
  sm: "h-7 gap-1.5 pl-2 pr-1.5 text-xs",
  md: "h-8 gap-2 pl-2.5 pr-2 text-ui",
  lg: "h-9 gap-2 pl-3 pr-2 text-sm",
};

export interface SelectTriggerProps extends Omit<BaseSelect.Trigger.Props, "className" | "children"> {
  size?: SelectSize;
  placeholder?: React.ReactNode;
  /** Layout classes only. */
  className?: string;
}

/** The button that shows the current value and opens the list. */
export function SelectTrigger({ size = "md", placeholder, className, ...props }: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      {...props}
      className={cn(
        fieldSurface,
        TRIGGER_SIZE[size],
        "flex w-full min-w-0 cursor-default items-center justify-between text-left select-none",
        "focus-visible:outline-none data-popup-open:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
        className,
      )}
    >
      <BaseSelect.Value placeholder={placeholder} className="min-w-0 truncate data-placeholder:text-ink-3" />
      <BaseSelect.Icon className="flex shrink-0 text-ink-3">
        <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
          <path d="m5 6.5 3-3 3 3M5 9.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export interface SelectContentProps extends Omit<BaseSelect.Popup.Props, "className"> {
  /** Layout classes for the popup (e.g. a fixed width). */
  className?: string;
}

/** The floating list. Opens under the trigger, at least as wide as it. */
export function SelectContent({ className, children, ...props }: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50 outline-none select-none">
        <BaseSelect.Popup
          {...props}
          className={cn(popupSurface, "min-w-(--anchor-width)", className)}
        >
          <BaseSelect.List className={cn(popupList, "max-h-[min(var(--available-height),20rem)] scroll-py-1 overflow-y-auto")}>
            {children}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export interface SelectItemProps extends Omit<BaseSelect.Item.Props, "className"> {
  className?: string;
}

/** One option. The selected one gets a check on the right. */
export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item {...props} className={cn(popupItem, "pr-8", className)}>
      <BaseSelect.ItemText className="min-w-0 truncate">{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="absolute right-2 flex text-ink">
        <svg viewBox="0 0 16 16" className="size-3.5 text-ink!" aria-hidden="true">
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export interface SelectGroupProps extends Omit<BaseSelect.Group.Props, "className"> {
  /** Group heading, rendered as a `ui-label`. */
  label?: React.ReactNode;
  className?: string;
}

export function SelectGroup({ label, className, children, ...props }: SelectGroupProps) {
  return (
    <BaseSelect.Group {...props} className={cn("[&+&]:mt-1", className)}>
      {label !== undefined ? <BaseSelect.GroupLabel className="ui-label px-2 pt-1.5 pb-1">{label}</BaseSelect.GroupLabel> : null}
      {children}
    </BaseSelect.Group>
  );
}

export function SelectSeparator({ className, ...props }: Omit<BaseSelect.Separator.Props, "className"> & { className?: string }) {
  return <BaseSelect.Separator {...props} className={cn("-mx-1 my-1 h-px bg-line", className)} />;
}
