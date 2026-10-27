---
title: Pagination
description: Moves through pages of a list or table, as buttons or real links, with a compact "Page 3 of 12" variant.
group: Data
order: 90
---

# Pagination

Moves through the pages of a table or list: previous and next arrows, the first and last page, the current page with its neighbours, and ellipses for the rest. The current page is marked with the accent ("you are here") and `aria-current`. Pages are buttons by default; pass `getHref` and they become real links, so every page has a URL that can be shared, crawled or rendered on the server. Use `compact` where there's only room for "Page 3 of 12".

```tsx
import { Pagination } from "@nils/ui";
import type { PaginationProps, PaginationLinkProps, PaginationSize } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<Pagination pageCount={20} defaultPage={7} />
```

### Under a table

Keep the page in state and slice your rows with it. Small pagination sits under a dense table, aligned with its right edge, next to a count of what's shown.

```tsx live
import { useState } from "react";
import { Pagination, Panel, Status, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nils/ui";

const RUNS = Array.from({ length: 47 }, (_, i) => ({
  id: `run_${(4120 - i).toString(36)}`,
  status: i % 9 === 3 ? "failed" : "passed",
  duration: 38 + ((i * 17) % 90),
}));
const PER_PAGE = 5;

export default function Example() {
  const [page, setPage] = useState(1);
  const rows = RUNS.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <Panel flush className="w-full">
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Run</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((run) => (
            <TableRow key={run.id}>
              <TableCell className="font-mono">{run.id}</TableCell>
              <TableCell><Status tone={run.status === "failed" ? "err" : "ok"}>{run.status === "failed" ? "Failed" : "Passed"}</Status></TableCell>
              <TableCell align="right">{run.duration}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2">
        <span className="font-mono text-xs text-ink-3 tabular-nums">
          {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, RUNS.length)} of {RUNS.length}
        </span>
        <Pagination size="sm" pageCount={Math.ceil(RUNS.length / PER_PAGE)} page={page} onPageChange={setPage} />
      </div>
    </Panel>
  );
}
```

### Links

With `getHref`, every page is an `<a>` with its own URL. For a client-side router, add `renderLink` and render your router's link with the props you're given.

```tsx live
<Pagination pageCount={12} defaultPage={3} getHref={(page) => `#page-${page}`} />
```

```tsx
<Pagination
  pageCount={pageCount}
  page={page}
  getHref={(page) => `/runs?page=${page}`}
  renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
/>
```

### Compact

For a sidebar, a card or a phone layout: previous, next and where you are.

```tsx live
<Pagination compact pageCount={12} defaultPage={3} />
```

### More neighbours

`siblings` sets how many pages show on each side of the current one. The row always keeps the same number of slots, so the arrows don't move as you page.

```tsx live
<div className="flex flex-col items-start gap-3">
  <Pagination pageCount={40} defaultPage={20} siblings={0} />
  <Pagination pageCount={40} defaultPage={20} siblings={2} />
</div>
```

## Rules

- **Do** use `getHref` for content people link to or search engines index: docs, blog archives, search results. Use buttons for app state such as a table inside a dashboard.
- **Do** pair pagination with a count ("11–15 of 47") so people know how much there is.
- **Do** use `size="sm"` under compact tables and match the size of controls on the same row.
- **Do** reset to page 1 yourself when a filter or search changes the list.
- **Don't** paginate fewer than about two screens of content. Show it all.
- **Don't** hide the component on the last page or when there's one page; disabled arrows keep the layout steady. Hide it yourself only when a list is guaranteed to fit.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pageCount` | `number` | Required | Total pages. Below 1 is treated as one page. |
| `page` | `number` | — | Current page, 1-based, for a controlled pagination. Clamped to the range. |
| `defaultPage` | `number` | `1` | Initial page when uncontrolled. |
| `onPageChange` | `(page: number) => void` | — | Called with the new page from a click on a number or an arrow. Also fires for links. |
| `siblings` | `number` | `1` | Pages shown on each side of the current page. |
| `size` | `"sm" \| "md"` | `"md"` | Height 28 / 32px, matching Button. |
| `compact` | `boolean` | `false` | Show "Page 3 of 12" with arrows only. |
| `getHref` | `(page: number) => string` | — | Render pages as links to these URLs. |
| `renderLink` | `(props: PaginationLinkProps) => ReactElement` | — | With `getHref`, render each link yourself (router links). Spread all props onto it. |
| `aria-label` | `string` | `"Pagination"` | Name of the navigation landmark. Name it when a page has more than one. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"nav">` | — | Standard attributes, including `ref`. |

`PaginationLinkProps` has `href`, `className`, `children`, `aria-label`, `aria-current` and `onClick`.

## Accessibility

The component is a `nav` landmark named "Pagination". Pages are a list of buttons or links named "Page 7", and the current one has `aria-current="page"`, so it's announced as the current page rather than identified only by colour. Arrows are named "Previous page" and "Next page". At the ends they're disabled buttons, or, in link mode, dimmed non-links with `aria-disabled`, because a link can't be disabled. Ellipses are hidden from assistive technology. Everything is reachable with Tab and activated with Enter.
