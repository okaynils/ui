---
title: Checkbox
description: A square on/off box for choices that apply on save, with an indeterminate state for "some of these".
group: Controls
order: 30
---

# Checkbox

A 16px square box. When ticked it fills with the accent and a white check scales in. Use it for options that are applied when the user submits, and for picking several items from a list.

```tsx
import { Checkbox } from "@nils/ui";
```

## Examples

### With a label

Pass `label` and the whole row becomes clickable.

```tsx live
<div className="flex flex-col gap-2.5">
  <Checkbox label="Run tests before deploy" defaultChecked />
  <Checkbox label="Notify the team" />
  <Checkbox label="Skip build cache" disabled />
</div>
```

### Indeterminate

A parent box for a set of children: ticked when all are, indeterminate when some are.

```tsx live
import { Checkbox } from "@nils/ui";
import { useState } from "react";

const regions = ["Stockholm", "Frankfurt", "Oregon"];

export default function Example() {
  const [on, setOn] = useState<string[]>(["Stockholm"]);
  const all = on.length === regions.length;
  return (
    <div className="flex flex-col gap-2.5">
      <Checkbox
        label="All regions"
        checked={all}
        indeterminate={on.length > 0 && !all}
        onCheckedChange={(checked) => setOn(checked ? regions : [])}
      />
      <div className="flex flex-col gap-2.5 pl-6">
        {regions.map((r) => (
          <Checkbox
            key={r}
            label={r}
            checked={on.includes(r)}
            onCheckedChange={(checked) => setOn(checked ? [...on, r] : on.filter((x) => x !== r))}
          />
        ))}
      </div>
    </div>
  );
}
```

### Bare

Without `label`, give it an `aria-label`. This is usually for a table row.

```tsx live
<div className="flex items-center gap-3">
  <Checkbox aria-label="Select row" />
  <Checkbox aria-label="Select row" defaultChecked />
  <Checkbox aria-label="Select all" indeterminate />
</div>
```

## Rules

- **Do** use `Checkbox` when the change applies on save, or for multi-select. Use `Switch` when it applies immediately.
- **Do** phrase labels as the "on" state: "Notify the team", not "Don't notify the team".
- **Don't** use a single checkbox for a choice between two named options. Use `RadioGroup` or `SegmentedControl`.
- **Don't** colour a checkbox by status. Ticked is always accent.

## Props

Extends Base UI's [Checkbox.Root](https://base-ui.com/react/components/checkbox) props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Text to the right; the label element wraps both. |
| `checked` / `defaultChecked` | `boolean` | — | Controlled / uncontrolled state. |
| `onCheckedChange` | `(checked: boolean, details) => void` | — | Fires on toggle. |
| `indeterminate` | `boolean` | `false` | Shows a dash. Visual only, so you decide what a click does. |
| `disabled` | `boolean` | `false` | 45% opacity, label text turns `ink-3`. |
| `name` / `value` / `required` | — | — | Form integration through a hidden input. |
| `className` | `string` | — | Layout only. On the label when `label` is set. |

## Accessibility

Renders `role="checkbox"` with `aria-checked` (`"mixed"` when indeterminate) and a hidden native input for forms. Space toggles it. Inside `Field`, it gets the field's label and description.

## Motion

Fill colour 120ms. The check scales from 50% to 100% with a fade in 150ms, and leaves in 100ms. The box gives a little (`ui-press`) while pressed.
