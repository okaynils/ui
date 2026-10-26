---
title: Input
description: A single-line text field in three sizes, with optional leading and trailing adornments for icons, units and hints.
group: Controls
order: 20
---

# Input

A single-line text field. A hairline at rest, an accent ring while focused, red when invalid. Put it inside a [`Field`](/components/field) to give it a label, help text and errors.

```tsx
import { Input } from "@nils/ui";
```

## Examples

### Basic

Always give an input a label: a surrounding `Field`, or `aria-label` when the context makes the label obvious (a search bar).

```tsx live
<div className="w-64">
  <Field label="Project name">
    <Input placeholder="turbine-core" />
  </Field>
</div>
```

### Sizes

Heights match `Button`: `sm` 28px, `md` 32px (default), `lg` 36px. Controls on one row share one size.

```tsx live
<div className="flex w-full max-w-md items-center gap-2">
  <Input size="sm" placeholder="Small" aria-label="Small" />
  <Input size="md" placeholder="Medium" aria-label="Medium" />
  <Input size="lg" placeholder="Large" aria-label="Large" />
</div>
```

### Leading and trailing

`leading` and `trailing` take an icon, a unit, or a `Kbd` hint. They render in `ink-3`, inside the field, and clicking the field still focuses the text.

```tsx live
import { Input, Kbd } from "@nils/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <div className="flex w-72 flex-col gap-3">
      <Input aria-label="Search" placeholder="Search" leading={<MagnifyingGlassIcon />} trailing={<Kbd>⌘K</Kbd>} />
      <Input aria-label="Price" placeholder="0.00" inputMode="decimal" leading="$" trailing="USD" className="tabular-nums" />
      <Input aria-label="Weight" defaultValue="230" trailing="kg" />
    </div>
  );
}
```

### With a button

An input and a button on one row share a size.

```tsx live
<div className="flex w-80 items-center gap-2">
  <Input aria-label="Email" type="email" placeholder="you@example.com" />
  <Button variant="primary">Subscribe</Button>
</div>
```

### Invalid and disabled

Inside a `Field`, the `error` prop marks the input invalid. Disabled inputs drop to 45% opacity.

```tsx live
<div className="flex w-64 flex-col gap-4">
  <Field label="Subdomain" error="Already taken — try another.">
    <Input defaultValue="nils" />
  </Field>
  <Field label="Region" description="Set by your plan.">
    <Input defaultValue="eu-north-1" disabled />
  </Field>
</div>
```

## Rules

- **Do** label every input, with `Field` or `aria-label`.
- **Do** use `trailing` for units ("kg", "USD", "%") instead of putting them in the label.
- **Do** set `type`, `inputMode` and `autoComplete` so mobile keyboards and password managers help.
- **Don't** use placeholder text as the label. It disappears the moment you type.
- **Don't** restyle the field through `className`. It is for layout (`w-48`, `flex-1`).
- **Don't** use `Input` for multi-line text (use `Textarea`) or for picking from a list (use `Select`).

## Props

Extends Base UI's [Input](https://base-ui.com/react/components/input) and every native `<input>` attribute, except the native `size`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Height 28 / 32 / 36px. |
| `leading` | `ReactNode` | — | Icon or unit before the text, in `ink-3`. |
| `trailing` | `ReactNode` | — | Unit, `Kbd` or icon after the text, in `ink-3`. |
| `value` / `defaultValue` | `string` | — | Controlled / uncontrolled value. |
| `onValueChange` | `(value: string, details) => void` | — | Fires with the new string. `onChange` works too. |
| `className` | `string` | — | Layout only. Goes on the wrapper when adorned. |
| `ref` | `Ref<HTMLInputElement>` | — | Always the `<input>`, adorned or not. |

## Accessibility

- Renders a native `<input>`. Inside `Field`, the label, description and error are linked through `aria-labelledby` and `aria-describedby`, and `aria-invalid` is set for you.
- Adornments are visual. If a unit matters ("kg"), say it in the label as well, or use `aria-describedby`.
- The focus ring shows on keyboard and pointer focus. A text field always shows where you're typing.

## Motion

The hairline-to-ring change takes 120ms on `ease-snap`. Nothing else moves.
