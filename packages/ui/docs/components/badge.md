---
title: Badge
description: A 20px hairline label for counts, versions, states and tags. Optional status dot, optional mono. Never filled with colour.
group: Feedback
order: 20
---

# Badge

A small label: a count, a version, a state, a tag. It's a hairline outline with ink-2 text and **no fill**, so a column full of them stays quiet. A state gets a leading status dot via `tone`.

```tsx
import { Badge } from "@nils/ui";
```

## Examples

### Kinds

```tsx live
<Badge>Beta</Badge>
<Badge mono>v0.1.0</Badge>
<Badge mono>12</Badge>
<Badge tone="ok">Running</Badge>
<Badge tone="warn">Queued</Badge>
<Badge tone="err">Failed</Badge>
```

### In a row

Badges sit beside a title, aligned to its centre.

```tsx live
<div className="flex w-full max-w-sm items-center gap-2 text-sm font-medium text-ink">
  h100-cluster-01
  <Badge mono>8× H100</Badge>
  <Badge tone="ok" className="ml-auto">Running</Badge>
</div>
```

### With an icon

Icons inside are 12px.

```tsx live
import { Badge } from "@nils/ui";
import { GitBranchIcon, LockSimpleIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <>
      <Badge mono><GitBranchIcon /> main</Badge>
      <Badge><LockSimpleIcon /> Private</Badge>
    </>
  );
}
```

## Rules

- **Do** use `mono` for anything machine-ish: versions, IDs, hashes, counts.
- **Do** use `tone` for a state, so the colour is a dot and the word stays ink.
- **Don't** fill a badge with colour or colour its text. There is no "red badge".
- **Don't** make badges clickable. A filter chip is a `SegmentedControl` or a `Button size="sm"`.
- **Don't** put a sentence in a badge. One or two words.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"ok" \| "warn" \| "err" \| "accent" \| "neutral"` | — | Adds a leading `StatusDot`. |
| `mono` | `boolean` | `false` | Mono 11px with tabular numbers. |
| `...props` | `ComponentProps<"span">` | — | Passed to the `<span>`. |

## Accessibility

Plain text in a `<span>`. The tone dot is decorative; the word carries the meaning, so screen readers and colour-blind users get the same information.
