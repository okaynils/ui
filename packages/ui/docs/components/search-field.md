---
title: SearchField
description: A search input with a magnifier, a clear button, Escape to clear, and an optional page-wide shortcut that focuses it.
group: Controls
order: 22
---

# SearchField

A text field for searching and filtering. It has a magnifier in front, and a clear button appears once there's a query. Escape clears the query; a second Escape leaves the field. Give it a `shortcut` and the field shows the key as a hint and actually binds it, so `/` or `⌘K` jumps to search from anywhere on the page.

```tsx
import { SearchField } from "@nils/ui";
import type { SearchFieldProps } from "@nils/ui";
```

## Examples

### Filtering a list

The query is plain state; filter as you type.

```tsx live
import { useState } from "react";
import { Field, SearchField } from "@nils/ui";

const REGIONS = ["eu-north-1", "eu-west-1", "us-east-1", "us-west-2", "ap-south-1"];

export default function Example() {
  const [query, setQuery] = useState("");
  const matches = REGIONS.filter((region) => region.includes(query.trim().toLowerCase()));
  return (
    <div className="flex w-72 flex-col gap-3">
      <Field label="Region">
        <SearchField value={query} onValueChange={setQuery} placeholder="Filter regions" />
      </Field>
      <ul className="font-mono text-xs text-ink-2">
        {matches.length ? matches.map((region) => <li key={region}>{region}</li>) : <li className="text-ink-3">No regions match.</li>}
      </ul>
    </div>
  );
}
```

### With a shortcut

Press `/` anywhere on this page (outside other fields) to jump into the field. The hint hides while the field is focused or has a query. `⌘` in a shortcut also matches Ctrl, so `⌘K` works on every platform.

```tsx live
<div className="flex w-72 flex-col gap-3">
  <SearchField aria-label="Search docs" shortcut="/" placeholder="Search docs" />
  <SearchField aria-label="Search projects" shortcut="⇧⌘F" placeholder="Search projects" size="sm" />
</div>
```

### Sizes

Heights match `Input` and `Button`: `sm` 28px, `md` 32px, `lg` 36px.

```tsx live
<div className="flex w-72 flex-col gap-2">
  <SearchField aria-label="Small" size="sm" defaultValue="sm" />
  <SearchField aria-label="Medium" defaultValue="md" />
  <SearchField aria-label="Large" size="lg" defaultValue="lg" />
</div>
```

## Rules

- **Do** label it. A `Field` label, or `aria-label` when the context makes the purpose obvious (a search bar in a top bar).
- **Do** wrap a site-wide search in `<form role="search">` so it's a landmark. Filters for one list don't need it.
- **Do** pick a `shortcut` people already know: `/` for search on a page, `⌘K` only if there's no command palette using it.
- **Don't** bind the same shortcut to two fields. The first one rendered wins nothing; both try to take focus.
- **Don't** use a bare-key shortcut ("/", "s") on pages where people type a lot. It's ignored while another field is focused, but it can still surprise.
- **Don't** put a submit button next to a filter that updates as you type. Use one or the other.

## Props

Extends [`Input`](/components/input) props, except `type`, `leading` and `trailing`, which the search field owns.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled query. |
| `defaultValue` | `string` | `""` | Initial query when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Fires on every change, including `""` when cleared by the button or Escape. |
| `shortcut` | `string` | — | Key that focuses the field from anywhere: `"/"`, `"⌘K"`, `"⇧⌘F"`. Symbols: `⌘` (Meta or Ctrl), `⌃`, `⌥`, `⇧`. Shown as a `Kbd` hint while empty and unfocused. |
| `clearLabel` | `string` | `"Clear search"` | Accessible name of the clear button. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Height 28 / 32 / 36px. |
| `placeholder` | `string` | `"Search"` | Placeholder text. Not a label. |
| `ref` | `Ref<HTMLInputElement>` | — | The `<input>`. |

## Accessibility

- Renders `<input type="search">`, which screen readers announce as a search box. The browser's own clear button is hidden so there's only one.
- The clear button is named "Clear search" and doesn't steal focus from the field when clicked. Keyboard users reach it with Tab.
- Escape clears without closing a surrounding dialog or popover; with the field already empty, Escape leaves the field and behaves normally.
- A `shortcut` is exposed through `aria-keyshortcuts`. Bare-key shortcuts are ignored while focus is in another text field, so typing "/" elsewhere still types.

## Motion

The ring follows `Input`: hairline to accent in 120ms. The clear button's hover is 120ms. Nothing else moves.
