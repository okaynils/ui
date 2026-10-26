---
title: Segmented control
description: Pick one of 2–5 short options shown side by side, like a view mode or time range. The selection slides.
group: Controls
order: 40
---

# Segmented control

A row of 2–5 short options with exactly one selected, such as a view mode, a time range or a unit. The selected option is a raised white tile, and it **slides** to a new choice so your eye follows what changed. It doesn't animate on first render.

```tsx
import { SegmentedControl } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<SegmentedControl
  aria-label="Range"
  defaultValue="7d"
  items={[
    { value: "24h", label: "24h" },
    { value: "7d", label: "7d" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
  ]}
/>
```

### Controlled

```tsx live
import { SegmentedControl } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [view, setView] = useState<"list" | "board" | "calendar">("board");
  return (
    <div className="flex flex-col items-center gap-3">
      <SegmentedControl
        aria-label="View"
        value={view}
        onValueChange={setView}
        items={[
          { value: "list", label: "List" },
          { value: "board", label: "Board" },
          { value: "calendar", label: "Calendar" },
        ]}
      />
      <span className="font-mono text-xs text-ink-3">view = {view}</span>
    </div>
  );
}
```

### With icons

Icon-only segments need an `aria-label` on each item. Put a `Tooltip` around the control when the icons aren't obvious.

```tsx live
import { SegmentedControl } from "@nils/ui";
import { ListIcon, SquaresFourIcon, CalendarBlankIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <SegmentedControl
      aria-label="View"
      size="sm"
      items={[
        { value: "list", label: <ListIcon />, "aria-label": "List" },
        { value: "grid", label: <SquaresFourIcon />, "aria-label": "Grid" },
        { value: "calendar", label: <CalendarBlankIcon />, "aria-label": "Calendar" },
      ]}
    />
  );
}
```

### Fill

`fill` stretches to the container and splits it evenly. This is useful in narrow panels.

```tsx live
<div className="w-72">
  <SegmentedControl
    fill
    aria-label="Theme"
    defaultValue="system"
    items={[
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ]}
  />
</div>
```

## Rules

- **Do** use it when switching shows something different right away (a view, a filter, a range).
- **Do** keep labels to one or two words. Long options belong in a `RadioGroup` or `Select`.
- **Don't** use it for actions ("Save / Cancel"). Those are `Button`s.
- **Don't** use it for navigation between pages. That's a tab bar or the sidebar.
- **Don't** put more than five options in it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `{ value, label, "aria-label"?, disabled? }[]` | — | The options, in order. |
| `value` | `string` | — | Selected value (controlled). |
| `defaultValue` | `string` | first item | Initial value (uncontrolled). |
| `onValueChange` | `(value) => void` | — | Fires with the new value. It never fires with "nothing". |
| `size` | `"sm" \| "md"` | `"md"` | Height 28 / 32px. |
| `fill` | `boolean` | `false` | Full width, equal segments. |
| `disabled` | `boolean` | `false` | |
| `aria-label` | `string` | — | Name for the group. |
| `className` | `string` | — | Layout only. |

## Accessibility

Built on Base UI's [ToggleGroup](https://base-ui.com/react/components/toggle-group): each segment is a `<button>` with `aria-pressed`, arrow keys move focus within the group, and Space/Enter selects. Clicking the selected segment again does nothing, so there's always a selection.

## Motion

The tile slides (position and width) in 180ms on `ease-snap`. That makes it the slowest thing among the controls, because it travels the farthest. The first placement never animates. Text colour changes in 120ms.
