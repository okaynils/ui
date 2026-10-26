---
title: Field
description: Label, control, help text and error, wired together. Wrap every form control in one, and use Form for validation.
group: Controls
order: 15
---

# Field

Wraps a control with its label, help text and error message, and links them for screen readers. Use the props API (`label`, `description`, `error`) unless you need a custom layout.

```tsx
import { Field, Form } from "@nils/ui";
```

## Examples

### Label and description

```tsx live
<div className="w-72">
  <Field label="Display name" description="Shown on your public profile.">
    <Input defaultValue="Nils" />
  </Field>
</div>
```

### Errors from your own validation

Pass `error` when your code (or a server) decides the value is wrong. It replaces the description while it shows.

```tsx live
import { Button, Field, Input } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  return (
    <form
      className="flex w-72 flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(/^[a-z0-9-]{3,}$/.test(value) ? undefined : "Use 3+ lowercase letters, digits or dashes.");
      }}
    >
      <Field label="Handle" description="Lowercase, no spaces." error={error}>
        <Input value={value} onValueChange={setValue} placeholder="nils" />
      </Field>
      <Button type="submit" className="self-start">Check</Button>
    </form>
  );
}
```

### Native validation

For `required`, `type="email"`, `minLength` and similar, put the fields in a `Form`. `Field` then shows the browser's validation message under the control. To word the messages yourself, add `FieldError` children with a `match`, and each one shows only when its check fails. Validation runs on submit, then again on every change. The browser's own bubble never appears.

```tsx live
import { Button, Field, FieldError, Form, Input } from "@nils/ui";

export default function Example() {
  return (
    <Form className="w-72" onSubmit={(e) => e.preventDefault()}>
      <Field label="Email" name="email">
        <Input type="email" required placeholder="you@example.com" />
        <FieldError match="valueMissing">Enter an email address.</FieldError>
        <FieldError match="typeMismatch">That doesn't look like an email.</FieldError>
      </Field>
      <Button type="submit" className="self-start">Continue</Button>
    </Form>
  );
}
```

### Server errors

Errors that come back from a server go to `Form`'s `errors`, keyed by each field's `name`. `Field` shows them automatically.

```tsx live
import { Button, Field, Form, Input } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [errors, setErrors] = useState({});
  return (
    <Form
      className="w-72"
      errors={errors}
      onSubmit={(e) => {
        e.preventDefault();
        setErrors({ domain: "nils.dev is already connected to another project." });
      }}
    >
      <Field label="Domain" name="domain">
        <Input defaultValue="nils.dev" />
      </Field>
      <Button type="submit" variant="primary" className="self-start">Connect</Button>
    </Form>
  );
}
```

### With other controls

`Field` works with `Select`, `Textarea`, `Checkbox` and `Switch` as well.

```tsx live
<div className="flex w-72 flex-col gap-4">
  <Field label="Region">
    <Select
      placeholder="Choose a region"
      items={[
        { value: "eu-north-1", label: "Stockholm" },
        { value: "us-west-2", label: "Oregon" },
      ]}
    />
  </Field>
  <Field description="We'll email you when a deploy fails.">
    <Switch label="Deploy alerts" defaultChecked />
  </Field>
</div>
```

### Custom layout

The parts (`FieldRoot`, `FieldLabel`, `FieldDescription`, `FieldError`) let you put the label beside the control, for example in a settings row.

```tsx live
import { FieldDescription, FieldLabel, FieldRoot, Input } from "@nils/ui";

export default function Example() {
  return (
    <FieldRoot className="grid w-[26rem] grid-cols-[1fr_12rem] items-center gap-x-6 gap-y-0.5">
      <FieldLabel>Timeout</FieldLabel>
      <Input defaultValue="30" trailing="sec" className="row-span-2" />
      <FieldDescription>Before a request is cancelled.</FieldDescription>
    </FieldRoot>
  );
}
```

## Rules

- **Do** wrap every form control in a `Field`, even when the label is all you need.
- **Do** write errors that say what to do: "Use 3+ lowercase letters", not "Invalid input".
- **Do** stack fields with `gap-4` between them, and `gap-6` between groups.
- **Don't** put more than one control in a `Field`. Group related fields with a heading instead.
- **Do** wrap fields in `Form` whenever you use native validation (`required`, `type`, `pattern`) or server errors.
- **Don't** show an error before the user has had a chance to type. Validate on submit or on blur.

## Props

### Field

Extends Base UI's [Field.Root](https://base-ui.com/react/components/field) props (`name`, `disabled`, `invalid`, `validate`, `validationMode`, …).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Visible label, `text-ui font-medium`. |
| `description` | `ReactNode` | — | Help text under the control, `text-xs text-ink-2`. Hidden while an error shows. |
| `error` | `ReactNode` | — | Error message to show now. Marks the field invalid. |
| `children` | `ReactNode` | — | One control. |
| `className` | `string` | — | Layout only. |

### Form

Extends Base UI's [Form](https://base-ui.com/react/components/form) and every native `<form>` attribute.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `errors` | `Record<string, string \| string[]>` | — | Server errors keyed by field `name`. Shown under the matching `Field`. |
| `onSubmit` | `(event) => void` | — | Runs only once every field is valid. |
| `onFormSubmit` | `(values, details) => void` | — | Like `onSubmit`, with the values as an object. |
| `validationMode` | `"onSubmit" \| "onBlur" \| "onChange"` | `"onSubmit"` | When fields validate. |
| `className` | `string` | — | Layout. Defaults to `flex flex-col gap-4`. |

### Parts

| Part | Renders | Notes |
| --- | --- | --- |
| `FieldRoot` | `<div>` | Base UI `Field.Root`, column with `gap-1.5`. |
| `FieldLabel` | `<label>` | Linked to the control automatically. |
| `FieldDescription` | `<p>` | Linked with `aria-describedby`. |
| `FieldError` | `<div>` | `match` picks the validity check (`"valueMissing"`, `"typeMismatch"`, …). `match` alone always shows. With no `match`, it shows whatever error the field has (native message or a `Form` server error). |

## Accessibility

The label is linked to the control. The description and error are linked through `aria-describedby`, and an invalid field sets `aria-invalid` on its control. Errors are announced when they appear.

## Motion

Errors fade in over 150ms and out over 100ms. They don't slide: the layout change already tells the eye where to look.
