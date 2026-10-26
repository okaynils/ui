---
title: Kbd
description: A keyboard key hint, drawn as a small mono keycap. Display only.
group: Controls
order: 90
---

# Kbd

A keyboard shortcut hint. It looks like a small keycap in mono type. It is display only: binding the key is your job.

```tsx
import { Kbd } from "@nils/ui";
```

## Examples

### Chord

One `Kbd` per chord, with modifier symbols.

```tsx live
<p className="text-sm text-ink-2">
  Press <Kbd>⌘K</Kbd> to search.
</p>
```

### Sequence

One `Kbd` per key when the keys are pressed in order.

```tsx live
<p className="text-sm text-ink-2">
  Go to inbox: <Kbd>G</Kbd> then <Kbd>I</Kbd>
</p>
```

### In a button

Use `Button`'s `shortcut` prop rather than placing a `Kbd` inside a button yourself.

```tsx live
<Button shortcut="⌘↵">Send</Button>
```

## Rules

- **Do** use symbols: `⌘` `⇧` `⌥` `⌃` `↵` `⌫` `Esc` `Tab` `↑` `↓`.
- **Do** order modifiers the macOS way: `⌃⌥⇧⌘`.
- **Do** show a hint only for a key that is actually bound.
- **Don't** spell modifiers out ("Cmd+K") or use `+` between keys.
- **Don't** use `Kbd` for code or values. That's `<code>`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The key or chord, e.g. `"⌘K"` |
| `...props` | `ComponentProps<"kbd">` | — | Passed to the `<kbd>` element |

## Accessibility

Renders a native `<kbd>`. Screen readers read the symbols as written. If a hint is the only place a shortcut is mentioned, also put it in the control's `aria-keyshortcuts` attribute.
