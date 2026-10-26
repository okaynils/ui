---
title: ContextMenu
description: A right-click (or long-press) menu for an area, filled with the same item parts as Menu.
group: Overlays
order: 30
---

# ContextMenu

A menu that opens at the pointer on right-click, or on long-press on touch. Use it for shortcuts on things people work with directly: rows, cards, canvas objects. Fill it with the same item parts as [Menu](/components/menu).

```tsx
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, MenuItem, MenuSeparator } from "@nils/ui";
```

## Examples

### On an area

`ContextMenuTrigger` renders a `<div>`. Right-click inside it.

```tsx live
<ContextMenu>
  <ContextMenuTrigger className="grid h-32 w-72 place-items-center rounded-box border border-dashed border-line-strong text-ui text-ink-3 select-none">
    Right-click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <MenuItem shortcut="⌘C">Copy</MenuItem>
    <MenuItem shortcut="⌘V">Paste</MenuItem>
    <MenuItem shortcut="⌘D">Duplicate</MenuItem>
    <MenuSeparator />
    <MenuItem variant="danger" shortcut="⌫">Delete</MenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### On a row

Use `render` to make an existing element the trigger, so no wrapper `<div>` gets in the way.

```tsx live
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, MenuItem, MenuSeparator, MenuSub, MenuSubContent, MenuSubTrigger } from "@nils/ui";

const files = ["styles.css", "button.tsx", "README.md"];

export default function Example() {
  return (
    <ul className="w-72 overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line)]">
      {files.map((name) => (
        <ContextMenu key={name}>
          <ContextMenuTrigger
            render={<li />}
            className="flex h-9 items-center border-b border-line px-3 font-mono text-xs text-ink last:border-b-0 data-popup-open:bg-hover"
          >
            {name}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <MenuItem>Open</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuSub>
              <MenuSubTrigger>Copy path</MenuSubTrigger>
              <MenuSubContent>
                <MenuItem>Absolute</MenuItem>
                <MenuItem>Relative</MenuItem>
              </MenuSubContent>
            </MenuSub>
            <MenuSeparator />
            <MenuItem variant="danger">Delete</MenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </ul>
  );
}
```

## Rules

- **Do** treat it as a shortcut. Every action in a context menu must also be reachable some other way (a visible button, a dropdown `Menu`, or a keyboard shortcut). Context menus can't be discovered.
- **Do** mark the target while its menu is open: `data-popup-open:bg-hover` on the trigger.
- **Do** follow the [Menu](/components/menu) rules for labels, shortcuts and danger items.
- **Don't** wrap the whole page in one context menu; it replaces the browser's own menu.

## Props

`ContextMenu` accepts Base UI [ContextMenu.Root](https://base-ui.com/react/components/context-menu) props: `open`, `defaultOpen`, `onOpenChange`, `disabled`.

| Part | Key props | Notes |
| --- | --- | --- |
| `ContextMenuTrigger` | `render`, `className` | Renders a `<div>`; has `data-popup-open` while its menu is open. |
| `ContextMenuContent` | `className` | Width only. Opens at the pointer. |
| Items | — | `MenuItem`, `MenuCheckboxItem`, `MenuRadioGroup`, `MenuRadioItem`, `MenuGroup`, `MenuLabel`, `MenuSeparator`, `MenuSub*` — see [Menu](/components/menu). |

## Motion

Same as Menu: 150ms in, 100ms out, scaling from 96% at the pointer. Instant highlight.

## Accessibility

- Opens with right-click, long-press, or the keyboard's context-menu key / ⇧F10 on a focused trigger.
- Keyboard navigation inside is the same as Menu.
