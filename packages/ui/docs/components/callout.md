---
title: Callout
description: A note in the page — status dot, ink title, short body, one optional action. Never a coloured wash.
group: Feedback
order: 10
---

# Callout

A note that sits in the content: something the reader should know before going on. The box is always panel grey with a hairline; the **tone colours only the dot**, so a page with three callouts still reads calm.

```tsx
import { Callout } from "@nils/ui";
```

## Examples

### Tones

`info` uses the accent blue. `neutral` is the default.

```tsx live
<div className="flex w-full max-w-md flex-col gap-3">
  <Callout title="Billing runs on the 1st">Usage from the previous month is charged then.</Callout>
  <Callout tone="info" title="New region available">eu-north is now open for H100 reservations.</Callout>
  <Callout tone="ok" title="Domain verified">nils.dev now points at this project.</Callout>
  <Callout tone="warn" title="Quota at 90%">New machines will queue once you hit the limit.</Callout>
  <Callout tone="err" title="Last deploy failed">The build exited with code 1. See the logs for details.</Callout>
</div>
```

### With an action and dismiss

One action, as a small button. `onDismiss` shows a close button; you hide the callout.

```tsx live
import { Button, Callout } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(true);
  if (!open) return <Button size="sm" onClick={() => setOpen(true)}>Show again</Button>;
  return (
    <Callout
      className="max-w-md"
      tone="warn"
      title="Your card expires next month"
      action={<Button size="sm">Update card</Button>}
      onDismiss={() => setOpen(false)}
    >
      Update it before 1 Dec to keep machines running.
    </Callout>
  );
}
```

### With an icon

`icon` replaces the dot and is tinted in the tone colour.

```tsx live
import { Callout } from "@nils/ui";
import { LightningIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Callout className="max-w-md" tone="info" icon={<LightningIcon weight="fill" />} title="Tip">
      Press <kbd className="font-mono">⌘K</kbd> anywhere to jump to a machine.
    </Callout>
  );
}
```

## Rules

- **Do** keep it short: a title of a few words, one or two sentences of body.
- **Do** use `warn`/`err` only when the reader has to act or something is broken. A tip is `neutral` or `info`.
- **Do** put at most one action in it. Two actions means it should be a page or a dialog.
- **Don't** tint the background, border or text with the tone. Only the dot (or icon) carries colour.
- **Don't** use a callout to confirm something the user just did. That's a `toast`.
- **Don't** use a callout for a page-wide announcement across the top of an app. That's a `Banner`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"neutral" \| "info" \| "ok" \| "warn" \| "err"` | `"neutral"` | Colour of the dot or icon. |
| `title` | `ReactNode` | — | One short line in ink. |
| `children` | `ReactNode` | — | Body text in ink-2. Links inside are accent and underlined. |
| `icon` | `ReactNode` | — | Replaces the dot; tinted in the tone. |
| `action` | `ReactNode` | — | One action, usually `<Button size="sm">`. |
| `onDismiss` | `() => void` | — | Shows a close button. Hide the callout yourself. |
| `...props` | `ComponentProps<"div">` | — | Passed to the root `<div>`. `className` for layout only. |

## Accessibility

- It's a plain `<div>`: callouts present on load are read in document order.
- If you insert one in response to something (a failed save), add `role="alert"` for `err`/`warn` or `role="status"` otherwise, so it's announced.
- The dismiss button is labelled "Dismiss". Colour is never the only signal: the title says what's wrong.
