---
title: VisitorCounter
description: An old-web odometer for an app-supplied visitor total; changed digits roll in their cells.
group: Gimmicks
order: 170
---

# VisitorCounter

The old-web visitor counter, as an odometer. Each digit sits on its own wheel, and when the total changes only the wheels that changed roll to their new digit. The number comes from your app: log a hit wherever you count traffic and pass the total. The widget never invents, inflates or polls.

```tsx
import { VisitorCounter } from "@nils/ui";
```

## Examples

### A footer counter

Padding to six digits keeps the odometer the same width as the number grows.

```tsx live
<VisitorCounter count={48213} caption="since 1998" />
```

### Rolling changes

Update `count` from your app and the changed wheels roll upward. Going from `…309` to `…310` turns two wheels; the rest stay still.

```tsx live
import { useState } from "react";
import { Button, VisitorCounter } from "@nils/ui";

export default function Example() {
  const [count, setCount] = useState(8675309);
  return (
    <div className="flex flex-col items-start gap-4">
      <VisitorCounter count={count} label="Visitors this week" caption="from your own log" />
      <Button size="sm" onClick={() => setCount((current) => current + 1)}>Count a visit</Button>
    </div>
  );
}
```

### Plain

`variant="plain"` drops the cells for a bare mono number, for places where an odometer would be too loud. Digits still roll.

```tsx live
<VisitorCounter count={1284} digits={5} variant="plain" caption="since March" />
```

### An unavailable total

A negative or non-finite count renders a dash instead of a made-up number.

```tsx live
<VisitorCounter count={Number.NaN} caption="counter unavailable" />
```

## Rules

- **Do** pass a total you actually counted, from your analytics, database or log file.
- **Do** keep the caption honest about the period: "since 1998", "this week", "unique visitors".
- **Do** use `digits` to pick the odometer's width; `6` is the minimum by default, and longer counts add wheels.
- **Don't** fake ticking by incrementing the count on a timer. A wheel turns because a visit was counted.
- **Don't** poll a counter endpoint from the widget; refresh the supplied value from your app.
- **Don't** put more than one odometer on a page. It's a footer ornament, not a metrics display; use `Stat` for that.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | Required | The total to show. Fractions are floored; negative or non-finite values show "—". |
| `digits` | `number` | Max of the count's length and 6 | Minimum number of wheels, zero-padded, e.g. `6` shows `004213`. |
| `label` | `ReactNode` | `"Visitors"` | `ui-label` above the counter. A string is also used as the accessible name. Pass `null` to hide it. |
| `caption` | `ReactNode` | — | Small note after the digits, e.g. "since 1998". |
| `variant` | `"odometer" \| "plain"` | `"odometer"` | Digit cells with a centre seam, or a bare mono number. Both roll. |
| `locale` | `Intl.LocalesArgument` | Browser locale | Locale for the spoken number. The visible digits are always Latin and ungrouped. |
| `className` | `string` | — | Layout classes on the wrapper. |
| `...props` | `ComponentProps<"div">` | — | Standard wrapper props, including `ref`. Children are not accepted. |

Exports `VisitorCounterProps` and `VisitorCounterVariant`.

## Motion

This is the counter's signature move. When the count changes, only the changed wheels roll: 180ms with `ease-snap`, upward when the total grows, using `NumberRoll`. Nothing moves on first render or on its own. Under `prefers-reduced-motion` digits swap instantly.

## Accessibility

The wrapper is a named group, and the number is exposed as one spoken value, e.g. "8,675,309 visitors". The cells are hidden from assistive technology. Digits use tabular figures so the odometer never changes width as it rolls. Updates aren't announced; a visitor total is reference information, not an event.
