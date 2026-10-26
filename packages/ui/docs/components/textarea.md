---
title: Textarea
description: A multi-line text field. Resizes by hand, or grows with its content.
group: Controls
order: 21
---

# Textarea

A multi-line text field with the same surface as [`Input`](/components/input). By default the user can resize it vertically. With `autoGrow` it grows as you type.

```tsx
import { Textarea } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<div className="w-80">
  <Field label="Description" description="Markdown is supported.">
    <Textarea placeholder="What does this project do?" />
  </Field>
</div>
```

### Auto-grow

`autoGrow` uses CSS `field-sizing: content`: no JavaScript and no layout jump. Cap it with a `max-h-*` class and it scrolls past that.

```tsx live
<div className="w-80">
  <Field label="Commit message">
    <Textarea autoGrow className="max-h-48" defaultValue={"Fix flaky deploy check\n\nThe health probe raced the migration."} />
  </Field>
</div>
```

### Invalid

```tsx live
<div className="w-80">
  <Field label="Notes" error="Keep it under 280 characters.">
    <Textarea defaultValue="A very long note…" />
  </Field>
</div>
```

## Rules

- **Do** use it for anything that might run past one line: descriptions, messages, notes.
- **Do** use `autoGrow` in chat-like or comment UIs, and set a max height.
- **Don't** use it for a single value (a name or a URL). That's `Input`.
- **Don't** set a fixed height in `className`. Use `rows`, or `autoGrow` with `max-h-*`.

## Props

Every native `<textarea>` attribute, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `autoGrow` | `boolean` | `false` | Grow with content (`field-sizing: content`). Disables manual resize. |
| `rows` | `number` | `3` | Visible lines when not auto-growing. |
| `className` | `string` | — | Layout only, plus `max-h-*` with `autoGrow`. |

## Accessibility

Renders a native `<textarea>`. Inside `Field` it is labelled and described automatically. `field-sizing` is supported in Chromium and Safari. Other browsers fall back to a fixed 3-line textarea, which still works.
