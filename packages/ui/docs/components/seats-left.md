---
title: SeatsLeft
description: Honest scarcity — every seat drawn as a square, the taken ones filled; a claimed seat lights up and the count rolls down.
group: Gimmicks
order: 260
---

# SeatsLeft

"7 of 20 founding spots left", with every seat drawn as a small square and the taken ones filled in. It's the scarcity line from a launch page, made honest: the visitor can see exactly how many seats there are and how many are gone. When someone claims a seat, its square lights up and the count rolls down. Your app counts the seats; the widget only draws them.

```tsx
import { SeatsLeft } from "@nils/ui";
import type { SeatsLeftProps } from "@nils/ui";
```

## Examples

### Founding spots

```tsx live
<SeatsLeft
  label="Founding spots"
  total={20}
  taken={13}
  caption="Founding price is locked in for life. It goes up after the last one."
/>
```

### Claiming a seat

Pass the new `taken` when a seat is claimed. Only the newly claimed squares light up, and the count rolls down; nothing moves on first render.

```tsx live
import { useState } from "react";
import { Button, SeatsLeft } from "@nils/ui";

export default function Example() {
  const [taken, setTaken] = useState(16);
  return (
    <div className="flex flex-col items-start gap-4">
      <SeatsLeft label="Workshop seats" noun="seats" total={24} taken={taken} />
      <Button size="sm" disabled={taken >= 24} onClick={() => setTaken((current) => Math.min(24, current + 1))}>
        Someone booked a seat
      </Button>
    </div>
  );
}
```

### Sold out, and large totals

When every seat is taken, the count becomes a plain sentence. Above 60 seats, each square stands for several and the caption says how many; a square only fills once every seat in it is gone.

```tsx live
<div className="flex flex-col items-start gap-6">
  <SeatsLeft label="Beta" total={12} taken={12} soldOut="The beta is full. Join the waitlist for the next round." />
  <SeatsLeft label="Early bird tickets" noun="tickets" total={400} taken={286} />
</div>
```

## Rules

- **Do** pass the real numbers. `taken` is what your app counted, and the page should agree with it everywhere.
- **Do** say what happens when the seats run out in `caption`, e.g. the price changes or a waitlist opens.
- **Do** write `soldOut` copy that points somewhere, like a waitlist or the next round.
- **Don't** fake demand by bumping `taken` on a timer or inventing a total. Scarcity that isn't real is a dark pattern.
- **Don't** use it for capacity that doesn't run out, such as "spots" on a free plan. It's for things that really end.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `total` | `number` | Required | Every seat there is. Non-positive or invalid totals show "No spots to claim." |
| `taken` | `number` | Required | Seats claimed so far. Clamped to `0…total`. |
| `label` | `ReactNode` | `"Spots"` | `ui-label` above the count. A string also names the group. |
| `noun` | `string` | `"spots"` | What a seat is called in the count line: "seats", "tickets", "places". |
| `caption` | `ReactNode` | — | A quiet line under the squares. |
| `soldOut` | `ReactNode` | `"All {total} {noun} are taken."` | Replaces the count when nothing is left. |
| `locale` | `string` | `"en-GB"` | Number formatting. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes, including `ref`. |

## Motion

The claimed seat is this widget's signature move. When `taken` grows after the first render, each newly filled square arrives in accent, slightly large, and settles to ink over 700ms on `ease-snap`. If several are claimed at once, they follow each other 30ms apart. At the same time the count rolls down (`NumberRoll`, 180ms). The flash runs after the seat is already counted as taken, so nothing waits on it. Nothing moves on first render, when `taken` goes down, or under `prefers-reduced-motion`.

## Accessibility

The count is plain text ("7 of 20 spots left"), and the group is named by `label` when it's a string. The squares are hidden from assistive technology, because they repeat the count. Changes aren't announced; if a claim matters to the visitor, announce it the way your app usually does.
