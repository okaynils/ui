---
title: Toggle
description: A button that stays pressed (bold, pin, mute), and ToggleGroup for a row of them with a single or multiple shared value.
group: Controls
order: 41
---

# Toggle

A button with two states, pressed and not: bold, pin, mute, "show archived". The change applies the moment you press it. `ToggleGroup` puts several toggles behind one value, either one choice at a time (text alignment) or any number (bold, italic, underline), with one tab stop and arrow keys between them. Built on Base UI's Toggle and ToggleGroup.

```tsx
import { Toggle, ToggleGroup } from "@nils/ui";
import type { ToggleProps, ToggleGroupProps, ToggleSize, ToggleVariant, ToggleGroupVariant } from "@nils/ui";
```

## Examples

### A single toggle

Standalone toggles are `outline`, like a Button. Pressed shows the active fill.

```tsx live
import { useState } from "react";
import { Toggle } from "@nils/ui";
import { ArchiveIcon, PushPinIcon } from "@phosphor-icons/react";

export default function Example() {
  const [archived, setArchived] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Toggle pressed={archived} onPressedChange={setArchived}>
        <ArchiveIcon /> Show archived
      </Toggle>
      <Toggle icon aria-label="Pin" defaultPressed>
        <PushPinIcon />
      </Toggle>
    </div>
  );
}
```

### One choice: text alignment

A `ToggleGroup`'s value is always an array of the pressed toggles' `value`s, even for a single choice. Pressing the pressed toggle again empties it; if one must always be chosen, use `SegmentedControl`.

```tsx live
import { useState } from "react";
import { ToggleGroup, Toggle } from "@nils/ui";
import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@phosphor-icons/react";

export default function Example() {
  const [align, setAlign] = useState(["left"]);
  return (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup aria-label="Text alignment" value={align} onValueChange={setAlign}>
        <Toggle icon value="left" aria-label="Align left"><TextAlignLeftIcon /></Toggle>
        <Toggle icon value="center" aria-label="Align centre"><TextAlignCenterIcon /></Toggle>
        <Toggle icon value="right" aria-label="Align right"><TextAlignRightIcon /></Toggle>
      </ToggleGroup>
      <span className="font-mono text-xs text-ink-2">value: {JSON.stringify(align)}</span>
    </div>
  );
}
```

### Several at once, framed

`multiple` lets any number stay pressed. `variant="outline"` frames the group as one control.

```tsx live
import { ToggleGroup, Toggle } from "@nils/ui";
import { TextBIcon, TextItalicIcon, TextStrikethroughIcon, TextUnderlineIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleGroup multiple variant="outline" aria-label="Text style" defaultValue={["bold"]}>
        <Toggle icon value="bold" aria-label="Bold"><TextBIcon /></Toggle>
        <Toggle icon value="italic" aria-label="Italic"><TextItalicIcon /></Toggle>
        <Toggle icon value="underline" aria-label="Underline"><TextUnderlineIcon /></Toggle>
        <Toggle icon value="strike" aria-label="Strikethrough"><TextStrikethroughIcon /></Toggle>
      </ToggleGroup>
      <ToggleGroup multiple variant="outline" size="sm" aria-label="Show" defaultValue={["errors", "warnings"]}>
        <Toggle value="errors">Errors</Toggle>
        <Toggle value="warnings">Warnings</Toggle>
        <Toggle value="info">Info</Toggle>
      </ToggleGroup>
    </div>
  );
}
```

## Rules

Pick the control by what the choice is:

| You need | Use |
| --- | --- |
| An action-like on/off that applies at once, often an icon: bold, pin, mute | `Toggle` |
| A few related on/off options, or one-of-several where "none" is fine | `ToggleGroup` |
| One of 2–5 views or modes, always exactly one selected | `SegmentedControl` |
| A setting that is on or off, with a label sentence: "Email me weekly" | `Switch` |
| A yes/no answer in a form that's submitted later | `Checkbox` |

- **Do** give every icon-only toggle an `aria-label`, and usually a `Tooltip`. The label names the thing, not the state: "Bold", not "Make bold".
- **Do** give every `ToggleGroup` an `aria-label` that names the set ("Text alignment").
- **Do** keep the label the same in both states. The pressed fill says whether it's on; "Show archived" doesn't become "Hide archived".
- **Don't** colour pressed toggles with the accent. Pressed is a tone; the accent belongs to the one primary action.
- **Don't** use a toggle to submit or navigate. If pressing it does something once, it's a `Button`.
- **Don't** put `ToggleGroup` inside a `Toolbar`; use `ToolbarToggle` there, so the toolbar keeps one arrow-key order.

## Props

### Toggle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | — | Controlled pressed state. |
| `defaultPressed` | `boolean` | `false` | Initial pressed state when uncontrolled. |
| `onPressedChange` | `(pressed: boolean) => void` | — | Called when the state changes. |
| `value` | `string` | — | Identifies the toggle inside a `ToggleGroup`. |
| `size` | `"sm" \| "md"` | `"md"` | Height 28 / 32px. Ignored inside a group, which sets it. |
| `variant` | `"outline" \| "ghost"` | `"outline"` | `outline` stands alone; `ghost` sits in a row of controls. Ignored inside a group. |
| `icon` | `boolean` | `false` | Square, icon-only. Needs `aria-label`. |
| `disabled` | `boolean` | `false` | Ignore interaction. |
| `className` | `string` | — | Layout classes only. |

Also accepts Base UI Toggle props (`render`, `nativeButton`) and button attributes, including `ref`.

### ToggleGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Controlled: the `value`s of the pressed toggles. |
| `defaultValue` | `string[]` | — | Initial pressed toggles when uncontrolled. |
| `onValueChange` | `(value: string[], details) => void` | — | Called with the new array. |
| `multiple` | `boolean` | `false` | Allow several toggles to be pressed at once. |
| `variant` | `"plain" \| "outline"` | `"plain"` | Loose row of ghost toggles, or framed as one control. |
| `size` | `"sm" \| "md"` | `"md"` | Height of every toggle in the group. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout and arrow-key direction. |
| `loopFocus` | `boolean` | `true` | Arrow keys wrap from the last toggle to the first. |
| `disabled` | `boolean` | `false` | Disable every toggle. |
| `aria-label` | `string` | — | Names the group. |
| `className` | `string` | — | Layout classes only. |

## Motion

Toggles press like buttons: `scale(0.97)` while held (`ui-press`) and a 120ms change of fill. Nothing slides between toggles; if you want the selection to travel, that's a `SegmentedControl`.

## Accessibility

A toggle is a native `<button>` with `aria-pressed`, so screen readers announce "Bold, toggle button, pressed". A `ToggleGroup` is one tab stop: Tab enters at the pressed (or first) toggle, arrow keys move between toggles, Space or Enter presses. The pressed state is shown by fill, not colour alone; in a framed group it stays visible against the frame in both themes.
