---
title: ButtonGroup
description: Buttons joined into one control — a split button, or a few related actions sharing one outline.
group: Controls
order: 11
---

# ButtonGroup

Joins `Button`s edge to edge so they read as one control. The common case is a **split button**: the main action on the left, a caret on the right that opens the less common variants. The inner corners square off and neighbouring hairlines merge into one.

```tsx
import { ButtonGroup } from "@nils/ui";
```

## Examples

### Split button

```tsx live
import { Button, ButtonGroup, Menu, MenuContent, MenuItem, MenuTrigger } from "@nils/ui";
import { CaretDownIcon, DownloadSimpleIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <ButtonGroup aria-label="Export">
      <Button><DownloadSimpleIcon /> Export summary</Button>
      <Menu>
        <MenuTrigger render={<Button icon aria-label="More export formats" />}>
          <CaretDownIcon className="size-3.5" />
        </MenuTrigger>
        <MenuContent align="end">
          <MenuItem>Export as CSV</MenuItem>
          <MenuItem>Export as JSON</MenuItem>
        </MenuContent>
      </Menu>
    </ButtonGroup>
  );
}
```

### Related actions, small

```tsx live
import { Button, ButtonGroup } from "@nils/ui";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <ButtonGroup aria-label="Period">
      <Button size="sm" icon aria-label="Previous month"><CaretLeftIcon /></Button>
      <Button size="sm">November 2026</Button>
      <Button size="sm" icon aria-label="Next month"><CaretRightIcon /></Button>
    </ButtonGroup>
  );
}
```

## Rules

- **Do** keep every button in a group the same `variant` and `size`.
- **Do** give icon-only buttons an `aria-label`, and the group an `aria-label` that names what it does.
- **Don't** use a ButtonGroup to pick one of several values. That's a [SegmentedControl](/components/segmented-control).
- **Don't** put a `primary` button in a group with outline buttons. A split primary is fine: both halves `primary`.
- **Don't** group more than three or four buttons. Past that it's a [Toolbar](/components/toolbar).

## Props

Extends every `<div>` attribute.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | What the group does, for screen readers. |
| `children` | `Button`s | — | Buttons, or `MenuTrigger`s rendering a `Button`. |

## Accessibility

- Renders `role="group"`, so screen readers announce the group's label before its buttons.
- Each button stays its own tab stop; the group adds no keyboard handling.
- The focused or hovered button is lifted above its neighbours so its whole focus ring shows.
