---
title: Menu
description: A dropdown list of actions opened from a button, with shortcuts, checkboxes, radio groups, labels and submenus.
group: Overlays
order: 20
---

# Menu

A list of actions that drops down from a button. It opens on click or arrow keys, follows the keyboard with an instant highlight, and closes when an action is chosen. The same item parts also fill a [ContextMenu](/components/context-menu).

```tsx
import {
  Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuGroup,
  MenuCheckboxItem, MenuRadioGroup, MenuRadioItem, MenuSub, MenuSubTrigger, MenuSubContent,
} from "@nils/ui";
```

## Examples

### Actions

Show `shortcut` on items that have a key bound. `variant="danger"` goes last, after a separator.

```tsx live
import { Button, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@nils/ui";
import { CaretDownIcon, CopyIcon, PencilSimpleIcon, ArchiveIcon, TrashIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Menu>
      <MenuTrigger render={<Button />}>
        Project <CaretDownIcon className="-mr-1 size-3.5" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem shortcut="R"><PencilSimpleIcon /> Rename</MenuItem>
        <MenuItem shortcut="⌘D"><CopyIcon /> Duplicate</MenuItem>
        <MenuItem><ArchiveIcon /> Archive</MenuItem>
        <MenuSeparator />
        <MenuItem variant="danger" shortcut="⌘⌫"><TrashIcon /> Delete</MenuItem>
      </MenuContent>
    </Menu>
  );
}
```

### Icon-only trigger

The usual "more" button on a row. It needs an `aria-label`.

```tsx live
import { Button, Menu, MenuContent, MenuItem, MenuTrigger } from "@nils/ui";
import { DotsThreeIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="ghost" icon aria-label="More actions" />}>
        <DotsThreeIcon weight="bold" />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem>Copy link</MenuItem>
        <MenuItem>Open in new tab</MenuItem>
      </MenuContent>
    </Menu>
  );
}
```

### Groups, checkboxes and radios

`MenuGroup label` and `MenuRadioGroup label` add a mono heading. Checkbox and radio items stay open when chosen, so several can be changed at once. Plain items next to them take `inset` so the labels line up.

```tsx live
import { Button, Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuTrigger } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [sort, setSort] = useState("updated");
  const [archived, setArchived] = useState(false);
  const [mine, setMine] = useState(true);
  return (
    <Menu>
      <MenuTrigger render={<Button />}>View</MenuTrigger>
      <MenuContent className="w-52">
        <MenuRadioGroup label="Sort by" value={sort} onValueChange={setSort}>
          <MenuRadioItem value="updated">Last updated</MenuRadioItem>
          <MenuRadioItem value="created">Created</MenuRadioItem>
          <MenuRadioItem value="name">Name</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuGroup label="Show">
          <MenuCheckboxItem checked={mine} onCheckedChange={setMine}>Only mine</MenuCheckboxItem>
          <MenuCheckboxItem checked={archived} onCheckedChange={setArchived}>Archived</MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}
```

### Submenu

Nest a `MenuSub`. It opens on hover, click, or →, beside its item.

```tsx live
<Menu>
  <MenuTrigger render={<Button />}>Share</MenuTrigger>
  <MenuContent>
    <MenuItem>Copy link</MenuItem>
    <MenuSub>
      <MenuSubTrigger>Export as</MenuSubTrigger>
      <MenuSubContent>
        <MenuItem>Markdown</MenuItem>
        <MenuItem>PDF</MenuItem>
        <MenuItem>CSV</MenuItem>
      </MenuSubContent>
    </MenuSub>
    <MenuSeparator />
    <MenuItem>Invite people…</MenuItem>
  </MenuContent>
</Menu>
```

## Rules

- **Do** label items with a verb or a short noun phrase, in sentence case. End with "…" when the item opens a dialog that asks for more.
- **Do** show `shortcut` only for keys that are actually bound.
- **Do** put destructive items last, behind a `MenuSeparator`, with `variant="danger"`.
- **Do** keep menus short. Past ~10 items, group them, use a submenu, or use a command palette.
- **Don't** use a menu to pick a form value. That's a `Select`.
- **Don't** nest submenus more than one level.
- **Don't** put inputs or rich content in a menu. That's a `Popover`.

## Props

`Menu` accepts Base UI [Menu.Root](https://base-ui.com/react/components/menu) props: `open`, `defaultOpen`, `onOpenChange`, `modal`, `openOnHover`. `MenuTrigger` accepts `render` and native button attributes.

### MenuContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Side of the trigger to open on. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Use `"end"` for triggers at the right edge. |
| `sideOffset` | `number` | `6` | Gap to the trigger, in px. |
| `className` | `string` | — | Width only (`w-52`). Min width is 10rem. |

### MenuItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onClick` | `(event) => void` | — | Runs when chosen (click, Enter or Space). |
| `shortcut` | `string` | — | Mono hint at the right edge, e.g. `"⌘D"`. Display only. |
| `variant` | `"default" \| "danger"` | `"default"` | `danger` turns the item red. |
| `inset` | `boolean` | `false` | Indents the label to line up with checkbox/radio items. |
| `disabled` | `boolean` | `false` | Dimmed and skipped by the keyboard. |
| `closeOnClick` | `boolean` | `true` | Keep the menu open after choosing. |

### The other parts

| Part | Key props | Notes |
| --- | --- | --- |
| `MenuCheckboxItem` | `checked`, `onCheckedChange`, `shortcut` | Stays open when toggled. |
| `MenuRadioGroup` | `value`, `onValueChange`, `label` | Wraps `MenuRadioItem`s. |
| `MenuRadioItem` | `value` | Stays open when chosen. |
| `MenuGroup` | `label` | Groups items under a mono heading. |
| `MenuLabel` | `inset` | A standalone heading. Prefer `MenuGroup label`. |
| `MenuLinkItem` | `href`, `inset` | An item that navigates (renders `<a>`). |
| `MenuSeparator` | — | A hairline. |
| `MenuSub` / `MenuSubTrigger` / `MenuSubContent` | `inset` on the trigger | One level of nesting. |

## Motion

The list opens in 150ms and closes in 100ms, scaling from 96% at the trigger. The highlight is **instant**: it follows the keyboard, and lag there reads as sluggishness.

## Accessibility

- Full keyboard support: ↑ ↓ move, Enter/Space choose, → opens a submenu, ← and Esc close, typing jumps to a matching item.
- Roles are set for you: `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, and group labels via `MenuGroup label`.
- An icon-only trigger needs `aria-label`.
