---
title: List
description: Flat rows separated by hairlines, with leading, title, meta, description and trailing slots. Whole-row links and buttons.
group: Layout
order: 20
---

# List

Flat rows separated by hairlines. Use it for collections: projects, nodes, files, settings entries. Each `ListItem` has slots for a leading icon or dot, a title, an inline mono `meta`, a second-line `description`, and a `trailing` value. Give a row `href`, `onClick` or `render` and **the whole row** becomes the pressable. It answers hover with tone and never scales.

```tsx
import { List, ListItem } from "@nils/ui";
```

## Examples

### Static rows

```tsx live
<Panel flush className="w-full max-w-md">
  <List>
    <ListItem title="Inter Variable" description="Text, controls, titles" trailing="400–600" />
    <ListItem title="JetBrains Mono" description="Labels, IDs, code" trailing="400" />
  </List>
</Panel>
```

### Pressable rows

A row with `href` is a link; a row with `onClick` is a button. `selected` marks the current row with the active fill and a 2px accent edge.

```tsx live
import { List, ListItem, Panel } from "@nils/ui";
import { FolderIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";

const projects = [
  { id: "turbine", name: "Turbine", updated: "2m ago" },
  { id: "ui", name: "nils/ui", updated: "1h ago" },
  { id: "fsop", name: "fs-openpilot", updated: "3d ago" },
];

export default function Example() {
  const [current, setCurrent] = useState("ui");
  return (
    <Panel flush className="w-full max-w-md">
      <List>
        {projects.map((p) => (
          <ListItem
            key={p.id}
            leading={<FolderIcon />}
            title={p.name}
            meta={p.id}
            trailing={<><span>{p.updated}</span><CaretRightIcon className="size-3.5 text-ink-3" /></>}
            selected={current === p.id}
            onClick={() => setCurrent(p.id)}
          />
        ))}
      </List>
    </Panel>
  );
}
```

### With status

Status is a dot plus a word. Put the dot in `leading` and the word wherever it reads best.

```tsx live
<Panel flush className="w-full max-w-md">
  <List>
    <ListItem leading={<StatusDot tone="ok" pulse />} title="api.prod" meta="v2.4.1" trailing={<span className="text-ink">Live</span>} />
    <ListItem leading={<StatusDot tone="warn" />} title="worker.prod" meta="v2.4.0" trailing={<span className="text-ink">Degraded</span>} />
    <ListItem leading={<StatusDot tone="err" />} title="cron.prod" meta="v2.3.9" trailing={<span className="text-ink">Failing</span>} />
  </List>
</Panel>
```

### As a router link

Pass your router's link element as `render`. The row's classes and content are merged into it.

```tsx
import { Link } from "react-router-dom";

<ListItem render={<Link to="/settings/billing" />} title="Billing" description="Plan, invoices, payment method" />
```

## Rules

- **Do** make the whole row the pressable (`href`/`onClick`), not a small button inside it.
- **Do** keep titles to one line. They truncate. Put a second line in `description`, not in `title`.
- **Do** put IDs, versions and counts in `meta` or `trailing`. `meta` is mono already.
- **Don't** put a `List` inside cards or give each row its own border. Rows are separated by one hairline.
- **Don't** scale or animate rows on press. Wide things respond with tone.
- **Don't** use `selected` for multi-select. It means "this is the one you're looking at".

## Props

### List

Extends every `<ul>` attribute.

### ListItem

Extends every `<li>` attribute.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Required. One line, truncated, `text-ui font-medium`. |
| `leading` | `ReactNode` | — | Icon, `StatusDot` or avatar before the text. |
| `meta` | `ReactNode` | — | Mono, `ink-3`, right after the title on the same line. |
| `description` | `ReactNode` | — | Second line, `text-xs ink-2`, truncated. |
| `trailing` | `ReactNode` | — | Right-aligned: a value, `Kbd`, chevron, small ghost button. |
| `href` | `string` | — | Renders the row as an `<a>`. |
| `onClick` | `MouseEventHandler` | — | Renders the row as a `<button>`. |
| `render` | `ReactElement` | — | Renders the row as this element (e.g. a router `Link`). |
| `selected` | `boolean` | `false` | Current row: `bg-active` + accent edge, `aria-current="page"`. |
| `disabled` | `boolean` | `false` | 45% opacity, not pressable. |

## Accessibility

- Rows are `<li>` elements inside a `<ul>`, so screen readers announce the count.
- Pressable rows are real `<a>` or `<button>` elements, so Tab, Enter and Space work.
- Keyboard focus shows instantly as a hover fill plus a 1px inset accent ring.
- Don't put another interactive element inside a pressable row; nested controls can't be reached reliably.

## Motion

Hover fill eases in over 120ms on `ease-snap`. Keyboard focus is instant. Rows never scale.
