---
title: Table
description: The styled table parts (Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell) for markup DataTable can't express.
group: Data
order: 20
---

# Table

The table parts that [DataTable](/components/data-table) is built from. They're plain `<table>` elements with the console look: mono label headers on the panel tone, hairlines between rows, 36px rows, tabular figures on right-aligned cells. Use them when you need markup DataTable doesn't produce, such as a totals footer, merged cells or grouped rows. Otherwise use DataTable.

```tsx
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from "@nils/ui";
```

## Examples

### Invoice with a totals footer

```tsx live
import { Panel, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@nils/ui";

const LINES = [
  { item: "8× H100 · us-west-2", hours: 212.5, rate: 18.4 },
  { item: "4× A100 · eu-north-1", hours: 96, rate: 7.2 },
  { item: "Block storage · 2 TB", hours: 720, rate: 0.03 },
];
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function Example() {
  const total = LINES.reduce((s, l) => s + l.hours * l.rate, 0);
  return (
    <Panel flush title="October 2026" className="w-full">
      <Table aria-label="Invoice">
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead align="right">Hours</TableHead>
            <TableHead align="right">Rate</TableHead>
            <TableHead align="right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LINES.map((l) => (
            <TableRow key={l.item}>
              <TableCell>{l.item}</TableCell>
              <TableCell align="right">{l.hours.toFixed(1)}</TableCell>
              <TableCell align="right" mono>{l.rate.toFixed(2)}</TableCell>
              <TableCell align="right">{usd(l.hours * l.rate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell align="right">{usd(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Panel>
  );
}
```

### Compact, with a selected row

`density="compact"` gives 28px rows. `TableRow selected` tints the row and sets `aria-selected`.

```tsx live
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nils/ui";

export default function Example() {
  return (
    <Table density="compact" aria-label="Environment variables" className="max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell mono>DATABASE_URL</TableCell><TableCell mono className="text-ink-3">••••••••</TableCell></TableRow>
        <TableRow selected><TableCell mono>REGION</TableCell><TableCell mono>us-west-2</TableCell></TableRow>
        <TableRow><TableCell mono>LOG_LEVEL</TableCell><TableCell mono>info</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}
```

## Rules

- **Do** reach for `DataTable` first. These parts don't sort, select or flash by themselves.
- **Do** use `align="right"` on both the `TableHead` and the `TableCell` of a numeric column.
- **Do** keep a table inside a `<Panel flush>` when it needs a frame or title.
- **Don't** add borders, backgrounds or zebra stripes. Hairlines and tone are the whole system.
- **Don't** put more than one line of text in a cell. Use a details view (`Dialog`, a side panel) for long content.

## Props

| Part | Element | Props |
| --- | --- | --- |
| `Table` | `<table>` in a scroll `<div>` | `density`: `"default" \| "compact"`. `containerClassName`: classes for the scroll wrapper (`max-h-96` makes the header sticky). |
| `TableHeader` | `<thead>` | — |
| `TableBody` | `<tbody>` | — |
| `TableFooter` | `<tfoot>` | Panel tone, hairline on top. For totals. |
| `TableRow` | `<tr>` | `selected`: tint + `aria-selected`. `interactive`: hover tone and focus style. Add `onClick` + `tabIndex={0}` yourself. |
| `TableHead` | `<th scope="col">` | `align`. Sticky at the top of the scroll wrapper. |
| `TableCell` | `<td>` | `align`, `mono`. |

All parts pass through their element's native props.

## Accessibility

- Real table semantics. Give the `Table` an `aria-label` (or a visible caption nearby referenced by `aria-labelledby`).
- An `interactive` row needs `tabIndex={0}` and an Enter/Space handler to be keyboard-reachable. `DataTable` does this for you.
