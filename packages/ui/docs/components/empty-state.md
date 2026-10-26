---
title: EmptyState
description: What a list, table or page shows when there is nothing in it. A fact, a reason and the next action. No illustrations.
group: Layout
order: 50
---

# EmptyState

What a list, table or page shows when it has nothing in it. It states the fact, says in one sentence why or what will appear, and offers the next action. It's quiet on purpose: no illustrations, no jokes.

```tsx
import { EmptyState } from "@nils/ui";
```

## Examples

### With an action

```tsx live
import { Button, EmptyState } from "@nils/ui";
import { FolderSimpleIcon, PlusIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <EmptyState
      icon={<FolderSimpleIcon />}
      title="No projects yet."
      description="Projects group your deployments, keys and logs."
    >
      <Button variant="primary"><PlusIcon /> New project</Button>
    </EmptyState>
  );
}
```

### Inside a panel

```tsx live
import { EmptyState, Panel, Button } from "@nils/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Panel title="Results" flush className="w-full max-w-md">
      <EmptyState
        icon={<MagnifyingGlassIcon />}
        title="No matches for “h200”."
        description="Try a different region, or clear the filters."
      >
        <Button size="sm">Clear filters</Button>
      </EmptyState>
    </Panel>
  );
}
```

### Left-aligned

Use `align="start"` when the empty state sits in a left-aligned layout, such as a page section under a heading.

```tsx live
<div className="w-full max-w-md">
  <EmptyState align="start" title="No API keys." description="Keys you create will appear here." className="py-4">
    <Button size="sm">Create key</Button>
  </EmptyState>
</div>
```

## Rules

- **Do** write the title as a short statement of fact ending in a period: "No projects yet."
- **Do** offer exactly one next action when there is one. Make it `primary` only if it's the main action of the view.
- **Do** when a search or filter caused the emptiness, name the query and offer a way out (clear filters).
- **Don't** use illustrations, emoji, or cheerful copy ("Nothing to see here!").
- **Don't** show an empty state while data is still loading.

## Props

Extends every `<div>` attribute.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Required. The fact. |
| `description` | `ReactNode` | — | One sentence of context. |
| `icon` | `ReactNode` | — | A 16px icon in a small hairline square. |
| `children` | `ReactNode` | — | The action(s), usually one `Button`. |
| `align` | `"start" \| "center"` | `"center"` | Alignment of the whole block. |

## Accessibility

Plain text and your action. If the empty state replaces a list after a search, consider announcing it with an `aria-live="polite"` region around the results.
