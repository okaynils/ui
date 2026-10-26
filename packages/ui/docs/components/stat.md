---
title: Stat
description: One metric (label, value, optional delta and caption) and StatGroup, a hairline-divided row of them. Values roll when they change.
group: Data
order: 30
---

# Stat

One number with its label: GPU hours, spend, uptime. The value uses [NumberRoll](/components/number-roll), so when it updates only the changed digits roll. An optional delta shows how it moved, coloured by whether that's good news. Put several in a `StatGroup` for the strip at the top of a dashboard.

```tsx
import { Stat, StatGroup } from "@nils/ui";
```

## Examples

### A dashboard strip

```tsx live
import { Button, Stat, StatGroup } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [hours, setHours] = useState(1284.5);
  const [spend, setSpend] = useState(2697.45);
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <StatGroup className="w-full">
        <Stat label="GPU hours" value={hours} format={{ maximumFractionDigits: 1 }} delta={0.12} caption="vs. last week" />
        <Stat label="Spend" value={spend} format={{ style: "currency", currency: "USD" }} delta={0.08} better="down" caption="vs. last week" />
        <Stat label="Uptime" value={0.9994} format={{ style: "percent", minimumFractionDigits: 2 }} delta={0} />
        <Stat label="Queue" value={null} caption="Not connected" />
      </StatGroup>
      <Button
        size="sm"
        onClick={() => {
          setHours((h) => Math.round((h + Math.random() * 40) * 10) / 10);
          setSpend((s) => Math.round((s + Math.random() * 80) * 100) / 100);
        }}
      >
        Add usage
      </Button>
    </div>
  );
}
```

### Small, inside a panel

`size="sm"` for side panels. Inside a `Panel`, use `StatGroup flush` so there's one frame, not two.

```tsx live
<Panel title="This month" flush className="w-full max-w-sm">
  <StatGroup flush>
    <Stat size="sm" label="Requests" value={182340} format={{ notation: "compact" }} />
    <Stat size="sm" label="p95" value="212 ms" delta={-0.04} better="down" />
  </StatGroup>
</Panel>
```

## Rules

- **Do** set `better="down"` for costs, latency, error rates, anything where a rise is bad news. Otherwise a cost increase shows up green.
- **Do** pass `delta` as a fraction (`0.12` = 12%). Use `deltaFormat` for absolute deltas.
- **Do** keep labels to one or two words. The label is the column header of the number.
- **Don't** colour the value itself. Only the delta is coloured: arrow and number in `ok`/`err`, with no background. This is the one place status colour sits on text rather than a dot, because the delta *is* the status.
- **Don't** put more than five Stats in one group. Pick the five that matter.

## Props

### Stat

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Mono label above the value. |
| `value` | `number \| string \| null` | — | A number rolls when it changes. A string renders as-is. `null` shows a quiet "—". |
| `format` | `Intl.NumberFormatOptions` | — | Formatting for a numeric value (currency, percent, compact…). |
| `delta` | `number` | — | Change as a fraction. `0.12` → "▲ 12%". |
| `deltaFormat` | `Intl.NumberFormatOptions` | percent, ≤1 decimal | Formatting for the delta. |
| `better` | `"up" \| "down" \| "none"` | `"up"` | Which direction is good news. `none` keeps the delta in ink. |
| `caption` | `ReactNode` | — | Small text under the value. |
| `size` | `"sm" \| "md"` | `"md"` | Value at 17px or 24px. |

### StatGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `flush` | `boolean` | `false` | Drop the outer hairline (inside a `Panel`). |
| `children` | `Stat`s | — | Wraps into rows when narrow (min 168px per stat). Dividers follow. |

## Motion

The value rolls per changed digit (≤180ms, `ease-snap`), up for increases and down for decreases. Nothing else moves.

## Accessibility

- The full formatted value is in the accessible text. The rolling digits are `aria-hidden`.
- The delta arrow is hidden from screen readers and replaced by "up", "down" or "unchanged".
