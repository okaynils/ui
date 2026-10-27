---
title: PasswordInput
description: A password field with a show/hide toggle that keeps your cursor, a Caps Lock warning, and the right autocomplete hint.
group: Controls
order: 23
---

# PasswordInput

A password field with the details that are easy to get wrong. A show/hide toggle reveals what you typed without moving focus or the cursor. A Caps Lock warning appears while you type with Caps Lock on. `purpose` sets the autocomplete hint, so password managers fill a saved password on sign-in and offer to generate one on sign-up.

```tsx
import { PasswordInput } from "@nils/ui";
import type { PasswordInputProps, PasswordInputPurpose } from "@nils/ui";
```

## Examples

### Signing in

Type something, then click the eye: the cursor stays where it was. Turn Caps Lock on while typing to see the warning.

```tsx live
<div className="flex w-72 flex-col gap-4">
  <Field label="Email">
    <Input type="email" autoComplete="email" placeholder="you@example.com" />
  </Field>
  <Field label="Password">
    <PasswordInput required />
  </Field>
</div>
```

### Choosing a new password

`purpose="new"` sets `autocomplete="new-password"`. State the requirements up front in the description, not after a failed submit.

```tsx live
<div className="w-72">
  <Field label="New password" description="At least 12 characters.">
    <PasswordInput purpose="new" minLength={12} required />
  </Field>
</div>
```

### Controlled visibility

Control `visible` when one toggle should reveal two fields, such as a password and its confirmation.

```tsx live
import { useState } from "react";
import { Field, PasswordInput, Switch } from "@nils/ui";

export default function Example() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex w-72 flex-col gap-4">
      <Field label="New password">
        <PasswordInput purpose="new" visible={visible} onVisibleChange={setVisible} />
      </Field>
      <Field label="Confirm password">
        <PasswordInput purpose="new" visible={visible} onVisibleChange={setVisible} />
      </Field>
      <label className="flex items-center gap-2 text-ui text-ink">
        <Switch checked={visible} onCheckedChange={setVisible} />
        Show passwords
      </label>
    </div>
  );
}
```

## Rules

- **Do** use `purpose="new"` on sign-up and password-change forms, and the default `"current"` on sign-in.
- **Do** put a visible label on it with `Field`. Password fields are never obvious enough for `aria-label` alone.
- **Do** state requirements in the `description` before someone types.
- **Don't** disable paste or the reveal toggle. Both make strong passwords harder, not safer.
- **Don't** pass `autoComplete="off"`. Browsers ignore it for passwords, and it fights password managers.
- **Don't** invent a strength meter from character classes. If you need one, use a real estimator on your side and say what it measured.

## Props

Extends [`Input`](/components/input) props, except `type` and `trailing`, which the password field owns.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `purpose` | `"current" \| "new"` | `"current"` | Sets `autoComplete` to `current-password` or `new-password`. An explicit `autoComplete` wins. |
| `visible` | `boolean` | — | Controlled visibility. |
| `defaultVisible` | `boolean` | `false` | Initial visibility when uncontrolled. |
| `onVisibleChange` | `(visible: boolean) => void` | — | Fires when the toggle is pressed, and with `false` when the form submits. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Height 28 / 32 / 36px. |
| `ref` | `Ref<HTMLInputElement>` | — | The `<input>`. |

## Accessibility

- The toggle is a button named "Show password" with `aria-pressed`, so screen readers say "Show password, toggle button, pressed" once it's revealed. Clicking it doesn't take focus from the field; keyboard users reach it with Tab and press Space.
- The Caps Lock warning is a warn dot plus the words "Caps Lock" inside the field, and "Caps Lock is on" is announced politely. It's read from keyboard and pointer events while the field is focused, and clears when you leave.
- A revealed password turns autocorrect, capitalisation and spellcheck off, so the visible text is exactly what you typed.
- When the surrounding form submits, a revealed password is hidden again, so it's never left on screen or saved by the browser as plain text.

## Motion

None beyond `Input`'s 120ms focus ring and the toggle's 120ms hover. The icon swaps instantly; it's a state, not an event.
