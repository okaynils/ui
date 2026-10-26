---
title: Skeleton
description: A quiet placeholder block for loading content. It waits 300ms before appearing, so fast loads never flash.
group: Data
order: 80
---

# Skeleton

A placeholder for content that's on its way: a flat `hover`-grey block with a slow, faint pulse. It **waits 300ms before showing**. Most loads finish before then, and a skeleton that appears for 80ms and vanishes reads as a glitch, so fast loads show nothing at all. The space is reserved either way, so nothing jumps when content arrives.

```tsx
import { Skeleton } from "@nils/ui";
```

## Examples

### Shaped like what's coming

Size it with classes to match the real content.

```tsx live
<div className="flex w-full max-w-sm items-center gap-3">
  <Skeleton className="size-8 rounded-full" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="h-3.5 w-32" />
    <Skeleton className="h-3 w-48" />
  </div>
</div>
```

### Text lines

`lines` renders N text-height bars, with the last one shorter.

```tsx live
<Skeleton lines={3} className="max-w-sm" />
```

### Showing up only when it's slow

```tsx live
import { Button, KeyValue, Skeleton } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const load = (ms: number) => {
    setState("loading");
    setTimeout(() => setState("done"), ms);
  };
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => load(150)}>Fast load (150ms)</Button>
        <Button size="sm" onClick={() => load(1500)}>Slow load (1.5s)</Button>
      </div>
      <div className="h-20">
        {state === "loading" ? (
          <Skeleton lines={3} />
        ) : state === "done" ? (
          <KeyValue dividers={false} items={[{ label: "Region", value: "us-west-2", mono: true }, { label: "GPU", value: "8× H100" }]} />
        ) : null}
      </div>
    </div>
  );
}
```

## Rules

- **Do** match the size and position of the content that replaces it, so nothing shifts.
- **Do** keep the default `delay`. Lower it only for loads you *know* are slow.
- **Don't** use skeletons for things that load in well under a second on a good connection. With the delay they show nothing anyway, but then a skeleton isn't needed.
- **Don't** add shimmer gradients. The pulse is the whole effect.
- **Don't** skeleton a whole page. Skeleton the region that's loading and render everything you already have.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `delay` | `number` (ms) | `300` | Stay invisible this long before showing. `0` shows immediately. |
| `lines` | `number` | — | Render N text-like lines instead of one block. |
| `className` | `string` | — | Size and shape: `h-4 w-40`, `size-8 rounded-full`. |

## Motion

- Fades in over 150ms after the delay.
- Pulses on a 2s loop between full and half opacity. It's ambient, not a response. Off under `prefers-reduced-motion`.

## Accessibility

Skeletons are `aria-hidden`. Mark the loading region itself with `aria-busy="true"` (DataTable does this), and make sure the arrival of content is announced if it matters (e.g. a `toast` for a background job).
