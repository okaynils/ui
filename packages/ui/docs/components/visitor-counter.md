---
title: VisitorCounter
description: An app-supplied visitor total as a quiet counter, optionally with inset mechanical digit cells and rolling changes.
group: Gimmicks
order: 170
---

# VisitorCounter

The old-web visitor counter, told honestly: the number comes from your app. Log a hit wherever you count traffic and pass the total. The widget pads it, groups it, and can roll changed digits — it never invents, inflates or polls.

```tsx
import { VisitorCounter } from "@nils/ui";
```

## Examples

### A plain total

Padding to six digits keeps the width steady while the number grows.

```tsx live
<VisitorCounter count={48213} caption="since 1998" />
```

### Mechanical digits

Each digit sits in its own inset cell, like a counter on a camera. The cells stay still on updates; the full number is still read aloud as one value.

```tsx live
<VisitorCounter
  count={1284}
  mechanical
  label="Visitors"
  caption="since March"
  digits={5}
/>
```

### Rolling changes

The default treatment rolls only the digits that changed, up when the count grows. Update the number from your app; the example below adds one.

```tsx live
import { useState } from "react";
import { Button, VisitorCounter } from "@nils/ui";

export default function Example() {
  const [count, setCount] = useState(8675309);
  return (
    <div className="flex flex-col items-start gap-3">
      <VisitorCounter count={count} label="Visitors this week" caption="from your own log" />
      <Button size="sm" onClick={() => setCount((current) => current + 1)}>Count another visit</Button>
    </div>
  );
}
```

### An unavailable total

A negative or non-finite count renders a dash instead of a made-up number. Show the widget only when you have a real value, or let this state speak for a broken service.

```tsx live
<VisitorCounter count={Number.NaN} caption="counter unavailable" />
```

## Rules

- **Do** pass a total you actually counted, from your analytics, database or log file.
- **Do** use `digits` so the counter keeps a stable width; `6` is the default minimum.
- **Do** keep the caption honest about the period — “since 1998”, “this week”, “unique visitors”.
- **Do** use `animate={false}` or `mechanical` if the page already has a rolling number nearby.
- **Don't** add random padding, “lucky visitor” multipliers or fake odometer ticks. The counter is a fact, not a decoration.
- **Don't** poll a counter endpoint from the widget; refresh the supplied value from your app if it needs to change.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | Required | The total to show. Fractions are floored; negative or non-finite values show “—”. |
| `digits` | `number` | Max of the count's length and 6 | Minimum digits, zero-padded, e.g. `6` shows `004213`. |
| `label` | `ReactNode` | `"Visitors"` | Section label above the number. A string is also used as the accessible name. |
| `caption` | `ReactNode` | — | Small note at the right of the header, e.g. “since 1998”. |
| `mechanical` | `boolean` | `false` | Draw each digit in its own inset cell. Cells do not roll. |
| `animate` | `boolean` | `true` | Roll changed digits with `NumberRoll`. Ignored when `mechanical` is set. |
| `locale` | `Intl.LocalesArgument` | Browser locale | Locale for digit formatting. |
| `className` | `string` | — | Layout classes on the wrapper. |
| `...props` | `ComponentProps<"div">` | — | Standard wrapper props, including `ref`. Children are not accepted. |

Exports `VisitorCounterProps`.

## Motion

A changing count rolls only the digits that changed, over 180ms with `ease-snap`, upward when it grows. The roll respects `prefers-reduced-motion`: digits then swap instantly. Mechanical cells never animate, and nothing blinks or ticks on its own.

## Accessibility

The wrapper is a named group, and the number is exposed as text — “8,675,309 visitors” — even when the mechanical cells are drawn. Digits use tabular figures so the counter does not shift as it changes, and the caption is real text rather than a tooltip. The widget does not announce updates; a visitor total is reference information, not an event.
