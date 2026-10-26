---
title: OTPField
description: One-time codes: one mono box per character, auto-advance, Backspace to go back, paste to fill all. Optional visual groups.
group: Controls
order: 150
---

# OTPField

A one-time code, one mono box per character. Typing moves to the next box, Backspace goes back, and pasting a whole code (or the phone's autofill) fills every box at once.

```tsx
import { OTPField } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<Field label="Verification code" description="Enter the 6-digit code we sent you.">
  <OTPField />
</Field>
```

### Grouped

`groups` draws a dash between groups. It's visual only; the value has no dash.

```tsx live
<Field label="Code">
  <OTPField length={6} groups={[3, 3]} />
</Field>
```

### Alphanumeric

Recovery and invite codes mix letters and numbers.

```tsx live
<Field label="Recovery code">
  <OTPField length={8} groups={[4, 4]} validationType="alphanumeric" />
</Field>
```

### On complete

`onValueComplete` fires once every box is filled — verify there. `autoSubmit` submits the surrounding form instead.

```tsx live
import { Field, OTPField, Status } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [state, setState] = useState<"idle" | "ok" | "bad">("idle");
  return (
    <div className="flex flex-col items-start gap-3">
      <Field label="Code" description="Try 424242.">
        <OTPField
          groups={[3, 3]}
          onValueChange={() => setState("idle")}
          onValueComplete={(v) => setState(v === "424242" ? "ok" : "bad")}
        />
      </Field>
      {state === "ok" ? <Status tone="ok">Verified</Status> : state === "bad" ? <Status tone="err">That code didn't match</Status> : null}
    </div>
  );
}
```

## Rules

- **Do** keep the default `autoComplete="one-time-code"` so phones offer the SMS code.
- **Do** say where the code was sent in the `Field` description.
- **Don't** use it for passwords or PINs people chose themselves; that's an `Input` with `type="password"`.
- **Don't** clear the boxes on a wrong code. Show the error and let people fix one character.

## Props

Extends Base UI's [OTPField Root](https://base-ui.com/react/components/otp-field) props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | `number` | `6` | Number of characters. |
| `groups` | `number[]` | — | Visual grouping, e.g. `[3, 3]`. Must sum to `length`. |
| `value` / `defaultValue` | `string` | — | The code. |
| `onValueChange` | `(value: string) => void` | — | Every change. |
| `onValueComplete` | `(value: string) => void` | — | When every box is filled. |
| `validationType` | `"numeric" \| "alpha" \| "alphanumeric" \| "none"` | `"numeric"` | What characters are accepted. |
| `autoSubmit` | `boolean` | `false` | Submit the owning form when complete. |
| `mask` | `boolean` | `false` | Hide the characters (dots). |
| `name` / `required` / `disabled` | — | — | As on any input. |
| `className` | `string` | — | Layout only. |

## Accessibility

- The first box takes the `Field` label; the rest are labelled "Character 2 of 6", and so on.
- Arrow keys move between boxes; Backspace on an empty box moves back and deletes.
