import * as React from "react";
import { cn } from "../lib/cn";

/** Symbols used for keys in a chord. Mac glyphs, matching `Kbd`'s shortcut hints. */
const KEY_LABEL: Record<string, string> = {
  Escape: "Esc",
  Backspace: "⌫",
  Delete: "Del",
  Enter: "↵",
  " ": "Space",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Shift: "⇧",
  Control: "⌃",
  Alt: "⌥",
  Meta: "⌘",
};

/** How the symbols are read aloud; `⌘` on its own is not a word. */
const SPOKEN: Record<string, string> = {
  "⌘": "Command",
  "⌃": "Control",
  "⌥": "Option",
  "⇧": "Shift",
  "⌫": "Backspace",
  "↵": "Return",
  Esc: "Escape",
  Del: "Delete",
  "↑": "Up arrow",
  "↓": "Down arrow",
  "←": "Left arrow",
  "→": "Right arrow",
};

const MODIFIERS = ["⌘", "⌃", "⌥", "⇧"];

function labelFor(key: string): string {
  return KEY_LABEL[key] ?? (key.length === 1 ? key.toUpperCase() : key);
}

function spoken(key: string): string {
  return SPOKEN[key] ?? key;
}

export interface KeystrokeDisplayProps extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  /** A fixed chord to show, e.g. `["⌘", "K"]`. Leave it out to record what the user presses. */
  keys?: readonly string[];
  /** For fixed `keys`: which of them are held down right now, so a demo can press the caps. */
  pressed?: readonly string[];
  /** Record key presses while the widget has focus. Ignored when `keys` is set. */
  capture?: boolean;
  /** Receives every recorded chord, in display order. */
  onCapture?: (keys: string[]) => void;
  /** Section label above the keys. Defaults to "Keystroke". */
  label?: React.ReactNode;
  /** Prompt in capture mode while nothing has been pressed yet. */
  hint?: React.ReactNode;
  /** How many chords to keep on screen, newest first. Defaults to 3. */
  history?: number;
  /** Milliseconds before older chords fade out, like a presenter's key overlay. `false` keeps them. Defaults to 2000. */
  fade?: number | false;
}

interface Chord {
  id: number;
  keys: string[];
  leaving: boolean;
}

// Fading out is an exit, so it's quicker than anything entering.
const LEAVE_MS = 150;

/**
 * A screencast-style key overlay: chords as keycaps that physically press
 * while held. Fixed for documentation, or recorded from the user's own key
 * presses while the widget has focus, so it never swallows page shortcuts.
 */
export function KeystrokeDisplay({
  keys,
  pressed,
  capture = false,
  onCapture,
  label = "Keystroke",
  hint = "Press a shortcut",
  history = 3,
  fade = 2000,
  className,
  ...props
}: KeystrokeDisplayProps) {
  const fixed = keys !== undefined;
  const recording = capture && !fixed;
  const [chords, setChords] = React.useState<Chord[]>([]);
  // Held keys by physical code, so releasing Shift before "1" still finds "!".
  const [held, setHeld] = React.useState<ReadonlyMap<string, string>>(() => new Map());
  const nextId = React.useRef(0);
  const timers = React.useRef(new Map<number, ReturnType<typeof setTimeout>>());

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Older chords fade after a moment; the newest stays until it's replaced.
  React.useEffect(() => {
    if (fade === false) return;
    chords.forEach((chord, index) => {
      if (index === 0 || timers.current.has(chord.id)) return;
      timers.current.set(chord.id, setTimeout(() => {
        setChords((current) => current.map((item) => (item.id === chord.id ? { ...item, leaving: true } : item)));
        timers.current.set(chord.id, setTimeout(() => {
          timers.current.delete(chord.id);
          setChords((current) => current.filter((item) => item.id !== chord.id));
        }, LEAVE_MS));
      }, fade));
    });
  }, [chords, fade]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") return;
    event.preventDefault();
    const key = labelFor(event.key);
    setHeld((current) => new Map(current).set(event.code || event.key, key));
    if (MODIFIERS.includes(key) || event.repeat) return;
    const chord = [
      event.metaKey ? "⌘" : null,
      event.ctrlKey ? "⌃" : null,
      event.altKey ? "⌥" : null,
      event.shiftKey ? "⇧" : null,
      key,
    ].filter((part): part is string => part !== null);
    setChords((current) => {
      const dropped = current.slice(Math.max(1, history) - 1);
      dropped.forEach((item) => { clearTimeout(timers.current.get(item.id)); timers.current.delete(item.id); });
      return [{ id: nextId.current++, keys: chord, leaving: false }, ...current].slice(0, Math.max(1, history));
    });
    onCapture?.(chord);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // macOS never sends keyup for other keys while ⌘ is down, so letting go
    // of ⌘ releases everything.
    if (event.key === "Meta") return setHeld(new Map());
    setHeld((current) => {
      const next = new Map(current);
      next.delete(event.code || event.key);
      return next;
    });
  };

  const down = new Set(fixed ? pressed ?? [] : held.values());
  const shown: Chord[] = fixed ? [{ id: -1, keys: Array.from(keys), leaving: false }] : chords;
  const newest = shown[0];
  const announcement = recording && newest ? newest.keys.map(spoken).join(" ") : "";
  // Modifiers held before the final key: a chord in the making, pressed but not yet announced.
  const heldKeys = [...held.values()];
  const preview = recording && heldKeys.length > 0 && heldKeys.every((key) => MODIFIERS.includes(key))
    ? MODIFIERS.filter((key) => down.has(key))
    : null;

  return (
    <div
      {...props}
      role="group"
      aria-label={typeof label === "string" ? label : "Keystroke"}
      tabIndex={recording ? 0 : undefined}
      onKeyDown={recording ? handleKeyDown : undefined}
      onKeyUp={recording ? handleKeyUp : undefined}
      onBlur={recording ? () => setHeld(new Map()) : undefined}
      data-state={shown.length > 0 ? "filled" : "empty"}
      className={cn(
        "w-full max-w-sm rounded-box border border-line-strong bg-panel p-3 outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <div className="mb-3 ui-label">{label}</div>

      <div className="flex min-h-9 flex-col items-start gap-2">
        {preview ? (
          <div aria-hidden="true" className="flex items-center gap-1.5">
            {preview.map((key) => <Cap key={key} down>{key}</Cap>)}
          </div>
        ) : null}
        {shown.map((chord, index) => (
          <div
            key={chord.id}
            aria-hidden="true"
            data-chord={chord.keys.join("+")}
            className={cn(
              "flex flex-wrap items-center gap-1.5 transition-opacity duration-150",
              chord.leaving ? "opacity-0" : index > 0 || preview ? "opacity-55" : null,
            )}
          >
            {chord.keys.map((key, position) => (
              <Cap key={`${key}-${position}`} down={index === 0 && !preview && down.has(key)}>{key}</Cap>
            ))}
          </div>
        ))}
        {shown.length === 0 && !preview ? (
          <div className="flex h-9 items-center gap-2 text-ui text-ink-3">
            <Cap aria-hidden>—</Cap>
            <span>{hint}</span>
          </div>
        ) : null}
      </div>

      {fixed ? <span className="sr-only">{Array.from(keys).map(spoken).join(" ")}</span> : null}
      <span aria-live="polite" className="sr-only">{announcement}</span>
    </div>
  );
}

/**
 * A keycap with a visible bottom edge. Held down, it sinks a pixel and the
 * edge flattens; let go and it rises again. Same 120ms snap both ways, no
 * overshoot: a key is firm.
 */
function Cap({ down = false, className, ...props }: React.ComponentProps<"kbd"> & { down?: boolean }) {
  return (
    <kbd
      {...props}
      data-down={down || undefined}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-ui bg-surface px-2.5 pb-[3px]",
        "font-mono text-ui leading-none font-medium text-ink",
        "shadow-[inset_0_0_0_1px_var(--ui-line-strong),inset_0_-3px_0_var(--ui-line-strong)]",
        "transition-[translate,box-shadow,background-color,padding] duration-120 ease-snap",
        "data-down:translate-y-px data-down:bg-hover data-down:pb-px",
        "data-down:shadow-[inset_0_0_0_1px_var(--ui-line-strong),inset_0_-1px_0_var(--ui-line-strong)]",
        className,
      )}
    />
  );
}
