---
title: Tree
description: A file and resource explorer with expandable branches, single selection and the full WAI-ARIA tree keyboard model.
group: Data
order: 110
---

# Tree

A nested list you can open and close: files in a repository, resources in a project, sections of a config. Branches expand in place, one node can be selected, and the whole tree is a single tab stop that you drive with the arrow keys. Use it when the hierarchy itself is the information; for a flat list use `List`, and for navigation between pages use `Sidebar`.

```tsx
import { Tree } from "@nils/ui";
import type { TreeNode, TreeProps } from "@nils/ui";
```

## Examples

### A file explorer

`mono` sets file names in the data voice. Click a folder to open it, or focus the tree and use the arrow keys: Right opens, Left closes or jumps to the parent, and typing a letter jumps to the next name that starts with it.

```tsx live
import { File, FileTs, FolderSimple } from "@phosphor-icons/react";
import { Tree } from "@nils/ui";

const folder = <FolderSimple />;
const file = <File />;
const ts = <FileTs />;

const nodes = [
  {
    id: "src", label: "src", icon: folder, children: [
      {
        id: "components", label: "components", icon: folder, children: [
          { id: "button.tsx", label: "button.tsx", icon: ts, meta: "4.1 KB" },
          { id: "tree.tsx", label: "tree.tsx", icon: ts, meta: "7.8 KB" },
        ],
      },
      { id: "lib", label: "lib", icon: folder, children: [{ id: "cn.ts", label: "cn.ts", icon: ts, meta: "0.6 KB" }] },
      { id: "index.ts", label: "index.ts", icon: ts, meta: "1.2 KB" },
    ],
  },
  { id: "docs", label: "docs", icon: folder, children: [] },
  { id: "package.json", label: "package.json", icon: file, meta: "0.9 KB" },
  { id: "README.md", label: "README.md", icon: file, meta: "2.3 KB" },
];

export default function Example() {
  return (
    <div className="w-full max-w-xs">
      <Tree aria-label="Files" mono nodes={nodes} defaultExpanded={["src", "components"]} defaultSelected="tree.tsx" />
    </div>
  );
}
```

### Controlled

Own `expanded` and `selected` when the rest of the screen depends on them, e.g. a detail panel showing the selected resource.

```tsx live
import { useState } from "react";
import { Button, Tree } from "@nils/ui";

const nodes = [
  { id: "prod", label: "Production", children: [
    { id: "api", label: "api-gateway", meta: "3" },
    { id: "db", label: "postgres-main", meta: "1" },
  ] },
  { id: "staging", label: "Staging", children: [
    { id: "api-staging", label: "api-gateway", meta: "1" },
    { id: "old", label: "legacy-worker", disabled: true },
  ] },
];

export default function Example() {
  const [expanded, setExpanded] = useState<string[]>(["prod"]);
  const [selected, setSelected] = useState<string | null>("api");
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Tree aria-label="Environments" nodes={nodes} expanded={expanded} onExpandedChange={setExpanded} selected={selected} onSelect={setSelected} />
      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="font-mono text-xs text-ink-2">Selected: {selected ?? "none"}</span>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setExpanded(["prod", "staging"])}>Expand all</Button>
          <Button size="sm" variant="ghost" onClick={() => setExpanded([])}>Collapse all</Button>
        </div>
      </div>
    </div>
  );
}
```

## Rules

- **Do** give every node an `id` that's unique across the whole tree, not just among its siblings. Paths make good ids.
- **Do** name the tree with `aria-label` ("Files", "Resources").
- **Do** give `children: []` to a branch that is empty but could hold things (an empty folder). Leave `children` out for leaves.
- **Do** pass `textValue` when `label` isn't a plain string, so type-ahead still works.
- **Do** use `meta` for one quiet fact per row (a size, a count), never for actions.
- **Don't** nest deeper than about five levels; past that the indent eats the labels. Flatten or search instead.
- **Don't** put buttons or links inside labels. A row is one control; put actions in a toolbar or a context menu for the selected node.
- **Don't** use a tree for page navigation. That's `Sidebar`.

## Props

### Tree

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` | `readonly TreeNode[]` | Required | The top-level nodes. |
| `expanded` | `readonly string[]` | — | Expanded branch ids (controlled). |
| `defaultExpanded` | `readonly string[]` | `[]` | Initially expanded branch ids. |
| `onExpandedChange` | `(expanded: string[]) => void` | — | Called with the new list when a branch opens or closes. |
| `selected` | `string \| null` | — | Selected node id (controlled). |
| `defaultSelected` | `string \| null` | `null` | Initially selected node id. |
| `onSelect` | `(id: string, node: TreeNode) => void` | — | Called when a node is selected by click, Enter or Space. |
| `mono` | `boolean` | `false` | Mono labels, for file names and paths. |
| `aria-label` | `string` | — | Accessible name. Required unless `aria-labelledby` is set. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"ul">` | — | Standard list attributes, including `ref`. |

### TreeNode

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique across the tree. |
| `label` | `ReactNode` | What the row says. |
| `textValue` | `string` | Text for type-ahead when `label` isn't a string. |
| `children` | `readonly TreeNode[]` | Makes the node a branch. |
| `icon` | `ReactNode` | A 14px icon before the label, rendered in `ink-2`. |
| `meta` | `ReactNode` | Right-aligned quiet detail in mono. |
| `disabled` | `boolean` | Focusable, but can't be selected or expanded. |

## Motion

The caret turns 90° in 150ms when a branch opens, like `Accordion`. Children appear instantly, with no height animation, because opening and closing branches with the arrow keys is a high-frequency action, and so is moving focus. Focus and selection tone change without a transition.

## Accessibility

The tree follows the WAI-ARIA tree view pattern: `role="tree"` with nested `role="group"` lists and `treeitem`s carrying `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` (branches only) and `aria-selected`. The tree is one tab stop; focus moves with the keyboard:

| Key | Action |
| --- | --- |
| `↓` / `↑` | Next / previous visible row |
| `→` | Open a closed branch; on an open branch, move to its first child |
| `←` | Close an open branch; otherwise move to the parent |
| `Home` / `End` | First / last visible row |
| `Enter` / `Space` | Select the focused row |
| `*` | Open every branch at the focused row's level |
| Letters | Jump to the next row whose name starts with what you typed |

Disabled nodes stay focusable, with `aria-disabled`, so keyboard users can find them and learn they're unavailable. Selection is shown with a tone change and medium weight, not colour alone.
