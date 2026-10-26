---
title: Popover
description: A small floating panel anchored to a trigger, for extra detail or a few quick controls. Grows out of its trigger.
group: Overlays
order: 10
---

# Popover

A floating panel tied to the element that opened it. Use it for a little extra detail or a handful of quick settings that don't deserve a page or a dialog. It opens on click, closes on Esc or a click outside, and grows out of its trigger in 150ms.

```tsx
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription, PopoverClose } from "@nils/ui";
```

## Examples

### Basic

The trigger composes with `Button` through `render`, so it looks and presses like every other button.

```tsx live
<Popover>
  <PopoverTrigger render={<Button />}>Usage</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>This month</PopoverTitle>
    <PopoverDescription>412 of 1,000 build minutes used. Resets on Nov 1.</PopoverDescription>
  </PopoverContent>
</Popover>
```

### With controls

Keep it to a few controls. Put a close action at the end when there's something to confirm.

```tsx live
import { Button, Popover, PopoverClose, PopoverContent, PopoverTitle, PopoverTrigger } from "@nils/ui";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger render={<Button />}>
        <SlidersHorizontalIcon /> Display
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <PopoverTitle>Display</PopoverTitle>
        <div className="mt-3 space-y-2 text-ui text-ink-2">
          <div className="flex justify-between"><span>Density</span><span className="text-ink">Compact</span></div>
          <div className="flex justify-between"><span>Timestamps</span><span className="text-ink">Relative</span></div>
        </div>
        <div className="mt-4 flex justify-end">
          <PopoverClose render={<Button size="sm" variant="solid" />}>Done</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Placement

`side` and `align` choose where it opens; it flips on its own when there's no room.

```tsx live
<Popover>
  <PopoverTrigger render={<Button size="sm" />}>Right</PopoverTrigger>
  <PopoverContent side="right" align="start" className="w-56">
    <PopoverDescription className="mt-0">Opens to the right, top edges aligned.</PopoverDescription>
  </PopoverContent>
</Popover>
<Popover>
  <PopoverTrigger render={<Button size="sm" />}>Top</PopoverTrigger>
  <PopoverContent side="top" className="w-56">
    <PopoverDescription className="mt-0">Opens above, centred.</PopoverDescription>
  </PopoverContent>
</Popover>
```

## Rules

- **Do** compose the trigger with `Button` via `render` instead of styling a raw element.
- **Do** give it a `PopoverTitle` when it holds more than one line, so screen readers can name it.
- **Do** keep it small: a few lines or a few controls. More than that is a `Dialog` or a page.
- **Don't** use a popover for a list of actions. That's a `Menu`.
- **Don't** use it for a one-word label on an icon button. That's a `Tooltip`.
- **Don't** put a form that needs submitting in a popover; a stray click outside throws the input away.

## Props

`Popover` accepts Base UI [Popover.Root](https://base-ui.com/react/components/popover) props: `open`, `defaultOpen`, `onOpenChange`, `modal`. `PopoverTrigger` and `PopoverClose` accept `render` and native button attributes.

### PopoverContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right" \| "inline-start" \| "inline-end"` | `"bottom"` | Which side of the trigger to open on. Flips when there's no room. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along that side. |
| `sideOffset` | `number` | `6` | Gap to the trigger, in px. |
| `alignOffset` | `number` | `0` | Shift along the alignment axis, in px. |
| `className` | `string` | — | Width (`w-…`) and layout only. Default width is `w-72`. |

`PopoverTitle` and `PopoverDescription` take their element's usual props.

## Motion

Opens in 150ms and closes in 100ms on `ease-snap`, scaling from 96% at the trigger's side (`--transform-origin`). Nothing else moves.

## Accessibility

- The trigger gets `aria-expanded` and `aria-controls`; focus moves into the popover when it opens and back to the trigger when it closes.
- `PopoverTitle` and `PopoverDescription` label and describe the popup.
- Esc closes it. Clicking outside closes it.
