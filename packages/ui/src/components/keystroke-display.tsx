import * as React from "react";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/** Symbols used for keys in a chord. Mac glyphs, matching `Kbd`'s shortcut hints. */
const KEY_LABEL: Record<string, string> = {
  Escape: "Esc",
  Backspace: "⌫",
  Delete: "Del",
  Enter: "Enter",
  " ": "Space",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

/** How the symbols are read aloud; `⌘` on its own is not a word. */
const SPOKEN: Record<string, string> = {
  "⌘": "Command",
  "⌃": "Control",
  "⌥": "Option",
  "⇧": "Shift",
  "⌫": "Backspace",
  "↑": "Up arrow",
  "↓": "Down arrow",
  "←": "Left arrow",
  "→": "Right arrow",
};

function labelFor(event: KeyboardEvent | React.KeyboardEvent): string {
  if (event.key === "Shift") return "⇧";
  if (event.key === "Control") return "⌃";
  if (event.key === "Alt") return "⌥";
  if (event.key === "Meta") return "⌘";
  const mapped = KEY_LABEL[event.key];
  if (mapped) return mapped;
  return event.key.length === 1 ? event.key.toUpperCase() : event.key;
}

function spoken(key: string): string {
  return SPOKEN[key] ?? key;
}

export interface KeystrokeDisplayProps extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  /** A fixed chord to show, e.g. `["⌘", "K"]`. Leave it out to record what the user presses. */
  keys?: readonly string[];
  /** Record key presses while the widget has focus. Ignored when `keys` is set. */
  capture?: boolean;
  /** Receives every recorded chord, in display order. */
  onCapture?: (keys: string[]) => void;
  /** Section label above the keys. Defaults to "Keystroke". */
  label?: React.ReactNode;
  /** Prompt in capture mode while nothing has been pressed yet. */
  hint?: React.ReactNode;
  /** How many chords to keep on screen, newest first. Defaults to 1. */
  history?: number;
}

/**
 * Shows a keyboard chord as `Kbd` caps, either fixed or recorded from the
 * user's own key presses. Capturing only happens while the widget has focus,
 * so it never swallows shortcuts meant for the page.
 */
export function KeystrokeDisplay({
  keys,
  capture = false,
  onCapture,
  label = "Keystroke",
  hint = "Press a shortcut",
  history = 1,
  className,
  ...props
}: KeystrokeDisplayProps) {
  const fixed = keys !== undefined;
  const recording = capture && !fixed;
  const [chords, setChords] = React.useState<string[][]>([]);
  const [held, setHeld] = React.useState<string[]>([]);

  const push = (chord: string[]) => {
    setChords((previous) => [chord, ...previous].slice(0, Math.max(1, history)));
    onCapture?.(chord);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") return;
    event.preventDefault();
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
      const modifier = labelFor(event);
      if (modifier.length === 1 && "⌘⌃⌥⇧".includes(modifier)) {
        setHeld((previous) => (previous.includes(modifier) ? previous : [...previous, modifier]));
        return;
      }
    }
    if (!event.repeat) {
      const active = [
        event.metaKey ? "⌘" : null,
        event.ctrlKey ? "⌃" : null,
        event.altKey ? "⌥" : null,
        event.shiftKey ? "⇧" : null,
      ].filter((modifier): modifier is string => modifier !== null);
      push([...active, labelFor(event)]);
      setHeld(active);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const modifier = labelFor(event);
    if ("⌘⌃⌥⇧".includes(modifier) && modifier.length === 1) {
      setHeld((previous) => previous.filter((key) => key !== modifier));
    }
  };

  const shown: string[][] = fixed ? [Array.from(keys)] : chords;
  const last = shown[0];
  const announcement = last ? last.map(spoken).join(" ") : "";
  // Modifiers held before the final key: a partial chord, shown but not announced.
  const preview = recording && held.length > 0 ? held : null;

  return (
    <div
      {...props}
      role="group"
      aria-label={typeof label === "string" ? label : "Keystroke"}
      tabIndex={recording ? 0 : undefined}
      onKeyDown={recording ? handleKeyDown : undefined}
      onKeyUp={recording ? handleKeyUp : undefined}
      onBlur={recording ? () => setHeld([]) : undefined}
      data-state={shown.length > 0 ? "filled" : "empty"}
      className={cn(
        "w-full max-w-sm rounded-box border border-line-strong bg-surface p-3 outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="ui-label">{label}</span>
        {recording && shown.length > 0 ? <span className="text-xs text-ink-3">Recorded</span> : null}
      </div>

      {shown.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {shown.map((chord, index) => (
            <div key={index} className="flex flex-wrap items-center gap-1" data-chord={chord.join("+")}>
              {chord.map((key, position) => (
                <Kbd key={`${key}-${position}`}>{key}</Kbd>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-ui text-ink-3">
          <Kbd>—</Kbd>
          <span>{hint}</span>
        </div>
      )}

      {preview ? (
        <div aria-hidden="true" className="mt-2 flex items-center gap-1 border-t border-line pt-2">
          {preview.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
          <Kbd className="text-ink-3">…</Kbd>
        </div>
      ) : null}

      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
