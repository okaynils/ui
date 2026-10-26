---
title: Select
description: Pick one value from a list in a popup. A props API for the common case, parts for groups and custom items.
group: Controls
order: 50
---

# Select

Pick one value from a list that is too long, or too minor, to show in full. The trigger looks like an `Input`. The list opens below it, grows from the trigger, and marks the current value with a check.

```tsx
import { Select } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<div className="w-56">
  <Field label="Region">
    <Select
      placeholder="Choose a region"
      items={[
        { value: "eu-north-1", label: "Stockholm" },
        { value: "eu-central-1", label: "Frankfurt" },
        { value: "us-east-1", label: "Virginia" },
        { value: "us-west-2", label: "Oregon" },
        { value: "ap-northeast-1", label: "Tokyo" },
      ]}
    />
  </Field>
</div>
```

### Controlled

```tsx live
import { Select } from "@nils/ui";
import { useState } from "react";

const machines = [
  { value: "h100", label: "H100 · 80 GB" },
  { value: "a100", label: "A100 · 40 GB" },
  { value: "l4", label: "L4 · 24 GB" },
];

export default function Example() {
  const [value, setValue] = useState<string | null>("a100");
  return (
    <div className="flex w-56 flex-col gap-2">
      <Select aria-label="Machine" items={machines} value={value} onValueChange={setValue} />
      <span className="font-mono text-xs text-ink-3">value = {String(value)}</span>
    </div>
  );
}
```

### Sizes

Matches `Button` and `Input`: `sm` 28px, `md` 32px, `lg` 36px.

```tsx live
<div className="flex items-center gap-2">
  <Select size="sm" aria-label="Small" defaultValue="a" items={[{ value: "a", label: "Small" }]} className="w-28" />
  <Select size="md" aria-label="Medium" defaultValue="a" items={[{ value: "a", label: "Medium" }]} className="w-28" />
  <Select size="lg" aria-label="Large" defaultValue="a" items={[{ value: "a", label: "Large" }]} className="w-28" />
</div>
```

### Groups, with parts

For groups, separators or richer items, compose the parts. Pass `items` to `SelectRoot` so the trigger can show the selected label.

```tsx live
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectSeparator, SelectTrigger } from "@nils/ui";

const items = [
  { value: "inter", label: "Inter" },
  { value: "geist", label: "Geist" },
  { value: "jetbrains", label: "JetBrains Mono" },
  { value: "berkeley", label: "Berkeley Mono" },
];

export default function Example() {
  return (
    <SelectRoot items={items} defaultValue="inter">
      <SelectTrigger aria-label="Font" className="w-52" />
      <SelectContent>
        <SelectGroup label="Sans">
          <SelectItem value="inter">Inter</SelectItem>
          <SelectItem value="geist">Geist</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup label="Mono">
          <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
          <SelectItem value="berkeley" disabled>Berkeley Mono</SelectItem>
        </SelectGroup>
      </SelectContent>
    </SelectRoot>
  );
}
```

## Rules

- **Do** wrap it in a `Field` with a label, or pass `aria-label`.
- **Do** order options meaningfully: alphabetical, by size, or by how often they are picked.
- **Do** use `SegmentedControl` or `RadioGroup` instead when there are 2–5 options and they're worth seeing at once.
- **Don't** use `Select` for actions. "Export as…" is a `Menu`.
- **Don't** put more than ~15 items in it without groups. For long lists with typing, use a combobox (not in the library yet).

## Props

### Select

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `{ value, label, disabled? }[]` | — | Options, in order. |
| `value` / `defaultValue` | `Value \| null` | — | Controlled / uncontrolled selection. |
| `onValueChange` | `(value: Value \| null) => void` | — | Fires with the new value. |
| `placeholder` | `ReactNode` | — | Shown in `ink-3` while nothing is selected. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Trigger height. |
| `name` / `required` / `disabled` | — | — | Form integration through a hidden input. |
| `aria-label` | `string` | — | When there's no `Field` label. |
| `className` | `string` | — | Trigger layout (defaults to `w-full`). |

### Parts

| Part | Wraps | Notes |
| --- | --- | --- |
| `SelectRoot` | `Select.Root` | All Base UI root props. Pass `items` for label lookup. |
| `SelectTrigger` | `Select.Trigger` + `Value` + `Icon` | `size`, `placeholder`. |
| `SelectContent` | `Portal` + `Positioner` + `Popup` + `List` | Opens below, at least trigger-wide, max 20rem tall. |
| `SelectItem` | `Select.Item` | `value`, `disabled`. Check on the right when selected. |
| `SelectGroup` | `Select.Group` | `label` renders a `ui-label` heading. |
| `SelectSeparator` | `Select.Separator` | Hairline between groups. |

## Accessibility

The trigger is a `<button>` that opens a `listbox`. Arrow keys move through the options, typing jumps to a match, Enter selects and Esc closes. Focus returns to the trigger afterwards. Inside `Field`, the label and description are linked.

## Motion

The list grows from the trigger (`scale 0.96 → 1` + fade) in 150ms and closes in 100ms. Highlighting an item is instant, because it follows the keyboard.
