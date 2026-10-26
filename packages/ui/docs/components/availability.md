---
title: Availability
description: A personal availability notice with a status dot, optional contact link and details accessible by hover, keyboard or touch.
group: Gimmicks
order: 30
---

# Availability

A small notice for a personal site or profile: open for work, concentrating, or away until a date. Only the dot carries colour; the sentence stays in ink. Supply the state and copy from your app. `Availability` does not fetch presence, infer a schedule or make bookings.

```tsx
import { Availability } from "@nils/ui";
```

## Examples

### States

Use a sentence that says what the state means for the person reading it.

```tsx live
<div className="flex flex-col items-start gap-3">
  <Availability state="open" label="Open for small projects" />
  <Availability state="busy" label="Heads down until Thursday" />
  <Availability state="away" label="Back in November" />
</div>
```

### Details

Hover for a short explanation, or click, tap, Enter or Space to open it. Escape closes the popover. Keep the essential availability in the label so someone can understand the notice without opening anything.

```tsx live
<Availability
  state="open"
  label="Open for small projects"
  detail="Taking on one small interface project in November. Usually reply within two working days."
/>
```

### A contact link

When `href` is present, the label is a normal link and the detail has its own button. Following the contact link never depends on a hover interaction.

```tsx live
<Availability
  state="busy"
  label="Next opening in December"
  href="mailto:hello@example.com"
  detail="New projects can start in December. Email a short description and your preferred dates."
/>
```

### Supplied by the app

This example switches local demo data. In a real app, pass the state from your own profile settings or data source.

```tsx live
import { Availability, Button } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [away, setAway] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Availability state={away ? "away" : "open"} label={away ? "Away for the weekend" : "Available this week"} />
      <Button size="sm" onClick={() => setAway((value) => !value)}>{away ? "Mark available" : "Mark away"}</Button>
    </div>
  );
}
```

## Rules

- **Do** make the label specific: what you are available for, or when you return.
- **Do** use `open` for available, `busy` for limited capacity and `away` for unavailable. The word must carry the meaning as well as the dot.
- **Do** supply scheduling logic, external data and contact destinations from the consuming app.
- **Don't** put the only way to contact someone inside hover-only content. Use `href` for a direct contact link.
- **Don't** use this for infrastructure health. Use `Status` or `UptimeStrip` for services.
- **Don't** add a pulsing dot or a coloured background to make the notice demand attention.

## Props

Extends `<span>` attributes except `children`. Attributes and `ref` apply to the outer wrapper.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `"open" \| "busy" \| "away"` | — | Required. Maps to an `ok`, `warn` or neutral dot. |
| `label` | `string` | `"Available"`, `"Busy"` or `"Away"` | Visible sentence. Also labels the detail popup. |
| `detail` | `ReactNode` | — | Additional context in a popover. Omit it for a passive notice. |
| `href` | `string` | — | Makes the label a link, with a separate detail button when needed. |
| `className` | `string` | — | Layout classes for the outer wrapper. |

## Motion

The detail popover opens after a 300ms hover delay, enters in 150ms and exits in 100ms. Clicking or activating it from the keyboard opens it immediately. There is no animation on the status dot or label. Reduced motion follows the shared library styles.

## Accessibility

- The dot is hidden from screen readers. The visible label carries the state, so the notice works without colour.
- With details, the trigger is a real button that supports Enter, Space and touch. Escape dismisses the popover and focus returns to its trigger.
- With `href`, the label remains a native link; the separate button is named "Availability details".
- The notice does not announce every change automatically. If an asynchronous update needs an announcement, the consuming app can place it in an appropriate live region.
