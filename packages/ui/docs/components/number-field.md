---
title: NumberField
description: A number input with arrow-key stepping, optional −/+ buttons and units, and a scrubbable leading label you drag like a design tool.
group: Controls
order: 110
---

# NumberField

A number input. Arrow keys step (⇧ for ×10, ⌥ for ×0.1), the wheel scrubs while it's focused, and the `leading` label is a scrub handle: drag it left or right to change the value, the way you would in a design tool. That last part is one of the library's signature moments: direct manipulation, no animation needed.

```tsx
import { NumberField } from "@nils/ui";
```

## Examples

### Scrub

Hover the **W** and **H**, then drag sideways. The pointer becomes ↔ and the value follows your hand.

```tsx live
<div className="flex w-64 gap-2">
  <NumberField leading="W" unit="px" defaultValue={1280} min={0} aria-label="Width" />
  <NumberField leading="H" unit="px" defaultValue={800} min={0} aria-label="Height" />
</div>
```

### Steppers and units

```tsx live
<div className="w-44">
  <Field label="Replicas" description="Between 1 and 16.">
    <NumberField steppers defaultValue={3} min={1} max={16} />
  </Field>
</div>
```

### Formatting

`format` takes `Intl.NumberFormatOptions`, so currency, percent and grouping come out right for the locale. Typing still accepts plain numbers.

```tsx live
<div className="flex w-80 gap-2">
  <Field label="Budget">
    <NumberField defaultValue={2500} step={100} format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }} />
  </Field>
  <Field label="Threshold">
    <NumberField defaultValue={0.85} step={0.01} min={0} max={1} format={{ style: "percent" }} />
  </Field>
</div>
```

### Icon handle

Any short node works as the handle: an icon reads well in toolbars.

```tsx live
import { NumberField } from "@nils/ui";
import { ArrowsOutLineHorizontalIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <div className="w-36">
      <NumberField size="sm" leading={<ArrowsOutLineHorizontalIcon />} unit="px" defaultValue={16} min={0} step={4} aria-label="Gap" />
    </div>
  );
}
```

### Controlled

```tsx live
import { NumberField, Slider } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState<number | null>(40);
  return (
    <div className="flex w-80 items-center gap-3">
      <Slider value={value ?? 0} onValueChange={(v) => setValue(v as number)} thumbLabels={["Opacity"]} />
      <NumberField className="w-24 shrink-0" leading="%" value={value} onValueChange={setValue} min={0} max={100} aria-label="Opacity" />
    </div>
  );
}
```

## Rules

- **Do** use `leading` for a one- or two-character name ("W", "X", "%") or an icon. It is the scrub handle, so keep it short.
- **Do** put units in `unit` (display only) and money/percent in `format` (real formatting).
- **Do** set `min`/`max` when there are limits; they clamp stepping and scrubbing.
- **Don't** use it for numbers that aren't quantities (phone numbers, IDs, PINs) — that's `Input` or `OTPField`.
- **Don't** add steppers in dense toolbars; arrow keys and scrubbing cover it.

## Props

Extends Base UI's [NumberField Root](https://base-ui.com/react/components/number-field) props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `defaultValue` | `number \| null` | — | Controlled / initial value. |
| `onValueChange` | `(value: number \| null) => void` | — | Called on every change, including while scrubbing. |
| `onValueCommitted` | `(value: number \| null) => void` | — | Called once the user is done (blur, pointer up). Use it for saves. |
| `min` / `max` / `step` | `number` | — / — / `1` | Limits and step. ⇧ steps ×10 (`largeStep`), ⌥ ×0.1 (`smallStep`). |
| `format` | `Intl.NumberFormatOptions` | — | Display formatting. |
| `leading` | `ReactNode` | — | Short label inside the field; drag it to scrub. |
| `unit` | `ReactNode` | — | Unit after the number, in ink-3. |
| `steppers` | `boolean` | `false` | − / + buttons at the right edge. |
| `scrubSensitivity` | `number` | `2` | Pixels of drag per step. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 28 / 32 / 36px. |
| `placeholder` | `string` | — | Shown while empty. |
| `aria-label` | `string` | — | Needed without a surrounding `Field` label. |
| `className` | `string` | — | Layout only (width). |

## Accessibility

- The input is a real `role="textbox"` with `inputmode="decimal"`; arrow keys, Page Up/Down, Home/End work as in native number inputs.
- Scrubbing uses pointer lock, so the drag never runs off the screen; a ↔ cursor is drawn in its place.
- The steppers are labelled "Decrease" / "Increase" and are skipped by Tab (the keyboard already steps).
