---
title: NumberRoll
description: A formatted number whose changed digits roll to their new value. Up for increases, down for decreases, never on first render.
group: Data
order: 40
---

# NumberRoll

A number that shows how it changed. When `value` updates, only the digits that changed roll to their new value: up when the number grew, down when it shrank. The rest stays still. It's one of the library's signature moments: it tells you *which part* of a number moved, with no flash and no counting animation. [Stat](/components/stat) uses it for its value.

```tsx
import { NumberRoll } from "@nils/ui";
```

## Examples

### Counter

```tsx live
import { Button, NumberRoll } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [n, setN] = useState(1284);
  return (
    <div className="flex items-center gap-3">
      <Button size="sm" icon aria-label="Decrease" onClick={() => setN((v) => v - 7)}>−</Button>
      <NumberRoll value={n} className="min-w-20 justify-center text-[24px] font-medium tracking-[-0.02em]" />
      <Button size="sm" icon aria-label="Increase" onClick={() => setN((v) => v + 13)}>+</Button>
    </div>
  );
}
```

### Formats

`format` takes `Intl.NumberFormat` options. `prefix` and `suffix` stay still.

```tsx live
import { Button, NumberRoll } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [v, setV] = useState(2697.45);
  return (
    <div className="flex flex-col items-start gap-2 text-sm">
      <NumberRoll value={v} format={{ style: "currency", currency: "USD" }} />
      <NumberRoll value={v * 1000} format={{ notation: "compact", maximumFractionDigits: 1 }} suffix=" requests" />
      <NumberRoll value={v / 3000} format={{ style: "percent", maximumFractionDigits: 1 }} prefix="~" />
      <Button size="sm" className="mt-2" onClick={() => setV((x) => Math.round(x * (0.85 + Math.random() * 0.3) * 100) / 100)}>
        Change
      </Button>
    </div>
  );
}
```

## Rules

- **Do** use it for numbers that update **in place** while someone watches: live counters, totals, balances.
- **Do** give it the surrounding text size and weight through `className`. It has no typography of its own beyond tabular figures.
- **Don't** use it to "count up" on page load. It never animates the first value, by design.
- **Don't** use it for numbers that change many times a second. Above roughly 4 updates a second the rolls blur into noise, so throttle the value first.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | The number. |
| `format` | `Intl.NumberFormatOptions` | — | Currency, percent, compact, decimals… |
| `locale` | `Intl.LocalesArgument` | browser | Formatting locale. |
| `prefix` | `ReactNode` | — | Before the number. Doesn't roll. |
| `suffix` | `ReactNode` | — | After the number. Doesn't roll. |
| `...props` | `ComponentProps<"span">` | — | On the outer `<span>`. |

## Motion

- Each changed digit rolls one step in 180ms on `ease-snap`. The old digit leaves and the new one arrives from the direction of the change.
- Digits are matched from the right, so the ones digit stays the ones digit when the number gets longer. New leading digits and separators appear without motion.
- A new value arriving mid-roll restarts that digit cleanly. Digits never stack.
- Under `prefers-reduced-motion`, digits swap instantly.

## Accessibility

The full formatted value (with a string prefix and suffix) is rendered as visually hidden text. The rolling digits are `aria-hidden`, so screen readers read "$2,697.45", not the digits one by one.
