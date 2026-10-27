import * as React from "react";
import { cn } from "../lib/cn";
import { Input, type InputProps, type InputSize } from "./input";
import { Kbd } from "./kbd";

export interface SearchFieldProps extends Omit<InputProps, "type" | "leading" | "trailing" | "value" | "defaultValue" | "onValueChange"> {
  value?: string;
  defaultValue?: string;
  /** Fires with the new query, including "" when the field is cleared. */
  onValueChange?: (value: string) => void;
  /**
   * A key that focuses the field from anywhere on the page, shown as a `Kbd`
   * hint while the field is empty and unfocused. A single key ("/") or a
   * chord with symbols ("⌘K", "⇧⌘F"); ⌘ also matches Ctrl.
   */
  shortcut?: string;
  /** Accessible name of the clear button. Defaults to "Clear search". */
  clearLabel?: string;
}

const MODIFIERS: Record<string, "mod" | "ctrl" | "alt" | "shift"> = { "⌘": "mod", "⌃": "ctrl", "⌥": "alt", "⇧": "shift" };

interface Chord { key: string; mod: boolean; ctrl: boolean; alt: boolean; shift: boolean }

function parseShortcut(shortcut: string): Chord | null {
  const chord: Chord = { key: "", mod: false, ctrl: false, alt: false, shift: false };
  for (const char of shortcut) {
    const modifier = MODIFIERS[char];
    if (modifier) chord[modifier] = true;
    else chord.key += char;
  }
  return chord.key ? chord : null;
}

/** "⇧⌘F" → "Shift+Meta+F", the format `aria-keyshortcuts` expects. */
function ariaShortcut(chord: Chord): string {
  return [chord.ctrl && "Control", chord.alt && "Alt", chord.shift && "Shift", chord.mod && "Meta", chord.key.length === 1 ? chord.key.toUpperCase() : chord.key]
    .filter(Boolean)
    .join("+");
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
}

const CLEAR_SIZE: Record<InputSize, string> = { sm: "size-5 -mr-1", md: "size-6 -mr-1.5", lg: "size-7 -mr-2" };

/**
 * A search input: magnifier, clear button, Escape to clear, and an optional
 * page-wide shortcut that focuses it.
 */
export function SearchField({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  shortcut,
  clearLabel = "Clear search",
  size = "md",
  placeholder = "Search",
  className,
  ref,
  onKeyDown,
  onFocus,
  onBlur,
  disabled,
  ...props
}: SearchFieldProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const [focused, setFocused] = React.useState(false);
  const input = React.useRef<HTMLInputElement | null>(null);
  const chord = React.useMemo(() => (shortcut ? parseShortcut(shortcut) : null), [shortcut]);

  const setRef = (node: HTMLInputElement | null) => {
    input.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const change = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  React.useEffect(() => {
    if (!chord || disabled) return;
    const onKey = (event: KeyboardEvent) => {
      const field = input.current;
      if (!field || event.defaultPrevented || event.repeat) return;
      const modded = event.metaKey || event.ctrlKey;
      // A bare key like "/" is a character someone may be typing elsewhere;
      // only a chord with ⌘ or ⌃ is safe to take from inside another field.
      if (!chord.mod && !chord.ctrl && isEditable(event.target)) return;
      if (event.key.toLowerCase() !== chord.key.toLowerCase()) return;
      if (chord.mod ? !modded : chord.ctrl !== event.ctrlKey || event.metaKey) return;
      if (chord.alt !== event.altKey) return;
      // Shifted characters like "?" already carry shift in their key.
      if (chord.shift && !event.shiftKey) return;
      if (document.activeElement === field) return;
      event.preventDefault();
      field.focus();
      field.select();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [chord, disabled]);

  const clear = () => {
    change("");
    input.current?.focus();
  };

  return (
    <Input
      {...props}
      ref={setRef}
      type="search"
      size={size}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onValueChange={(next) => change(next)}
      aria-keyshortcuts={chord ? ariaShortcut(chord) : undefined}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== "Escape") return;
        if (value) {
          // The first Escape only clears; it shouldn't also close the dialog
          // or popover the field sits in.
          event.preventDefault();
          event.stopPropagation();
          change("");
        } else {
          event.currentTarget.blur();
        }
      }}
      // Browsers draw their own clear "x" on search inputs; this one replaces it.
      className={cn("[&_input::-webkit-search-cancel-button]:appearance-none [&_input::-webkit-search-decoration]:appearance-none", className)}
      leading={<MagnifierIcon />}
      trailing={
        value ? (
          <button
            type="button"
            aria-label={clearLabel}
            disabled={disabled}
            // Keep focus in the field when the pointer clears it.
            onPointerDown={(event) => event.preventDefault()}
            onClick={clear}
            className={cn(
              "grid shrink-0 place-items-center rounded-[2px] text-ink-3 outline-none transition-colors duration-120 hover:bg-hover hover:text-ink",
              "focus-visible:outline-2 focus-visible:outline-accent",
              CLEAR_SIZE[size],
            )}
          >
            <ClearIcon />
          </button>
        ) : chord && !focused ? (
          <Kbd aria-hidden="true">{shortcut}</Kbd>
        ) : undefined
      }
    />
  );
}

function MagnifierIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="size-3.5">
      <path d="m4.5 4.5 7 7m0-7-7 7" />
    </svg>
  );
}
