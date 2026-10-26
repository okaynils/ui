---
title: PageHeader
description: The top of a page — title, one-sentence description, actions on the right, and a mono row of facts.
group: Shell
order: 50
---

# PageHeader

The top of a page. It has the title (26px, the page's `<h1>`), an optional one-sentence description, actions on the right, and a `meta` row of facts in mono: IDs, status, dates. Breadcrumbs can sit above it when the TopBar doesn't already carry them.

```tsx
import { PageHeader } from "@nils/ui";
```

## Examples

### Title, description and actions

```tsx live
<PageHeader
  className="w-full"
  title="Nodes"
  description="Machines rented in this workspace. Billed by the second."
  actions={
    <>
      <Button>Export</Button>
      <Button variant="primary">Rent node</Button>
    </>
  }
/>
```

### A detail page with facts

Put each fact in its own element. They wrap on narrow screens. Status is a dot plus a word.

```tsx live
<PageHeader
  className="w-full"
  breadcrumbs={<Breadcrumbs items={[{ label: "Nodes", href: "#" }, { label: "h100-01" }]} />}
  title="h100-01"
  actions={
    <>
      <Button>Restart</Button>
      <Button variant="danger">Release</Button>
    </>
  }
  meta={
    <>
      <span><StatusDot tone="ok" /> Running</span>
      <span>us-west-2</span>
      <span>8× H100</span>
      <span className="text-ink-3">id 7f3a9c21</span>
    </>
  }
  bordered
/>
```

## Rules

- **Do** use one PageHeader per page, at the top, and only one `<h1>`.
- **Do** keep the description to one sentence. Longer explanations go in the page.
- **Do** order actions with the primary one last (rightmost), and at most one `primary`.
- **Don't** repeat the title in the TopBar. The TopBar holds breadcrumbs.
- **Don't** put controls (filters, search) in `actions`. Those go in a [Toolbar](/components/toolbar) below the header.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | The page's name, rendered as `<h1>`. |
| `description` | `ReactNode` | — | One sentence under the title. |
| `breadcrumbs` | `ReactNode` | — | A `<Breadcrumbs>` above the title. |
| `actions` | `ReactNode` | — | Buttons on the right. Wrap under the title when narrow. |
| `meta` | `ReactNode` | — | A mono row of facts. One element per fact. |
| `bordered` | `boolean` | `false` | Hairline under the header, for pages that open with a list or table. |

All `<header>` props pass through.

## Accessibility

The title is the page's `<h1>`. Don't add another `<h1>` to the page.
