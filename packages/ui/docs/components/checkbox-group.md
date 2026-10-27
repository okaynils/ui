---
title: CheckboxGroup
description: Several checkboxes with one shared array value, an optional "select all", and Fieldset for naming any group of related controls.
group: Controls
order: 33
---

# CheckboxGroup

Several independent yes/no choices about one thing (which channels to notify, which regions to deploy to), with one shared value: the array of ticked options. It can add a "select all" checkbox that shows a dash when only some are ticked. Its sibling `Fieldset` names any group of related controls (an address, a `RadioGroup`, a few switches), so a screen reader announces the group's name when focus enters it. Built on Base UI's CheckboxGroup, Fieldset and Field.

```tsx
import { CheckboxGroup, Fieldset } from "@nils/ui";
import type { CheckboxGroupProps, CheckboxGroupItem, FieldsetProps } from "@nils/ui";
```

## Examples

### Options with descriptions

```tsx live
<CheckboxGroup
  label="Notify me about"
  defaultValue={["deploys"]}
  items={[
    { value: "deploys", label: "Deploys", description: "When a deploy starts, succeeds or fails." },
    { value: "incidents", label: "Incidents", description: "Only when you're on call." },
    { value: "billing", label: "Billing" },
  ]}
/>
```

### Select all

`selectAll` adds a parent checkbox. It ticks or clears every option and shows a dash when some are ticked. Disabled options are left alone.

```tsx live
import { useState } from "react";
import { CheckboxGroup } from "@nils/ui";

export default function Example() {
  const [regions, setRegions] = useState(["eu-north-1"]);
  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup
        label="Deploy to"
        selectAll="All regions"
        value={regions}
        onValueChange={setRegions}
        items={[
          { value: "eu-north-1", label: "eu-north-1 (Stockholm)" },
          { value: "eu-west-1", label: "eu-west-1 (Ireland)" },
          { value: "us-east-1", label: "us-east-1 (Virginia)" },
          { value: "ap-south-1", label: "ap-south-1 (Mumbai)", disabled: true },
        ]}
      />
      <span className="font-mono text-xs text-ink-2">value: {JSON.stringify(regions)}</span>
    </div>
  );
}
```

### In a form, with validation

With a `name`, the group is submitted as the array of ticked values. Pass `error` to explain what's wrong; it's shown under the group and marks it invalid.

```tsx live
import { useState } from "react";
import { Button, CheckboxGroup, Form } from "@nils/ui";

export default function Example() {
  const [channels, setChannels] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  return (
    <Form
      className="max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        setError(channels.length === 0 ? "Pick at least one channel." : undefined);
      }}
    >
      <CheckboxGroup
        name="channels"
        label="Send alerts to"
        orientation="horizontal"
        value={channels}
        onValueChange={(next) => { setChannels(next); setError(undefined); }}
        error={error}
        items={[
          { value: "email", label: "Email" },
          { value: "slack", label: "Slack" },
          { value: "sms", label: "SMS" },
        ]}
      />
      <Button type="submit" className="self-start">Save</Button>
    </Form>
  );
}
```

### Checkbox children

For custom layouts, pass `Checkbox` children with a `value` each instead of `items`. With `selectAll`, also pass `allValues`.

```tsx live
<CheckboxGroup label="Columns" selectAll allValues={["name", "status", "region"]} defaultValue={["name", "status"]} orientation="horizontal">
  <Checkbox value="name" label="Name" />
  <Checkbox value="status" label="Status" />
  <Checkbox value="region" label="Region" />
</CheckboxGroup>
```

### Fieldset around other controls

`Fieldset` names a group of any controls. Here it holds a `RadioGroup` and a `Switch`; `disabled` would disable all of them.

```tsx live
<Fieldset legend="Backups" description="Applies to every database in this project." className="max-w-sm">
  <RadioGroup aria-label="Frequency" defaultValue="daily">
    <Radio value="hourly" label="Hourly" />
    <Radio value="daily" label="Daily" />
    <Radio value="weekly" label="Weekly" />
  </RadioGroup>
  <Switch label="Keep backups for 30 days" defaultChecked />
</Fieldset>
```

## Rules

- **Do** use a CheckboxGroup when several options can be true at once. If only one can, it's a `RadioGroup`.
- **Do** give every group a `label` (or a `Fieldset` `legend`). It's what a screen reader says when focus enters the group.
- **Do** order options by how often they're picked, not alphabetically, unless the list is long enough that people scan for a name.
- **Do** use `selectAll` once a group has five or more options, or when "all" is a common answer.
- **Don't** use a group for a single yes/no. That's one `Checkbox` (or a `Switch` for a setting).
- **Don't** nest fieldsets more than one level. Two levels of grouping is a sign the form wants sections with headings.
- **Don't** put more than about eight options in a group. Past that, use a `Combobox` with `multiple`.

## Props

### CheckboxGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | The group's name, rendered as a fieldset legend. |
| `description` | `ReactNode` | — | A line under the label, linked to the group. |
| `items` | `readonly CheckboxGroupItem[]` | — | The options. Or pass `Checkbox` children. |
| `value` | `string[]` | — | Controlled: the ticked values. |
| `defaultValue` | `string[]` | `[]` | Initial ticked values when uncontrolled. |
| `onValueChange` | `(value: string[], details) => void` | — | Called with the new array. |
| `selectAll` | `boolean \| ReactNode` | — | Add a parent checkbox. `true` labels it "Select all". |
| `allValues` | `string[]` | Enabled `items`' values | Values the parent checkbox ticks. Required for `selectAll` with children. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Column or wrapping row. |
| `name` | `string` | — | Form field name; submitted as an array. |
| `error` | `ReactNode` | — | Error shown under the group; marks it invalid. |
| `disabled` | `boolean` | `false` | Disable every option. |
| `className` | `string` | — | Layout classes only. |

### CheckboxGroupItem

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Submitted when ticked. |
| `label` | `ReactNode` | Text next to the box. |
| `description` | `ReactNode` | A quieter line under the label, linked as its description. |
| `disabled` | `boolean` | Disable this option. "Select all" skips it. |

### Fieldset

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `legend` | `ReactNode` | — | The group's name. |
| `description` | `ReactNode` | — | A line under the legend, linked with `aria-describedby`. |
| `disabled` | `boolean` | `false` | Disable every control inside (native fieldset behaviour). |
| `children` | `ReactNode` | — | The controls, stacked 12px apart. |
| `className` | `string` | — | Layout classes only. |

Also accepts `<fieldset>` attributes, including `ref`.

## Motion

Each checkbox animates as `Checkbox` does: the check scales in over 150ms. The "select all" box switches between empty, dash and check with the same motion. Nothing else moves.

## Accessibility

Both components render a native `<fieldset>` whose legend names the group, so focus entering any option announces "Notify me about, group". Each option is a labelled checkbox; item descriptions are linked as its description. The "select all" checkbox reports mixed when some options are ticked. An `error` is linked to the group and announced with it.
