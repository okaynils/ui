---
title: Slider
description: Pick a number or a range by dragging. A firm square thumb, an accent fill, optional ticks and a mono value readout.
group: Controls
order: 120
---

# Slider

Pick a number, or a range, by dragging. Good when the rough position matters more than the exact digit: volume, opacity, a price band. The thumb is a small, firm square — it reads as a fader you grip, not a bubble — and it grows a touch while dragged so you can see you have it.

```tsx
import { Slider } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<div className="w-72">
  <Field label="Volume">
    <Slider defaultValue={60} showValue />
  </Field>
</div>
```

### Range

Give an array to get two thumbs. Name each thumb with `thumbLabels`.

```tsx live
<div className="w-72">
  <Field label="Price per hour">
    <Slider
      defaultValue={[1.5, 3.25]}
      min={0}
      max={5}
      step={0.25}
      showValue
      format={{ style: "currency", currency: "USD" }}
      thumbLabels={["Minimum price", "Maximum price"]}
    />
  </Field>
</div>
```

### Marks

`marks` draws ticks; `markLabels` prints their values in mono.

```tsx live
<div className="w-72">
  <Field label="Replicas">
    <Slider defaultValue={4} min={0} max={16} step={4} marks={[0, 4, 8, 12, 16]} markLabels />
  </Field>
</div>
```

### With an exact field

When exact numbers matter too, pair it with a `NumberField`.

```tsx live
import { NumberField, Slider } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(72);
  return (
    <div className="flex w-80 items-center gap-3">
      <Slider value={value} onValueChange={(v) => setValue(v as number)} thumbLabels={["Quality"]} />
      <NumberField className="w-20 shrink-0" value={value} onValueChange={(v) => setValue(v ?? 0)} min={0} max={100} aria-label="Quality" />
    </div>
  );
}
```

### Disabled

```tsx live
<div className="w-72">
  <Slider defaultValue={30} disabled thumbLabels={["Brightness"]} />
</div>
```

## Rules

- **Do** show the value (`showValue`) unless the position is the whole point (like volume).
- **Do** label every thumb of a range slider with `thumbLabels`.
- **Do** pair with `NumberField` when people will want an exact number.
- **Don't** use a slider for fewer than ~5 discrete choices — that's `SegmentedControl`.
- **Don't** use it for values without a sensible min and max.

## Props

Extends Base UI's [Slider Root](https://base-ui.com/react/components/slider) props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `defaultValue` | `number \| number[]` | — | A number for one thumb, an array for a range. |
| `onValueChange` | `(value: number \| number[]) => void` | — | Called while dragging. |
| `onValueCommitted` | `(value: number \| number[]) => void` | — | Called on release. Use it for saves. |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` | Limits and step. ⇧ + arrows and Page Up/Down use `largeStep`. |
| `format` | `Intl.NumberFormatOptions` | — | Formats the readout and the screen-reader value. |
| `showValue` | `boolean` | `false` | Mono value readout at the right. |
| `marks` | `number[]` | — | Values to draw ticks at. |
| `markLabels` | `boolean` | `false` | Print each mark's value under it. |
| `thumbLabels` | `string[]` | — | Accessible name per thumb. Required for ranges. |
| `disabled` | `boolean` | — | Greys the whole slider. |
| `className` | `string` | — | Layout only (width). |

## Accessibility

- Each thumb is a real `<input type="range">`, so arrow keys, Page Up/Down, Home/End work, and screen readers announce the formatted value.
- Inside a `Field`, the label names the slider; for ranges, `thumbLabels` names each thumb.

## Motion

The thumb scales to 110% while dragged and its ring turns accent (120ms, `ease-snap`). Nothing else moves.
