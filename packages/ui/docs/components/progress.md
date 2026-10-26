---
title: Progress & Meter
description: Thin bars for how far a task has got (Progress, accent, can be indeterminate) and for a level within a range (Meter, neutral, warns past thresholds). Optional segmented console look.
group: Data
order: 70
---

# Progress & Meter

Two thin bars that look alike but mean different things.

- **Progress**: a task moving toward done (an upload, a build). Accent fill. `value={null}` when you don't know how long.
- **Meter**: a level within a known range (disk used, quota, memory). Neutral fill that turns amber or red past the `thresholds` you set.

Both can be drawn as discrete `segments` for the console look.

```tsx
import { Progress, Meter } from "@nils/ui";
```

## Examples

### Progress

```tsx live
import { Button, Progress } from "@nils/ui";
import { useEffect, useState } from "react";

export default function Example() {
  const [v, setV] = useState(12);
  useEffect(() => {
    const t = setInterval(() => setV((x) => (x >= 100 ? 0 : Math.min(100, x + Math.random() * 18))), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Progress label="Uploading weights.safetensors" value={Math.round(v)} />
      <Progress label="Provisioning" value={null} />
      <Progress value={Math.round(v)} aria-label="Build" />
    </div>
  );
}
```

### Meter with thresholds

The fill stays neutral until it crosses `warn`, then amber, then red past `err`.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-5">
  <Meter label="Disk" value={41} thresholds={{ warn: 75, err: 90 }} />
  <Meter label="Memory" value={82} thresholds={{ warn: 75, err: 90 }} />
  <Meter label="Quota" value={96} thresholds={{ warn: 75, err: 90 }} />
</div>
```

### Segments

`segments={20}` draws discrete blocks. It reads at a glance and fits dense console screens.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-5">
  <Meter label="GPU util" value={65} segments={20} />
  <Meter label="VRAM" value={93} segments={20} thresholds={{ warn: 80, err: 90 }} />
  <Progress label="Epoch 3 / 10" value={30} segments={10} />
</div>
```

### Custom value format

`format` takes `Intl.NumberFormat` options and `min`/`max` set the range. The value text follows.

```tsx live
<Meter
  className="max-w-sm"
  label="Storage"
  value={1.42}
  min={0}
  max={2}
  format={{ style: "unit", unit: "terabyte", maximumFractionDigits: 2 }}
  thresholds={{ warn: 1.6 }}
/>
```

## Rules

- **Do** use Progress for *time* (a task getting done) and Meter for *amount* (how full something is).
- **Do** use `value={null}` when you can't estimate. Never fake a progress bar that crawls to 90% and waits.
- **Do** set `thresholds` on Meters whose high values are a problem. Colour then only appears when it means something.
- **Don't** give a Meter the accent colour. Blue means "do this" or "you are here", not "how full".
- **Don't** use a bar for a value under ~3 discrete states. Use `Status`.

## Props

### Progress

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| null` | — | Progress in `min`–`max`. `null` = indeterminate. |
| `min` / `max` | `number` | `0` / `100` | Range. |
| `label` | `ReactNode` | — | Text above the bar, left. |
| `showValue` | `boolean` | on with a label | Mono value above the bar, right. |
| `format` | `Intl.NumberFormatOptions` | percent | Value formatting. |
| `segments` | `number` | — | Draw N discrete blocks. |
| `aria-label` | `string` | — | Needed when there's no `label`. |

### Meter

Same as Progress (except `value` is always a number), plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `thresholds` | `{ warn?: number; err?: number }` | — | In value units. At or above `warn` → amber, `err` → red. |
| `tone` | `"neutral" \| "accent" \| "ok" \| "warn" \| "err"` | from thresholds | Force a fill colour. |

## Motion

- The fill eases to new values in 200ms on `ease-snap`. A jump in progress is visible, not a crawl.
- Indeterminate: a 40% segment loops across in 1.1s on a **linear** curve. Like a spinner, it's an ambient loop, not a response to input, so linear is allowed here and only here. It stops under `prefers-reduced-motion`.
- Segments change colour in 120ms.

## Accessibility

Base UI renders `role="progressbar"` / `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a formatted `aria-valuetext`. The `label` is wired as the accessible name. Without one, pass `aria-label`.
