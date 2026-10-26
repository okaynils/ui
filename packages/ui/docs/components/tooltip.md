---
title: Tooltip
description: A small dark label naming an icon-only control, with an optional shortcut. Shows on hover after a beat, or on focus.
group: Overlays
order: 60
---

# Tooltip

A small label for a control whose meaning isn't written on it, usually an icon-only button. It opens on hover after a short wait, or immediately on keyboard focus, and can show the control's shortcut.

It's **dark** (ink on surface, inverted) on purpose. Popovers and menus are white panels you work in. A tooltip is a passing label, and inverting it means it never reads as content.

```tsx
import { Tooltip, TooltipProvider } from "@nils/ui";
```

## Examples

### Basic

Wrap the trigger. The child must be one element that accepts a ref, such as a `Button`.

```tsx live
import { Button, Tooltip } from "@nils/ui";
import { GearSixIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Tooltip content="Settings">
      <Button variant="ghost" icon aria-label="Settings"><GearSixIcon /></Button>
    </Tooltip>
  );
}
```

### With a shortcut

```tsx live
import { Button, Tooltip } from "@nils/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Tooltip content="Search" shortcut="⌘K">
      <Button icon aria-label="Search"><MagnifyingGlassIcon /></Button>
    </Tooltip>
  );
}
```

### A toolbar

Wrap neighbouring tooltips in a `TooltipProvider`. After the first one shows, moving to the next shows it instantly, with no second wait and no second animation. One provider around the whole app is fine.

```tsx live
import { Button, Tooltip, TooltipProvider } from "@nils/ui";
import { TextBIcon, TextItalicIcon, LinkSimpleIcon, CodeIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <TooltipProvider>
      <div className="flex gap-0.5 rounded-box bg-surface p-1 shadow-[0_0_0_1px_var(--ui-line-strong)]">
        <Tooltip content="Bold" shortcut="⌘B"><Button variant="ghost" size="sm" icon aria-label="Bold"><TextBIcon /></Button></Tooltip>
        <Tooltip content="Italic" shortcut="⌘I"><Button variant="ghost" size="sm" icon aria-label="Italic"><TextItalicIcon /></Button></Tooltip>
        <Tooltip content="Link" shortcut="⌘K"><Button variant="ghost" size="sm" icon aria-label="Link"><LinkSimpleIcon /></Button></Tooltip>
        <Tooltip content="Code" shortcut="⌘E"><Button variant="ghost" size="sm" icon aria-label="Code"><CodeIcon /></Button></Tooltip>
      </div>
    </TooltipProvider>
  );
}
```

## Rules

- **Do** use it to name icon-only controls. Keep the text to a name or a few words: "Settings", "Copy link".
- **Do** set the button's `aria-label` as well. The tooltip is for sighted mouse users; the label is the accessible name.
- **Do** wrap toolbars in `TooltipProvider`.
- **Don't** put a tooltip on a button that already says what it does in text.
- **Don't** put anything interactive or essential in a tooltip. Touch users never see it. Use a `Popover`.
- **Don't** write sentences of help in it. That belongs in the UI itself.

## Props

### Tooltip

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactElement` | — | The trigger. One element that forwards a ref (e.g. `Button`). |
| `content` | `ReactNode` | — | The label. |
| `shortcut` | `string` | — | Mono key hint after the label, e.g. `"⌘,"`. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Where it opens; flips when there's no room. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | |
| `sideOffset` | `number` | `6` | Gap to the trigger, in px. |
| `delay` | `number` | provider's, else 600 | Hover time before opening, in ms. |
| `disabled` | `boolean` | `false` | Don't show it. |

### TooltipProvider

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `delay` | `number` | `500` | Hover time before the first tooltip opens. |
| `timeout` | `number` | `400` | Window in which the next tooltip opens instantly. |

## Motion

Fades in over 100ms with a 2px nudge away from the trigger; fades out in 75ms. When moving between tooltips inside a provider it switches with no animation, because by then you're scanning and animation would only slow you down.

## Accessibility

- Opens on keyboard focus as well as hover, and closes on Esc.
- The popup is linked to the trigger with `aria-describedby`. It is not the accessible name, so icon buttons still need `aria-label`.
