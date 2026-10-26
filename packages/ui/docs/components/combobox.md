---
title: Combobox
description: A text field with a filtered list. Pick one, several (as chips), or type something new with creatable — that's the tag input.
group: Controls
order: 100
---

# Combobox

A text field that filters a list as you type. Use it when a `Select` would be too long to scan: regions, people, repositories, labels. Pass `multiple` to pick several (they sit in the field as chips), and `creatable` to let people add values that aren't in the list.

```tsx
import { Combobox } from "@nils/ui";
```

## Examples

### Single

The first match is highlighted as you type, so Enter picks it.

```tsx live
<div className="w-64">
  <Field label="Region">
    <Combobox
      placeholder="Search regions"
      items={[
        { value: "eu-north-1", label: "Stockholm", description: "eu-north-1" },
        { value: "eu-central-1", label: "Frankfurt", description: "eu-central-1" },
        { value: "eu-west-2", label: "London", description: "eu-west-2" },
        { value: "us-east-1", label: "Virginia", description: "us-east-1" },
        { value: "us-west-2", label: "Oregon", description: "us-west-2" },
        { value: "ap-northeast-1", label: "Tokyo", description: "ap-northeast-1" },
        { value: "ap-southeast-2", label: "Sydney", description: "ap-southeast-2", disabled: true },
      ]}
    />
  </Field>
</div>
```

### Multiple

Picked values become chips. Backspace in the empty input removes the last one; each chip has its own remove button.

```tsx live
import { Combobox, Field } from "@nils/ui";
import { useState } from "react";

const people = [
  { value: "ada", label: "Ada Lovelace" },
  { value: "grace", label: "Grace Hopper" },
  { value: "alan", label: "Alan Turing" },
  { value: "linus", label: "Linus Torvalds" },
  { value: "margaret", label: "Margaret Hamilton" },
  { value: "dennis", label: "Dennis Ritchie" },
];

export default function Example() {
  const [value, setValue] = useState(["ada", "grace"]);
  return (
    <div className="w-80">
      <Field label="Reviewers" description={`${value.length} selected`}>
        <Combobox multiple items={people} value={value} onValueChange={setValue} placeholder="Add reviewers" />
      </Field>
    </div>
  );
}
```

### Tag input (creatable)

With `creatable`, typing something that isn't in the list offers **Create “…”**. Enter picks it when it's the only option left. Created values come back as the typed text.

```tsx live
<div className="w-80">
  <Field label="Labels">
    <Combobox
      multiple
      creatable
      placeholder="Add a label"
      defaultValue={["bug"]}
      items={[
        { value: "bug", label: "bug" },
        { value: "docs", label: "docs" },
        { value: "design", label: "design" },
        { value: "perf", label: "perf" },
      ]}
    />
  </Field>
</div>
```

### With icons

```tsx live
import { Combobox, Field } from "@nils/ui";
import { GitBranchIcon } from "@phosphor-icons/react";

const branches = ["main", "release/0.2", "feat/combobox", "fix/date-parse", "chore/deps"].map((b) => ({
  value: b,
  label: b,
  icon: <GitBranchIcon />,
}));

export default function Example() {
  return (
    <div className="w-64">
      <Field label="Branch">
        <Combobox items={branches} defaultValue="main" />
      </Field>
    </div>
  );
}
```

### In a form

Like every control, it reports to `Field` and `Form`: `required` shows a message under the field on submit, and `name` submits the value (each value, for `multiple`).

```tsx live
import { Button, Combobox, Field, Form } from "@nils/ui";

export default function Example() {
  return (
    <Form className="flex w-64 flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
      <Field label="Owner" name="owner">
        <Combobox
          required
          placeholder="Pick a team"
          items={[
            { value: "infra", label: "Infrastructure" },
            { value: "web", label: "Web" },
            { value: "data", label: "Data" },
          ]}
        />
      </Field>
      <Button type="submit" className="self-start">Save</Button>
    </Form>
  );
}
```

## Rules

- **Do** use it when there are more than ~10 options, or when people know what they're looking for and want to type it.
- **Do** give `description` for a code or ID that people might search by; it's matched too, and shown in mono.
- **Do** use `multiple` + `creatable` for tags and labels instead of building a tag input.
- **Don't** use it for under ~7 options that fit on screen — use `Select`, `RadioGroup` or `SegmentedControl`.
- **Don't** use it to trigger actions; that's `Menu` or `CommandPalette`.
- **Don't** make labels ReactNodes. They're strings, because typing filters against them.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ComboboxItem[]` | — | `{ value: string, label: string, icon?, description?, disabled? }` |
| `multiple` | `boolean` | `false` | Pick several; values become chips. Switches `value` to `string[]`. |
| `value` | `string \| null` / `string[]` | — | Controlled selection. |
| `defaultValue` | `string \| null` / `string[]` | — | Uncontrolled initial selection. |
| `onValueChange` | `(value) => void` | — | Called with the new value (or values). |
| `creatable` | `boolean` | `false` | Offer "Create “…”" for text that matches nothing. |
| `placeholder` | `string` | — | Shown while empty. |
| `emptyText` | `ReactNode` | `"No matches."` | Shown when the filter leaves nothing. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Height of the single-value field. |
| `name` | `string` | — | Form field name. |
| `required` / `disabled` | `boolean` | — | As on any input. |
| `aria-label` | `string` | — | Needed without a surrounding `Field` label. |
| `className` | `string` | — | Layout only (width). |

## Accessibility

- Built on Base UI Combobox: a real `role="combobox"` input with a `listbox` popup, `aria-activedescendant` for the highlighted option, and the chips announced as a group ("Press Backspace or Delete to remove").
- Arrow keys move through options, Enter picks, Escape closes, and from the start of the input ← moves into the chips.
- Highlight is instant; the popup grows from the field (150ms in, 100ms out).
