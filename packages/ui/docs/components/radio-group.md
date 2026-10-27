---
title: Radio group
description: Pick exactly one of a few options that should all stay visible. Radio + RadioGroup.
group: Controls
order: 31
---

# Radio group

Pick exactly one of 2–5 options that should all stay visible, especially when each one needs a sentence of explanation. Each `Radio` is a 16px circle that fills with the accent when selected.

```tsx
import { Radio, RadioGroup } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<RadioGroup label="Plan" defaultValue="hobby">
  <Radio value="hobby" label="Hobby" />
  <Radio value="pro" label="Pro" />
  <Radio value="team" label="Team" disabled />
</RadioGroup>
```

### With descriptions

When options need explaining, put the description under each label. The whole block stays clickable.

```tsx live
import { Radio, RadioGroup } from "@nils/ui";

const options = [
  { value: "rolling", title: "Rolling", body: "Replace instances one at a time. No downtime." },
  { value: "recreate", title: "Recreate", body: "Stop everything, then start the new version." },
];

export default function Example() {
  return (
    <RadioGroup label="Deploy strategy" defaultValue="rolling" className="w-80">
      {options.map((o) => (
        <Radio
          key={o.value}
          value={o.value}
          className="items-start [&>span:first-child]:mt-0.5"
          label={
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{o.title}</span>
              <span className="text-xs text-ink-2">{o.body}</span>
            </span>
          }
        />
      ))}
    </RadioGroup>
  );
}
```

### Horizontal

```tsx live
<RadioGroup label="Units" defaultValue="metric" orientation="horizontal">
  <Radio value="metric" label="Metric" />
  <Radio value="imperial" label="Imperial" />
</RadioGroup>
```

## Rules

- **Do** pick a sensible default. A radio group should almost never start empty.
- **Do** use `SegmentedControl` instead when the options are short words and switching shows a different view right away.
- **Don't** use radios for more than ~5 options. That's a `Select`.
- **Don't** use radios for on/off. That's a `Checkbox` or `Switch`.

## Props

### RadioGroup

Extends Base UI's [RadioGroup](https://base-ui.com/react/components/radio-group) props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Group label, styled like a `Field` label and linked with `aria-labelledby`. |
| `value` / `defaultValue` | `Value` | — | Controlled / uncontrolled selection. |
| `onValueChange` | `(value: Value, details) => void` | — | Fires on change. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Column or wrapping row. |
| `name` / `required` / `disabled` | — | — | Form integration. |
| `className` | `string` | — | Layout only. |

### Radio

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Value` | — | Required. |
| `label` | `ReactNode` | — | Text to the right; the whole label is clickable. |
| `disabled` | `boolean` | `false` | |
| `className` | `string` | — | Layout only. On the label when `label` is set. |

## Accessibility

`role="radiogroup"` containing `role="radio"` items. Arrow keys move the selection, and Tab enters and leaves the group as one stop. If you don't pass `label`, give the group an `aria-label`.

## Motion

Fill colour 120ms. The inner dot scales in over 150ms.
