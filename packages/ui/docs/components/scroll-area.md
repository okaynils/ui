---
title: ScrollArea
description: A scroll container with thin overlay scrollbars and edge fades that show only where more content is hidden.
group: Layout
order: 70
---

# ScrollArea

A region that scrolls inside a fixed height or width: a sidebar's item list, a log, a wide table, a long menu. The browser does the scrolling, so wheel, trackpad, touch, keyboard and find-in-page all behave natively. Only the scrollbar is drawn: a thin bar that appears while you hover or scroll and stays out of the way otherwise. Edges with more content past them fade out, so you can see there's more without a scrollbar on screen.

```tsx
import { ScrollArea } from "@nils/ui";
import type { ScrollAreaProps, ScrollAreaOrientation } from "@nils/ui";
```

## Examples

### A sidebar list

Give the scroll area a height; the content scrolls inside it. The top edge stays sharp until you scroll away from it.

```tsx live
import { ScrollArea, SidebarItem } from "@nils/ui";

const PROJECTS = [
  "api-gateway", "billing", "checkout", "data-pipeline", "docs", "edge-cache", "feature-flags",
  "identity", "inference", "ingest", "marketing-site", "metrics", "notifications", "search", "storage", "web",
];

export default function Example() {
  return (
    <div className="w-56 rounded-box border border-line bg-panel">
      <div className="border-b border-line px-3 py-2"><span className="ui-label">Projects</span></div>
      <ScrollArea className="h-64" contentClassName="p-1.5">
        {PROJECTS.map((name, i) => (
          <SidebarItem key={name} active={i === 3} trailing={i % 4 === 0 ? 3 : undefined}>{name}</SidebarItem>
        ))}
      </ScrollArea>
    </div>
  );
}
```

### A wide table

`orientation="horizontal"` scrolls sideways, for tables wider than their column. The right edge fades while there are more columns past it.

```tsx live
import { ScrollArea, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nils/ui";

const RUNS = [
  { id: "run_8f2a", model: "llama-3-70b", gpus: "8× H100", region: "us-west-2", started: "09:14", duration: "2h 31m", cost: "$412.80", status: "Done" },
  { id: "run_8f2b", model: "mistral-large", gpus: "4× A100", region: "eu-north-1", started: "10:02", duration: "48m", cost: "$58.10", status: "Done" },
  { id: "run_8f2c", model: "qwen-72b", gpus: "8× H100", region: "us-east-1", started: "11:40", duration: "1h 05m", cost: "$176.00", status: "Running" },
];

export default function Example() {
  return (
    <div className="w-full max-w-md rounded-box border border-line">
      <ScrollArea orientation="horizontal">
        <Table aria-label="Training runs" className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              {["Run", "Model", "GPUs", "Region", "Started", "Duration", "Cost", "Status"].map((h) => <TableHead key={h}>{h}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {RUNS.map((r) => (
              <TableRow key={r.id}>
                <TableCell mono>{r.id}</TableCell>
                <TableCell>{r.model}</TableCell>
                <TableCell>{r.gpus}</TableCell>
                <TableCell>{r.region}</TableCell>
                <TableCell mono>{r.started}</TableCell>
                <TableCell mono>{r.duration}</TableCell>
                <TableCell mono>{r.cost}</TableCell>
                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
```

### Both directions, no fade

`orientation="both"` scrolls a canvas-like area in two directions. `fade={false}` keeps the edges sharp, for content like code where a fade could hide a character.

```tsx live
<ScrollArea orientation="both" fade={false} className="h-40 w-full max-w-sm rounded-box border border-line bg-panel" contentClassName="p-3">
  <pre className="m-0 font-mono text-xs leading-5 text-ink-2">
{Array.from({ length: 24 }, (_, i) => `[${String(i).padStart(2, "0")}:00:0${i % 10}] worker-${i % 6} heartbeat ok · queue=${(i * 37) % 120} · mem=${(i * 13) % 90}% · region=eu-north-1 · build=a1b2c3d`).join("\n")}
  </pre>
</ScrollArea>
```

## Rules

- **Do** give the scroll area a size: a height for vertical, a constrained width for horizontal. Without one it grows with its content and never scrolls.
- **Do** put padding on `contentClassName`, not on the root, so scrolled content passes under the fade instead of stopping short of it.
- **Do** use it for regions inside a page: sidebars, panels, menus, logs, wide tables.
- **Don't** wrap the whole page in a ScrollArea. Let the document scroll with the browser's own scrollbar.
- **Don't** nest scroll areas that scroll in the same direction. A wheel gesture can only mean one of them.
- **Don't** use the fade on content where the last line matters at a glance, like a code block; pass `fade={false}`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Which way the content scrolls. Scrolling on the other axis is clipped. |
| `fade` | `boolean` | `true` | Fade edges that have more content past them. |
| `fadeSize` | `number` | `24` | Length of the fade in px. |
| `className` | `string` | — | Classes on the root. Size it here (`h-64`, `max-h-80`, `w-full`), plus borders and corners. |
| `contentClassName` | `string` | — | Classes on the content wrapper, e.g. padding. |
| `overflowEdgeThreshold` | `number \| { xStart, xEnd, yStart, yEnd }` | `0` | Pixels from an edge before it counts as overflowing (passed to Base UI). |
| `...props` | `ScrollArea.Root.Props` | — | Other Base UI root props, including `ref`. |

Exports `ScrollAreaProps` and `ScrollAreaOrientation`.

## Motion

Scrollbars appear on the frame you start hovering or scrolling, with no fade-in, and fade out over 150ms when you stop. The thumb darkens on hover (120ms). Edge fades aren't animated. They follow the scroll position, growing over the first 24px as you move away from an edge, so nothing pops in. Under `prefers-reduced-motion` the scrollbar fade is instant.

## Accessibility

The viewport is a native scroll container. Once it's focused, arrow keys, Page Up/Down, Home/End and Space scroll it, and the focus ring is drawn around the whole area (a ring on the viewport itself would be clipped by the fade). The custom scrollbars are for pointers only and are hidden from assistive technology, which uses the native scrolling. Content past a fade is still in the DOM and fully readable by screen readers and find-in-page.
