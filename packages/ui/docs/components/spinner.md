---
title: Spinner
description: A small ring that turns once every 600ms, in the current text colour. For waits that take a moment, not for page loads.
group: Feedback
order: 60
---

# Spinner

A small ring that turns once every 600ms in the current text colour. Use it for short waits: inside a button, beside "Connecting…", at the end of a row that's refreshing. It's the only linear motion in the library, because a spinner has no start or end.

```tsx
import { Spinner } from "@nils/ui";
```

## Examples

### Sizes

```tsx live
<Spinner size="sm" />
<Spinner />
<Spinner size="lg" />
```

### With a word

Pair it with a word so it says what's happening. The word is enough for screen readers, so silence the spinner with `label=""`.

```tsx live
<div className="flex items-center gap-2 text-ui text-ink-2">
  <Spinner label="" />
  Connecting to h100-01…
</div>
```

### In a button

Don't place a spinner in a button yourself. Use `Button`'s `loading` prop, which keeps the button's width.

```tsx live
<Button loading>Save</Button>
<Button variant="primary" loading>Deploy</Button>
```

## Rules

- **Do** say what's loading next to it, when there's room.
- **Do** prefer `Button loading` for actions.
- **Don't** spin over a whole page or a large empty area. Show the layout with real labels and fill it in.
- **Don't** show a spinner for waits under ~300ms. It flashes and makes things feel slower.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 12 / 14 / 20px. |
| `label` | `string` | `"Loading"` | Screen reader text. `""` makes it decorative. |
| `...props` | `ComponentProps<"svg">` | — | Passed to the `<svg>`. |

## Accessibility

With a label it's `role="status"` with `aria-label`. With `label=""` it's `aria-hidden`; make sure nearby text (or `aria-busy` on the container) says something is loading. `prefers-reduced-motion` stops the rotation.
