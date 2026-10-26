import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import * as React from "react";
import { cn } from "../lib/cn";
import { popupItem } from "../lib/surfaces";
import { Kbd } from "./kbd";

export interface CommandItem {
  /** Stable, unique across all groups. */
  id: string;
  label: string;
  /** A 16px icon shown before the label. */
  icon?: React.ReactNode;
  /** Display-only shortcut hint, e.g. "⇧⌘N". Bind the key yourself. */
  shortcut?: string;
  /** Extra words that should match the search, e.g. ["dark", "theme"]. */
  keywords?: string[];
  disabled?: boolean;
  /** Runs when the item is chosen (click or ↵). The palette closes first. */
  onSelect: () => void;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandGroup[];
  /** Placeholder in the search field. */
  placeholder?: string;
  /** Accessible name of the dialog. */
  label?: string;
}

/** Every typed word must start some word of the label or keywords. "dar mo" finds "Toggle dark mode"; "to" doesn't find "history". */
function matches(item: CommandItem, query: string): boolean {
  const words = [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase().split(/[^\p{L}\p{N}]+/u);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((q) => words.some((w) => w.startsWith(q)));
}

/**
 * The ⌘K command list. Opens instantly — it's summoned many times an hour
 * from the keyboard, so choreography would only be in the way — and closes in
 * 100ms. Bind the shortcut with `useCommandPaletteShortcut`.
 */
export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = "Type a command or search…",
  label = "Command palette",
}: CommandPaletteProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-scrim transition-opacity duration-100 ease-snap data-ending-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[min(18vh,140px)] pb-4">
          <Dialog.Popup
            aria-label={label}
            className={cn(
              "flex max-h-[min(480px,calc(100dvh-6rem))] w-full max-w-[560px] flex-col overflow-hidden rounded-box bg-raised text-ink shadow-modal outline-none",
              "transition-[opacity,scale] duration-100 ease-snap data-ending-style:scale-98 data-ending-style:opacity-0",
            )}
          >
            <PaletteBody groups={groups} placeholder={placeholder} onDone={() => onOpenChange(false)} />
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PaletteBody({ groups, placeholder, onDone }: { groups: CommandGroup[]; placeholder: string; onDone: () => void }) {
  const [query, setQuery] = React.useState("");
  const hintId = React.useId();

  const run = (item: CommandItem) => {
    if (item.disabled) return;
    onDone();
    item.onSelect();
  };

  return (
    <Autocomplete.Root
      open
      inline
      items={groups}
      value={query}
      onValueChange={setQuery}
      filter={(item: CommandItem, q: string) => matches(item, q)}
      itemToStringValue={(item: CommandItem) => item.label}
      autoHighlight="always"
      keepHighlight
    >
      <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-line px-4">
        <SearchIcon />
        <Autocomplete.Input
          placeholder={placeholder}
          aria-describedby={hintId}
          className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
        />
        <Kbd className="shrink-0">Esc</Kbd>
      </div>
      <Dialog.Close className="sr-only">Close</Dialog.Close>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1 [scroll-padding-block:4px]">
        <Autocomplete.Empty>
          <p className="px-3 py-8 text-center text-ui text-ink-2">
            No results for <span className="text-ink">“{query}”</span>.
          </p>
        </Autocomplete.Empty>
        <Autocomplete.List>
          {(group: CommandGroup) => (
            <Autocomplete.Group key={group.label} items={group.items} className="not-last:mb-1">
              <Autocomplete.GroupLabel className="ui-label flex h-7 items-center px-2 pt-1 select-none">
                {group.label}
              </Autocomplete.GroupLabel>
              <Autocomplete.Collection>
                {(item: CommandItem) => (
                  <Autocomplete.Item
                    key={item.id}
                    value={item}
                    disabled={item.disabled}
                    onClick={() => run(item)}
                    className={cn(popupItem, "h-9 [scroll-margin-block:4px]")}
                  >
                    {item.icon !== undefined ? <span className="flex shrink-0 items-center">{item.icon}</span> : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.shortcut ? <Kbd className="shrink-0">{item.shortcut}</Kbd> : null}
                  </Autocomplete.Item>
                )}
              </Autocomplete.Collection>
            </Autocomplete.Group>
          )}
        </Autocomplete.List>
      </div>

      <div className="flex h-9 shrink-0 items-center gap-4 border-t border-line bg-panel px-3 text-xs text-ink-3">
        <span id={hintId} className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> to run
        </span>
      </div>
    </Autocomplete.Root>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-ink-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="7" cy="7" r="4.75" />
      <path d="m10.5 10.5 3 3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Toggle a command palette with ⌘K (macOS) / Ctrl+K (elsewhere).
 * Pass the setter from `useState`. Change the key with the second argument.
 */
export function useCommandPaletteShortcut(setOpen: React.Dispatch<React.SetStateAction<boolean>>, key = "k") {
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key.toLowerCase() && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setOpen, key]);
}
