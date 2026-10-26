---
title: Switch
description: An on/off setting that takes effect the moment you flip it.
group: Controls
order: 32
---

# Switch

A small track and thumb for a setting that **applies immediately**, like a light switch. The track fills with the accent when on, and the thumb slides over in 150ms.

```tsx
import { Switch } from "@nils/ui";
```

## Examples

### With a label

The label goes first and the switch sits at the end of the row, as in a settings list.

```tsx live
<div className="flex w-64 flex-col gap-3">
  <Switch label="Auto-deploy main" defaultChecked />
  <Switch label="Preview comments" />
  <Switch label="Legacy runtime" disabled />
</div>
```

### Settings list

Rows separated by hairlines, not cards. Make the label stretch with `className="w-full"`.

```tsx live
import { Switch } from "@nils/ui";

const settings = [
  { label: "Email on failed deploy", on: true },
  { label: "Weekly usage digest", on: false },
  { label: "Show keyboard hints", on: true },
];

export default function Example() {
  return (
    <div className="w-80 divide-y divide-line rounded-box bg-surface shadow-[0_0_0_1px_var(--ui-line)]">
      {settings.map((s) => (
        <div key={s.label} className="px-3 py-2.5">
          <Switch label={s.label} defaultChecked={s.on} className="w-full" />
        </div>
      ))}
    </div>
  );
}
```

### Bare

```tsx live
<Switch aria-label="Dark mode" />
```

## Rules

- **Do** use a switch only when flipping it changes something right away. If a Save button applies the change, use a `Checkbox`.
- **Do** write the label as the thing being turned on ("Auto-deploy"), not as a question.
- **Don't** add "On"/"Off" text next to it. The track already shows the state.
- **Don't** use a switch to choose between two different things (light/dark). That's a `SegmentedControl`.

## Props

Extends Base UI's [Switch.Root](https://base-ui.com/react/components/switch) props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Text before the switch; the label wraps both. |
| `checked` / `defaultChecked` | `boolean` | — | Controlled / uncontrolled. |
| `onCheckedChange` | `(checked: boolean, details) => void` | — | Fires on toggle. |
| `disabled` | `boolean` | `false` | |
| `name` / `value` / `required` | — | — | Form integration through a hidden input. |
| `className` | `string` | — | Layout only. On the label when `label` is set. |

## Accessibility

Renders `role="switch"` with `aria-checked`. Space toggles it. Without `label`, give it an `aria-label`.

## Motion

The thumb slides 12px in 150ms on `ease-snap`, and the track colour changes over the same 150ms. No bounce.
