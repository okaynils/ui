---
title: Separator
description: A hairline between groups of content, horizontal or vertical, with an optional mono label set into the line.
group: Layout
order: 40
---

# Separator

A 1px hairline in `line` colour. It separates groups of content inside a panel, a toolbar or a page section. It can carry a short mono label.

```tsx
import { Separator } from "@nils/ui";
```

## Examples

### Horizontal

```tsx live
<div className="w-full max-w-sm">
  <p className="text-sm text-ink-2">Above the line.</p>
  <Separator className="my-3" />
  <p className="text-sm text-ink-2">Below the line.</p>
</div>
```

### With a label

The label sits at the start by default, or `align="center"`.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-6">
  <Separator label="Advanced" />
  <Separator label="or" align="center" />
</div>
```

### Vertical, in a toolbar

A vertical separator stretches to its row's height.

```tsx live
import { Button, Separator } from "@nils/ui";
import { TextBIcon, TextItalicIcon, LinkIcon, ListBulletsIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <div className="flex h-8 items-center gap-1">
      <Button icon size="sm" variant="ghost" aria-label="Bold"><TextBIcon /></Button>
      <Button icon size="sm" variant="ghost" aria-label="Italic"><TextItalicIcon /></Button>
      <Separator orientation="vertical" className="mx-1 my-1.5" />
      <Button icon size="sm" variant="ghost" aria-label="Link"><LinkIcon /></Button>
      <Button icon size="sm" variant="ghost" aria-label="List"><ListBulletsIcon /></Button>
    </div>
  );
}
```

## Rules

- **Do** use a separator between groups of different kinds (a toolbar's text tools vs. its insert tools; general vs. advanced settings).
- **Do** keep labels to one or two words. They render uppercase mono.
- **Don't** put a separator between every row. That's what `List` does.
- **Don't** thicken it or colour it. One hairline, `line` colour.

## Props

Extends Base UI's [Separator](https://base-ui.com/react/components/separator) props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the line. |
| `label` | `ReactNode` | — | Short text set into the line. Horizontal only. |
| `align` | `"start" \| "center"` | `"start"` | Where the label sits. |
| `className` | `string` | — | Spacing (`my-3`, `mx-1`). |

## Accessibility

Renders `role="separator"` with `aria-orientation`. A labelled separator still exposes the label as text, so keep it meaningful ("Advanced", not "———").
