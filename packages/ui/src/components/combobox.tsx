import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import * as React from "react";
import { cn } from "../lib/cn";
import { popupItem, popupList, popupSurface } from "../lib/surfaces";

export type ComboboxSize = "sm" | "md" | "lg";

export interface ComboboxItem {
  /** What `value` / `onValueChange` deal in. */
  value: string;
  /** Shown in the list and the field; also what typing filters against. */
  label: string;
  /** Optional icon before the label. */
  icon?: React.ReactNode;
  /** Short secondary text after the label, in ink-3 (e.g. a code or count). */
  description?: string;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  /** The options. Filtered as the user types (case-insensitive, label and description). */
  items: readonly ComboboxItem[];
  /** Let the user add what they typed: Enter (or picking "Create …") adds it as a value. */
  creatable?: boolean;
  /** Shown in ink-3 while the field is empty. */
  placeholder?: string;
  /** Height of the single-value field: 28 / 32 / 36px, matching Button and Input. */
  size?: ComboboxSize;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  /** Text shown when nothing matches. */
  emptyText?: React.ReactNode;
  /** Needed when there's no visible label (no surrounding `Field`). */
  "aria-label"?: string;
  /** Layout classes for the field (e.g. `w-64`). Defaults to full width. */
  className?: string;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  /** Pick several. Picked values show as chips inside the field. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

/** Internal item shape; `create` marks the synthetic "Create …" row. */
interface Entry extends ComboboxItem {
  create?: boolean;
}

const CREATE_PREFIX = "\u0000create:";

const SIZE: Record<ComboboxSize, string> = {
  sm: "h-7 px-2 text-xs",
  md: "h-8 px-2.5 text-ui",
  lg: "h-9 px-3 text-sm",
};

// The field is drawn on the input group, so the ring follows the inner
// input's focus and validity — the same recipe as an adorned Input.
const groupSurface = [
  "rounded-ui bg-surface text-ink",
  "shadow-[inset_0_0_0_1px_var(--ui-line-strong)] transition-shadow duration-120",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ui-line-strong),var(--ui-ink)_12%)]",
  "has-[input:focus]:shadow-[inset_0_0_0_1px_var(--ui-accent),0_0_0_3px_color-mix(in_oklab,var(--ui-accent)_18%,transparent)]",
  "has-[input[data-invalid]]:shadow-[inset_0_0_0_1px_var(--ui-err)]",
  "has-[input[data-invalid]:focus]:shadow-[inset_0_0_0_1px_var(--ui-err),0_0_0_3px_color-mix(in_oklab,var(--ui-err)_18%,transparent)]",
  "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-45",
].join(" ");

/**
 * A text field with a filtered list of options. Pick one, or pass `multiple`
 * to pick several (shown as chips). With `creatable`, typing something new and
 * pressing Enter adds it — that's the tag input.
 */
export function Combobox(props: ComboboxProps) {
  const {
    items,
    creatable = false,
    placeholder,
    size = "md",
    name,
    disabled,
    required,
    emptyText = "No matches.",
    className,
    "aria-label": ariaLabel,
  } = props;
  const multiple = props.multiple === true;

  // Selection is kept as plain string values; Base UI gets item objects.
  const controlled = props.value !== undefined;
  const [inner, setInner] = React.useState<string[]>(() => toArray(props.defaultValue));
  const selected = controlled ? toArray(props.value) : inner;
  const [query, setQuery] = React.useState("");

  // Values that aren't in `items` (created, or set from outside) still need
  // an item so they render as chips and show their check.
  const allItems = React.useMemo<Entry[]>(() => {
    const known = new Set(items.map((i) => i.value));
    const extra = selected.filter((v) => !known.has(v)).map((v) => ({ value: v, label: v }));
    return [...items, ...extra];
  }, [items, selected]);

  const byValue = React.useMemo(() => new Map(allItems.map((i) => [i.value, i])), [allItems]);

  const trimmed = query.trim();
  const showCreate =
    creatable &&
    trimmed !== "" &&
    !allItems.some((i) => i.label.toLocaleLowerCase() === trimmed.toLocaleLowerCase());
  const listItems: Entry[] = showCreate
    ? [...allItems, { value: CREATE_PREFIX + trimmed, label: trimmed, create: true }]
    : allItems;

  const commit = (values: string[]) => {
    if (!controlled) setInner(values);
    if (multiple) (props as ComboboxMultipleProps).onValueChange?.(values);
    else (props as ComboboxSingleProps).onValueChange?.(values[0] ?? null);
  };

  const resolve = (entry: Entry) => (entry.create ? entry.label : entry.value);

  const filter = (item: Entry, q: string) => {
    if (item.create) return true;
    const needle = q.trim().toLocaleLowerCase();
    if (needle === "") return true;
    return (
      item.label.toLocaleLowerCase().includes(needle) ||
      (item.description?.toLocaleLowerCase().includes(needle) ?? false)
    );
  };

  const selectedEntries = selected.map((v) => byValue.get(v) ?? { value: v, label: v });

  const list = (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={4} className="z-50 outline-none">
        <BaseCombobox.Popup className={cn(popupSurface, "w-(--anchor-width) min-w-48 max-w-(--available-width)")}>
          <BaseCombobox.Empty className="px-3 py-2.5 text-ui text-ink-3 empty:hidden">{emptyText}</BaseCombobox.Empty>
          <BaseCombobox.List
            className={cn(
              popupList,
              "max-h-[min(var(--available-height),20rem)] scroll-py-1 overflow-y-auto overscroll-contain data-empty:hidden",
            )}
          >
            {(item: Entry) =>
              item.create ? (
                <BaseCombobox.Item key={item.value} value={item} className={cn(popupItem, "text-ink-2")}>
                  <PlusIcon />
                  <span className="min-w-0 truncate">
                    Create <span className="text-ink">“{item.label}”</span>
                  </span>
                </BaseCombobox.Item>
              ) : (
                <BaseCombobox.Item key={item.value} value={item} disabled={item.disabled} className={cn(popupItem, "pr-8")}>
                  {item.icon}
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.description ? (
                    <span className="ml-auto shrink-0 truncate pl-2 font-mono text-[11px] text-ink-3">{item.description}</span>
                  ) : null}
                  <BaseCombobox.ItemIndicator className="absolute right-2 flex">
                    <CheckIcon />
                  </BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )
            }
          </BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );

  const rootShared = {
    items: listItems,
    filter,
    autoHighlight: true,
    isItemEqualToValue: (a: Entry, b: Entry) => a.value === b.value,
    itemToStringLabel: (item: Entry) => item.label,
    itemToStringValue: (item: Entry) => resolve(item),
    onInputValueChange: (v: string) => setQuery(v),
    name,
    disabled,
    required,
  };

  if (multiple) {
    return (
      <BaseCombobox.Root<Entry, true>
        {...rootShared}
        multiple
        value={selectedEntries}
        onValueChange={(next, details) => {
          // Base UI clears the selection on Escape when the list is closed;
          // with chips that throws away work, so Escape only ever closes.
          if (details.reason === "escape-key") return;
          commit(next.map(resolve).filter((v, i, all) => all.indexOf(v) === i));
          if (next.some((e) => e.create)) setQuery("");
        }}
      >
        <BaseCombobox.InputGroup
          className={cn(
            groupSurface,
            "flex min-h-8 w-full min-w-0 cursor-text flex-wrap items-center gap-1 px-1 py-1 text-ui",
            className,
          )}
        >
          <BaseCombobox.Chips className="contents">
            {selectedEntries.map((entry) => (
              <BaseCombobox.Chip
                key={entry.value}
                aria-label={entry.label}
                className={cn(
                  "flex h-6 max-w-full cursor-default items-center gap-1 rounded-[3px] bg-active pr-0.5 pl-1.5 text-xs text-ink outline-none select-none",
                  "focus-within:bg-ink focus-within:text-surface data-highlighted:bg-ink data-highlighted:text-surface",
                )}
              >
                {entry.icon ? <span className="flex shrink-0 [&_svg]:size-3.5">{entry.icon}</span> : null}
                <span className="min-w-0 truncate">{entry.label}</span>
                <BaseCombobox.ChipRemove
                  aria-label={`Remove ${entry.label}`}
                  className="flex size-5 shrink-0 items-center justify-center rounded-[2px] text-current opacity-60 hover:bg-ink/10 hover:opacity-100"
                >
                  <XIcon />
                </BaseCombobox.ChipRemove>
              </BaseCombobox.Chip>
            ))}
          </BaseCombobox.Chips>
          <BaseCombobox.Input
            placeholder={selectedEntries.length === 0 ? placeholder : undefined}
            aria-label={ariaLabel}
            onKeyDown={(e) => {
              // Backspace in an empty input takes back the last chip.
              if (e.key === "Backspace" && e.currentTarget.value === "" && selected.length > 0) {
                commit(selected.slice(0, -1));
              }
            }}
            className="h-6 min-w-16 flex-1 bg-transparent px-1.5 text-ui text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed"
          />
        </BaseCombobox.InputGroup>
        {list}
      </BaseCombobox.Root>
    );
  }

  return (
    <BaseCombobox.Root<Entry>
      {...rootShared}
      value={selectedEntries[0] ?? null}
      onValueChange={(next, details) => {
        if (details.reason === "escape-key") return;
        commit(next ? [resolve(next)] : []);
      }}
    >
      <BaseCombobox.InputGroup className={cn(groupSurface, "relative flex w-full min-w-0 items-center", className)}>
        <BaseCombobox.Input
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(
            SIZE[size],
            "w-full min-w-0 bg-transparent pr-8 text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed",
          )}
        />
        <BaseCombobox.Trigger
          aria-label="Show options"
          className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-ink-3 outline-none hover:text-ink-2"
        >
          <ChevronsIcon />
        </BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>
      {list}
    </BaseCombobox.Root>
  );
}

function toArray(v: string | string[] | null | undefined): string[] {
  if (v === null || v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 text-ink!" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
      <path d="m4.5 4.5 7 7m0-7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronsIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="m5 6.5 3-3 3 3M5 9.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
