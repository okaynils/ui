---
title: Button
description: Every pressable action. Five variants, three sizes, icon-only, loading, and a built-in shortcut hint.
group: Controls
order: 10
---

# Button

The pressable. Every action that isn't a link is a `Button`. It gives a little under the finger (`scale(0.97)` while pressed) and answers hover in 120ms.

```tsx
import { Button } from "@nils/ui";
```

## Examples

### Variants

`outline` is the default. `primary` is blue and reserved for **the one** action a view wants you to take.

```tsx live
<Button variant="primary">Deploy</Button>
<Button variant="solid">Commit</Button>
<Button>Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Delete</Button>
```

### Sizes

`md` (32px) is the default. Controls on one row share one size.

```tsx live
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### With icons

Any `<svg>` child is sized to 16px. Put the icon before the label for nouns ("+ New"), after it for direction ("Next →").

```tsx live
import { Button } from "@nils/ui";
import { PlusIcon, ArrowRightIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <>
      <Button><PlusIcon /> New project</Button>
      <Button variant="primary">Continue <ArrowRightIcon /></Button>
    </>
  );
}
```

### Icon only

Pass `icon` for a square button. It **must** have an `aria-label`. Pair it with a `Tooltip` when the icon isn't obvious.

```tsx live
import { Button } from "@nils/ui";
import { DotsThreeIcon, GearSixIcon, TrashIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <>
      <Button icon variant="ghost" aria-label="Settings"><GearSixIcon /></Button>
      <Button icon aria-label="More"><DotsThreeIcon /></Button>
      <Button icon variant="danger" aria-label="Delete"><TrashIcon /></Button>
    </>
  );
}
```

### Shortcut hint

`shortcut` renders a `Kbd` at the end of the label. It is display only: bind the key yourself.

```tsx live
<Button shortcut="⌘K">Search</Button>
<Button variant="primary" shortcut="⌘↵">Send</Button>
```

### Loading

`loading` swaps the label for a spinner without changing the button's width, and blocks presses.

```tsx live
import { Button } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [saving, setSaving] = useState(false);
  return (
    <Button
      variant="primary"
      loading={saving}
      onClick={() => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500);
      }}
    >
      Save changes
    </Button>
  );
}
```

### As a link

To keep an `<a>` (or a router link) but look and press like a button, use `render`, or `buttonClassName()` when you can't.

```tsx live
import { Button, buttonClassName } from "@nils/ui";

export default function Example() {
  return (
    <>
      <Button render={<a href="#docs" />} nativeButton={false}>Read the docs</Button>
      <a href="#pricing" className={buttonClassName({ variant: "ghost" })}>Pricing</a>
    </>
  );
}
```

## Rules

- **Do** keep it to one `primary` per view. If two actions compete, one of them is `outline`.
- **Do** label with a verb that says what happens: "Delete project", not "OK".
- **Do** use `danger` only for actions that destroy something, and confirm irreversible ones in a `Dialog`.
- **Don't** pass colour, radius, height or font classes through `className`. It is for layout only (`w-full`, `ml-auto`).
- **Don't** put a `Button` inside a row to make the whole row clickable. Make the row the pressable.
- **Don't** disable a button to explain a missing field. Validate on submit and say what's wrong.

## Props

Extends Base UI's [Button](https://base-ui.com/react/components/button) props and every native `<button>` attribute.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"primary" \| "solid" \| "outline" \| "ghost" \| "danger"` | `"outline"` | Visual weight. See above. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Height 28 / 32 / 36px. |
| `icon` | `boolean` | `false` | Square, icon-only. Requires `aria-label`. |
| `loading` | `boolean` | `false` | Spinner, keeps width, blocks interaction, stays focusable. |
| `shortcut` | `string` | — | Keyboard hint shown at the end, e.g. `"⌘S"`. Display only. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replace the element (e.g. an `<a>`). Set `nativeButton={false}` when it isn't a `<button>`. |
| `className` | `string \| (state) => string` | — | Layout only. |

`buttonClassName({ variant, size, icon })` returns the same classes as a string.

## Accessibility

- Renders a native `<button>`; keyboard and screen readers work as expected.
- Focus ring: 2px accent outline, offset 2px, keyboard only (`:focus-visible`).
- `loading` sets `aria-busy` and keeps the button focusable so focus isn't lost mid-action.
- Disabled buttons drop to 45% opacity and ignore pointer events.
