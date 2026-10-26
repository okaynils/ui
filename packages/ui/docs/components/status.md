---
title: Status
description: A coloured dot plus an ink word ("● Online"). The only way status colour appears in this library.
group: Layout
order: 30
---

# Status

Status is shown as **a dot plus a word**. The 6px dot carries the colour; the word stays ink. `Status` gives you both. `StatusDot` gives you the dot alone, for slots like `ListItem`'s `leading` where the word sits elsewhere.

```tsx
import { Status, StatusDot } from "@nils/ui";
```

## Examples

### Tones

```tsx live
<div className="flex flex-col gap-2">
  <Status tone="ok">Online</Status>
  <Status tone="warn">Needs attention</Status>
  <Status tone="err">Failing</Status>
  <Status tone="accent">Current</Status>
  <Status>Paused</Status>
</div>
```

### Live

`pulse` is a slow opacity breath that means "happening right now". Use it on at most one thing per view.

```tsx live
<Status tone="ok" pulse>Deploying</Status>
```

### Dot only

```tsx live
<div className="flex items-center gap-3">
  <StatusDot tone="ok" />
  <StatusDot tone="warn" />
  <StatusDot tone="err" />
  <StatusDot tone="accent" />
  <StatusDot />
</div>
```

## Rules

- **Do** pair every dot with a word, either in `Status` or nearby (same row).
- **Do** use `ok` for done, healthy or online; `warn` for "needs you"; `err` for broken. `accent` means current or now, not success.
- **Don't** colour the text, the row background, or a badge fill. Only the dot is coloured.
- **Don't** pulse more than one thing per view, or pulse anything that isn't live.
- **Don't** rely on colour alone. The word is what screen readers and colour-blind users get.

## Props

### Status

Extends every `<span>` attribute.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"ok" \| "warn" \| "err" \| "accent" \| "neutral"` | `"neutral"` | Dot colour. |
| `pulse` | `boolean` | `false` | Slow opacity pulse for live state. |
| `children` | `ReactNode` | — | The word. Sentence case. |

### StatusDot

Same `tone` and `pulse` props. Extends every `<span>` attribute. Hidden from screen readers.

## Accessibility

The dot is `aria-hidden`; the word carries the meaning. If you use `StatusDot` alone, make sure the status word is present in the same row or in the element's accessible name.

## Motion

`pulse` runs a 2.4s opacity cycle. It stops under `prefers-reduced-motion`.
