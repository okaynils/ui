---
title: Toolbar
description: A row of related controls with one tab stop and arrow-key navigation — formatting buttons, view toggles, filters.
group: Shell
order: 60
---

# Toolbar

A row of related controls that counts as **one** tab stop: Tab enters it, the arrow keys move between its controls, and Tab again leaves it. Use it for formatting buttons, view toggles, and the filters above a table. Built on Base UI's Toolbar.

```tsx
import { Toolbar, ToolbarButton, ToolbarToggle, ToolbarGroup, ToolbarSeparator } from "@nils/ui";
```

## Examples

### Groups, toggles and a separator

Tab into it and use ← →.

```tsx live
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarToggle, Tooltip } from "@nils/ui";
import { ArrowClockwiseIcon, ArrowCounterClockwiseIcon, CodeIcon, LinkIcon, TextBIcon, TextItalicIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Toolbar variant="panel" aria-label="Formatting">
      <ToolbarGroup aria-label="History">
        <Tooltip content="Undo" shortcut="⌘Z">
          <ToolbarButton icon aria-label="Undo"><ArrowCounterClockwiseIcon /></ToolbarButton>
        </Tooltip>
        <Tooltip content="Redo" shortcut="⇧⌘Z">
          <ToolbarButton icon aria-label="Redo"><ArrowClockwiseIcon /></ToolbarButton>
        </Tooltip>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Text style">
        <ToolbarToggle icon aria-label="Bold" defaultPressed><TextBIcon /></ToolbarToggle>
        <ToolbarToggle icon aria-label="Italic"><TextItalicIcon /></ToolbarToggle>
        <ToolbarToggle icon aria-label="Code"><CodeIcon /></ToolbarToggle>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton><LinkIcon /> Link</ToolbarButton>
    </Toolbar>
  );
}
```

### Filters above a table

`plain` sits flush in the page. A toolbar button can open a menu: pass the trigger through `render`, and it keeps the button look.

```tsx live
import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem, MenuTrigger, Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggle } from "@nils/ui";
import { CaretDownIcon, FunnelIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function Example() {
  const [region, setRegion] = useState("all");
  return (
    <Toolbar aria-label="Filters" className="w-full border-b border-line pb-2">
      <Menu>
        <ToolbarButton render={<MenuTrigger />}>
          <FunnelIcon /> Region: {region} <CaretDownIcon className="size-3.5" />
        </ToolbarButton>
        <MenuContent>
          <MenuRadioGroup value={region} onValueChange={setRegion}>
            <MenuRadioItem value="all">all</MenuRadioItem>
            <MenuRadioItem value="us-west">us-west</MenuRadioItem>
            <MenuRadioItem value="eu-north">eu-north</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <ToolbarSeparator />
      <ToolbarToggle defaultPressed>Running</ToolbarToggle>
      <ToolbarToggle>Idle</ToolbarToggle>
      <span className="ml-auto font-mono text-xs text-ink-3 tabular-nums">12 nodes</span>
    </Toolbar>
  );
}
```

## Rules

- **Do** give the toolbar, and each group, an `aria-label` that names what it controls.
- **Do** keep everything in a toolbar `sm`, which is the default.
- **Do** put a `Tooltip` on every icon-only button, with its shortcut when there is one.
- **Don't** put a primary button in a toolbar. Committing actions belong in the PageHeader or a footer.
- **Don't** use a toolbar for navigation between pages. That's the Sidebar or Tabs.

## Props

### Toolbar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"plain" \| "panel"` | `"plain"` | `panel` adds a panel tone and hairline, for a floating or in-canvas toolbar. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Arrow-key axis and layout. |
| `loopFocus` | `boolean` | `true` | Arrow keys wrap around at the ends. |

### ToolbarButton

[Button](/components/button) props, defaulting to `variant="ghost"` and `size="sm"`, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `ReactElement` | — | A popup trigger to merge with (`<MenuTrigger />`, `<PopoverTrigger />`). Keeps the Button look. |

### ToolbarToggle

Button props (ghost / sm), plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | — | Controlled state. |
| `defaultPressed` | `boolean` | `false` | Uncontrolled initial state. |
| `onPressedChange` | `(pressed: boolean) => void` | — | Called on toggle. |

A pressed toggle shows the active fill (`bg-active`) and `ink` text.

### ToolbarGroup and ToolbarSeparator

A group lays its items out together and should have an `aria-label`. A separator is a short hairline between groups.

## Accessibility

- `role="toolbar"` with roving focus: one tab stop, with ← → (or ↑ ↓ when vertical), Home and End.
- Toggles expose `aria-pressed`.
- Disabled items stay focusable, so keyboard users can still discover them.
