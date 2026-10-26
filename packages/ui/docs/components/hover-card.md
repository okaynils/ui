---
title: HoverCard
description: A preview that appears when you rest on a link, name or ID. Opens after 400ms, grows from the trigger, never holds anything essential.
group: Feedback
order: 90
---

# HoverCard

A preview of what's behind a link, a name or an ID, shown when the pointer rests on it (or it gets keyboard focus). It opens after 400ms, long enough not to fire as the pointer passes over, and grows out of its trigger like a popover. The trigger is still a working link.

Use a [Tooltip](/components/tooltip) to name a control, and a [Popover](/components/popover) for anything you click to open or interact with.

```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@nils/ui";
```

## Examples

### A person

```tsx live
<p className="text-sm text-ink-2">
  Deployed by{" "}
  <HoverCard>
    <HoverCardTrigger href="#ada">Ada Lovelace</HoverCardTrigger>
    <HoverCardContent>
      <div className="flex items-center gap-3">
        <Avatar name="Ada Lovelace" size={40} />
        <div>
          <div className="font-medium text-ink">Ada Lovelace</div>
          <div className="text-xs text-ink-2">ada@analytical.engine</div>
        </div>
      </div>
      <div className="mt-3 flex gap-4 border-t border-line pt-3 text-xs text-ink-2">
        <span><span className="font-mono text-ink tabular-nums">142</span> deploys</span>
        <span>Joined Mar 2024</span>
      </div>
    </HoverCardContent>
  </HoverCard>{" "}
  2 minutes ago.
</p>
```

### An ID

```tsx live
<p className="text-sm text-ink-2">
  Running on{" "}
  <HoverCard>
    <HoverCardTrigger href="#h100-01" className="font-mono text-[0.92em]">h100-01</HoverCardTrigger>
    <HoverCardContent className="w-64">
      <div className="flex items-center justify-between">
        <span className="font-mono text-ink">h100-01</span>
        <Status tone="ok">Running</Status>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        <dt className="text-ink-3">Region</dt><dd className="text-ink">us-west</dd>
        <dt className="text-ink-3">GPUs</dt><dd className="font-mono text-ink">8× H100</dd>
        <dt className="text-ink-3">Uptime</dt><dd className="font-mono text-ink tabular-nums">3d 4h</dd>
      </dl>
    </HoverCardContent>
  </HoverCard>
  .
</p>
```

## Rules

- **Do** make the trigger useful on its own: a link that goes to the full page.
- **Do** keep the card a preview: a few facts, no forms.
- **Don't** put anything people need only in a hover card. Touch screens and many keyboard users won't see it.
- **Don't** put buttons inside unless they duplicate something reachable elsewhere.

## Props

### HoverCard

Extends Base UI's [PreviewCard.Root](https://base-ui.com/react/components/preview-card): `open`, `onOpenChange`, `defaultOpen`.

### HoverCardTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | — | It renders an `<a>`, so give it somewhere to go. |
| `delay` | `number` | `400` | ms before opening. |
| `closeDelay` | `number` | `150` | ms before closing after the pointer leaves. |
| `render` | `ReactElement` | — | Swap the element. |

### HoverCardContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Flips when there's no room. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | |
| `sideOffset` | `number` | `6` | Gap from the trigger in px. |
| `className` | `string` | — | Width (`w-…`) and layout. Default `w-72`, `p-3`. |

## Motion

Opens with opacity and `scale(0.96 → 1)` from the trigger in 150ms, and closes in 100ms. Same as Popover.

## Accessibility

- The trigger is a real link and works without the card.
- The card opens on keyboard focus too, and closes on Esc or blur.
- Screen readers don't announce the card automatically; that's why its content must not be essential.
