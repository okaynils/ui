---
title: KeystrokeDisplay
description: A screencast-style key overlay; keycaps physically press while held, and older chords fade out.
group: Gimmicks
order: 140
---

# KeystrokeDisplay

The key overlay from a screencast, as a widget. Each chord is a row of keycaps with a visible bottom edge. While a key is held, its cap sinks a pixel and the edge flattens, and it springs back when you let go. New chords stack on top and older ones fade out after a moment. Use fixed `keys` to show a shortcut in docs or a tutorial, or `capture` to record what the user presses while practising one. It only displays: binding the shortcut stays in your app.

```tsx
import { KeystrokeDisplay } from "@nils/ui";
import type { KeystrokeDisplayProps } from "@nils/ui";
```

## Examples

### Practise a shortcut

Click the widget (or Tab to it), then press shortcuts. Hold a key down to see its cap stay pressed. The last three chords stay, and older ones fade after two seconds.

```tsx live
<KeystrokeDisplay capture label="Shortcut practice" hint="Click, then press a shortcut" className="cursor-text" />
```

### A fixed chord, pressed on cue

Fixed `keys` render a static chord. Drive `pressed` to press its caps, e.g. in a tutorial step. Nothing presses on its own.

```tsx live
import { useEffect, useRef, useState } from "react";
import { Button, KeystrokeDisplay } from "@nils/ui";

const KEYS = ["⌘", "⇧", "P"];

export default function Example() {
  const [pressed, setPressed] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const demo = () => {
    timers.current.forEach(clearTimeout);
    // Press the keys one after another, hold, then let go together.
    timers.current = [
      ...KEYS.map((_, i) => setTimeout(() => setPressed(KEYS.slice(0, i + 1)), i * 160)),
      setTimeout(() => setPressed([]), KEYS.length * 160 + 400),
    ];
  };
  return (
    <div className="flex flex-col items-start gap-3">
      <KeystrokeDisplay label="Command palette" keys={KEYS} pressed={pressed} />
      <Button size="sm" onClick={demo}>Show me</Button>
    </div>
  );
}
```

### Capture one chord for a setting

`onCapture` hands over each chord as display strings, such as `["⌘", "⇧", "P"]`. With `history={1}` and `fade={false}` the widget shows exactly the chord the user picked.

```tsx live
import { useState } from "react";
import { Kbd, KeystrokeDisplay } from "@nils/ui";

export default function Example() {
  const [chord, setChord] = useState<string[] | null>(null);
  return (
    <div className="flex flex-col items-start gap-3">
      <KeystrokeDisplay capture history={1} fade={false} label="Press your shortcut" onCapture={setChord} />
      <p className="text-ui text-ink-2">
        {chord ? (
          <>Saved: <span className="inline-flex items-center gap-1 align-middle">{chord.map((key) => <Kbd key={key}>{key}</Kbd>)}</span></>
        ) : "No shortcut saved yet."}
      </p>
    </div>
  );
}
```

## Rules

- **Do** pass `keys` for hints and documentation, and `capture` only when the user is meant to press something.
- **Do** give the widget a `label`. The keys alone don't say what they do.
- **Do** drive `pressed` from your own sequence when demonstrating; the widget never presses caps on its own.
- **Do** use `Button`'s `shortcut`, or a `Kbd` beside text, for shortcuts inside normal UI. This widget is for demonstrating a chord, not labelling a toolbar.
- **Don't** bind the captured keys to an action. Record the chord, then bind it yourself where the shortcut belongs.
- **Don't** capture globally. Listening starts only when the widget is focused, so page shortcuts keep working.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `readonly string[]` | — | A fixed chord, e.g. `["⌘", "K"]`. Overrides capture. |
| `pressed` | `readonly string[]` | — | With `keys`: the keys held down right now. Their caps press. |
| `capture` | `boolean` | `false` | Record key presses while the widget has focus. Ignored when `keys` is set. |
| `onCapture` | `(keys: string[]) => void` | — | Called for each recorded chord, in display order. |
| `label` | `ReactNode` | `"Keystroke"` | Label at the top. A string is also used as the accessible name. |
| `hint` | `ReactNode` | `"Press a shortcut"` | Prompt shown before the first chord. |
| `history` | `number` | `3` | How many chords to keep on screen, newest first. At least one. |
| `fade` | `number \| false` | `2000` | Milliseconds before chords other than the newest fade out. `false` keeps them until `history` pushes them off. |
| `className` | `string` | — | Layout classes on the wrapper. |
| `...props` | `ComponentProps<"div">` | — | Standard wrapper props, including `ref`. Children are not accepted. |

## Motion

The pressing keycap is the widget's signature move. A held key's cap sinks 1px and its 3px bottom edge flattens to 1px. Releasing it reverses that. Both directions take 120ms on `ease-snap`, with no overshoot, so a key feels firm. Caps only move while a key is physically held, or while your app holds it through `pressed`. Holding modifiers alone shows them pressed above the stack, as a chord in the making. Older chords dim, then fade out over 150ms once `fade` has passed. Under `prefers-reduced-motion` caps change state without the transition and chords disappear without fading.

## Accessibility

The wrapper is a named `group`. In capture mode it's focusable, and Tab moves on rather than recording, so keyboard users are never trapped. Each completed chord is written into a polite live region in words, such as "Command Shift P", rather than symbols. Fixed chords are exposed the same way, once. The caps themselves, the modifier preview and the fading history are hidden from screen readers. No global listener is installed, so nothing changes while the user types elsewhere.
