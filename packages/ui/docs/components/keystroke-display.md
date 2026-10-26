---
title: KeystrokeDisplay
description: A keyboard chord shown as keycaps, either fixed for documentation or recorded from the user for shortcut practice.
group: Gimmicks
order: 140
---

# KeystrokeDisplay

Show a shortcut as keys a person can recognise: `⌘K` for a command palette, or whatever they just pressed while learning one. Fixed `keys` make a static hint. With `capture`, the widget records chords while it has focus and reports them through `onCapture`. It only displays — binding the shortcut and running the action stays in your app.

```tsx
import { KeystrokeDisplay } from "@nils/ui";
```

## Examples

### A fixed chord

Pass the keys in the order they are pressed. Use it beside an action or in a tutorial, where a `Kbd` hint alone would be too small.

```tsx live
<KeystrokeDisplay label="Command palette" keys={["⌘", "K"]} />
```

### Record what the user presses

Focus the widget, then press a shortcut. Modifiers held down appear first, the completed chord is announced politely, and the last three chords stay on screen. Click it or press Tab to focus.

```tsx live
import { useState } from "react";
import { KeystrokeDisplay, Status } from "@nils/ui";

export default function Example() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start gap-3">
      <KeystrokeDisplay
        capture
        label="Shortcut practice"
        hint="Click, then press a shortcut"
        history={3}
        onCapture={(keys) => setLast(keys.join(" "))}
        className="cursor-text"
      />
      {last ? <Status tone="ok">{`Last chord: ${last}`}</Status> : <Status>Nothing recorded yet</Status>}
    </div>
  );
}
```

### Capturing a chord in a dialog

Record one chord from the user, then show it in your own field. `onCapture` hands over the keys as display strings, such as `["⌘", "⇧", "P"]`, so store them and render them with `Kbd` wherever they belong.

```tsx live
import { useState } from "react";
import { Kbd, KeystrokeDisplay } from "@nils/ui";

export default function Example() {
  const [chord, setChord] = useState<string[] | null>(null);
  return (
    <div className="flex flex-col items-start gap-3">
      <KeystrokeDisplay capture label="Press your shortcut" onCapture={setChord} />
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
- **Do** give the widget a `label`. The keys alone do not say what they do.
- **Do** keep one chord per row. Pass `history` to keep recent attempts visible while practising.
- **Do** use `Button`'s `shortcut`, or a `Kbd` beside text, for shortcuts inside normal UI. This widget is for demonstrating a chord, not for labelling a toolbar.
- **Don't** bind the captured keys to an action. Record the chord, then bind it yourself where the shortcut belongs.
- **Don't** capture globally. Listening starts only when the widget is focused, so page shortcuts keep working.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `readonly string[]` | — | A fixed chord, e.g. `["⌘", "K"]`. Overrides capture and renders display-only. |
| `capture` | `boolean` | `false` | Record key presses while the widget has focus. Ignored when `keys` is set. |
| `onCapture` | `(keys: string[]) => void` | — | Called for each recorded chord, in display order. |
| `label` | `ReactNode` | `"Keystroke"` | Label in the header. A string is also used as the accessible name. |
| `hint` | `ReactNode` | `"Press a shortcut"` | Prompt shown before the first chord and beside the empty placeholder. |
| `history` | `number` | `1` | How many chords to keep on screen, newest first. At least one. |
| `className` | `string` | — | Layout classes on the wrapper. |
| `...props` | `ComponentProps<"div">` | — | Standard wrapper props, including `ref`. Children are not accepted. |

Exports `KeystrokeDisplayProps`.

## Accessibility

The wrapper is a named `group`. In capture mode it is focusable, and pressing Tab moves on rather than recording, so keyboard users are never trapped. The completed chord is written into a polite live region in words — “Command Shift P” — instead of symbols, and the partial modifier preview is hidden from screen readers. Nothing changes while the user types elsewhere on the page, because no global listener is installed.

## Motion

None. Keycaps appear as soon as the chord completes. The library does not animate key presses; a pressed key is a state, not a transition.
