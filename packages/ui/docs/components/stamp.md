---
title: Stamp
description: A rubber stamp with uneven ink that lands with a thunk when an action completes.
group: Gimmicks
order: 230
---

# Stamp

A rubber stamp: one or two words in a double-ruled box, tilted, inked a little unevenly, optionally with a date line. Use it to mark something as done in a way people remember, such as "Shipped", "Paid", "Read" or "Redeemed". When a stamp appears as the result of an action, it lands with a short thunk; stamps that are already on the page when it loads just sit there.

```tsx
import { Stamp } from "@nils/ui";
import type { StampProps, StampTone } from "@nils/ui";
```

## Examples

### Tones

Use the status tones for what they mean: `ok` for done, `err` for void or rejected. `ink` is the neutral default, and `accent` is for your own brand mark.

```tsx live
<div className="flex flex-wrap items-center gap-6 p-2">
  <Stamp>Draft</Stamp>
  <Stamp tone="ok" date="2026-10-26">Shipped</Stamp>
  <Stamp tone="err" rotate={4}>Void</Stamp>
  <Stamp tone="accent" rotate={-3}>Approved</Stamp>
</div>
```

### Stamped after an action

Mount the stamp when the action completes, positioned over the thing it marks.

```tsx live
import { useState } from "react";
import { Button, KeyValue, KeyValueItem, Panel, Stamp } from "@nils/ui";

export default function Example() {
  const [paid, setPaid] = useState(false);
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <div className="relative w-full">
        <Panel>
          <KeyValue>
            <KeyValueItem label="Invoice">INV-2026-118</KeyValueItem>
            <KeyValueItem label="Amount">€1,240.00</KeyValueItem>
            <KeyValueItem label="Due">31 Oct 2026</KeyValueItem>
          </KeyValue>
        </Panel>
        {paid ? <Stamp tone="ok" date={Date.now()} className="absolute top-3 right-4">Paid</Stamp> : null}
      </div>
      <Button size="sm" disabled={paid} onClick={() => setPaid(true)}>Mark as paid</Button>
    </div>
  );
}
```

## Rules

- **Do** keep it to one or two words. A stamp is a verdict, not a sentence.
- **Do** position it over what it marks, with `absolute` inside a `relative` wrapper, and keep the important text underneath readable.
- **Do** vary `rotate` slightly (between −8 and 8) when several stamps sit near each other.
- **Don't** use a stamp as a status badge in tables or lists. Use `Status` or `Badge` there; stamps are for moments.
- **Don't** stamp the same thing twice. One verdict per item.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | The word on the stamp. Printed in capitals. |
| `tone` | `"ink" \| "accent" \| "ok" \| "err"` | `"ink"` | Ink colour. |
| `date` | `Date \| string \| number` | — | Adds a date line, formatted in UTC. Invalid dates are left out. |
| `locale` | `string` | `"en-GB"` | Date formatting locale. |
| `rotate` | `number` | `-6` | Tilt in degrees. |
| `land` | `boolean` | `true` | Thunk when it mounts after page load. Set `false` to never animate. |
| `className` | `string` | — | Positioning and layout classes. |
| `...props` | `ComponentProps<"span">` | — | Standard attributes, including `ref`. |

## Motion

Landing is the stamp's signature move. A stamp that mounts after the page has loaded arrives slightly large and transparent and settles flat in 160ms on `ease-snap`, like a stamp coming down onto paper. There's no bounce. Stamps mounted in the first second after navigation are treated as part of the page and don't animate. Under `prefers-reduced-motion` stamps appear without motion.

## Accessibility

The stamp is plain text, so it's read as its word (and date, as a `<time>` element). The tilt and ink texture are visual only. If the stamp confirms an action, also announce the result the way your app normally does, e.g. with a toast; a stamp appearing is not announced on its own.
