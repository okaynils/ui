---
title: DataTable
description: A table from columns and rows, with sorting, row selection, whole-row clicks, a sticky header, loading and empty states, and a brief flash on rows that change.
group: Data
order: 10
---

# DataTable

The table you reach for first. Give it `columns`, `rows` and `getRowId`, and it handles sorting, selection, whole-row clicks, a sticky header, loading rows and an empty state. Rows whose data changes in place get a brief tint, so in a live table you can see **what** updated without reading every row again.

For full control over the markup (merged cells, custom headers, a totals footer), use the [Table](/components/table) parts instead.

```tsx
import { DataTable } from "@nils/ui";
```

## Examples

### A live console table

Sort by clicking a header (ascending, then descending, then off). Press **Tick** to change some prices and states. The rows that changed flash, and the totals roll.

```tsx live
import { Button, DataTable, Panel, Stat, StatGroup, Status } from "@nils/ui";
import { useState } from "react";

const TONE = { Running: "ok", Idle: "neutral", Draining: "warn", Failed: "err" } as const;
type State = keyof typeof TONE;
type Machine = { id: string; gpu: string; region: string; state: State; price: number; since: string };

const INITIAL: Machine[] = [
  { id: "h100-01", gpu: "8× H100", region: "us-west-2", state: "Running", price: 18.4, since: "2026-10-26 09:12" },
  { id: "h100-02", gpu: "8× H100", region: "us-west-2", state: "Idle", price: 16.9, since: "2026-10-26 11:40" },
  { id: "a100-07", gpu: "4× A100", region: "eu-north-1", state: "Running", price: 7.2, since: "2026-10-25 22:03" },
  { id: "l40s-03", gpu: "2× L40S", region: "us-east-1", state: "Draining", price: 2.95, since: "2026-10-26 14:55" },
  { id: "h200-01", gpu: "8× H200", region: "eu-north-1", state: "Failed", price: 24.1, since: "2026-10-26 16:21" },
];

const STATES: State[] = ["Running", "Idle", "Draining", "Failed"];

export default function Example() {
  const [rows, setRows] = useState(INITIAL);
  const tick = () =>
    setRows((rs) =>
      rs.map((r, i) =>
        i === Math.floor(Math.random() * rs.length) || Math.random() < 0.25
          ? { ...r, price: Math.round(r.price * (0.9 + Math.random() * 0.2) * 100) / 100, state: STATES[Math.floor(Math.random() * 4)] }
          : r,
      ),
    );
  const running = rows.filter((r) => r.state === "Running");
  return (
    <div className="flex w-full flex-col gap-3">
      <StatGroup>
        <Stat label="Running" value={running.length} />
        <Stat label="Spend / hr" value={running.reduce((s, r) => s + r.price, 0)} format={{ style: "currency", currency: "USD" }} />
      </StatGroup>
      <Panel title="Machines" actions={<Button size="sm" variant="ghost" onClick={tick}>Tick</Button>} flush className="w-full">
        <DataTable
          aria-label="Machines"
          rows={rows}
          getRowId={(m) => m.id}
          defaultSort={{ key: "price", direction: "desc" }}
          columns={[
            { key: "id", header: "ID", mono: true, sortable: true },
            { key: "gpu", header: "GPU" },
            { key: "region", header: "Region", mono: true, sortable: true },
            { key: "state", header: "State", sortable: true, render: (m) => <Status tone={TONE[m.state]}>{m.state}</Status> },
            { key: "price", header: "$/hr", align: "right", sortable: true, render: (m) => m.price.toFixed(2) },
          ]}
        />
      </Panel>
    </div>
  );
}
```

### Selection

`selectable` adds a checkbox column. The header box selects everything visible and goes indeterminate when some rows are picked. Read the ids with `onSelectedChange`.

```tsx live
import { Button, DataTable, Panel } from "@nils/ui";
import { useState } from "react";

const DEPLOYS = [
  { id: "dpl_8f2c", branch: "main", author: "nils", age: "2m" },
  { id: "dpl_77a1", branch: "feat/table", author: "nils", age: "14m" },
  { id: "dpl_41de", branch: "fix/focus-ring", author: "ada", age: "1h" },
  { id: "dpl_0b93", branch: "main", author: "ada", age: "3h" },
];

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["dpl_77a1"]);
  return (
    <Panel
      flush
      className="w-full"
      title="Deployments"
      footer={
        <>
          <span className="tabular-nums">{selected.length} of {DEPLOYS.length} selected</span>
          <Button size="sm" variant="danger" disabled={selected.length === 0}>Cancel {selected.length || ""}</Button>
        </>
      }
    >
      <DataTable
        aria-label="Deployments"
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        rows={DEPLOYS}
        getRowId={(d) => d.id}
        columns={[
          { key: "id", header: "ID", mono: true },
          { key: "branch", header: "Branch", mono: true },
          { key: "author", header: "Author" },
          { key: "age", header: "Age", align: "right", mono: true },
        ]}
      />
    </Panel>
  );
}
```

### Clickable rows, compact, sticky header

`onRowClick` makes each whole row pressable: tone on hover, Enter or Space from the keyboard. Give the table a max height through `className` and the header sticks.

```tsx live
import { DataTable, Panel, toast } from "@nils/ui";

const LOGS = Array.from({ length: 24 }, (_, i) => ({
  id: `req_${(4096 + i * 37).toString(16)}`,
  path: ["/api/machines", "/api/billing", "/api/deploys", "/healthz"][i % 4],
  status: [200, 200, 201, 404, 500][i % 5],
  ms: 8 + ((i * 53) % 340),
}));

export default function Example() {
  return (
    <Panel flush className="w-full">
      <DataTable
        aria-label="Requests"
        density="compact"
        className="max-h-64"
        rows={LOGS}
        getRowId={(r) => r.id}
        onRowClick={(r) => toast(`Opened ${r.id}`)}
        columns={[
          { key: "id", header: "Request", mono: true, width: 120 },
          { key: "path", header: "Path", mono: true },
          {
            key: "status",
            header: "Status",
            align: "right",
            mono: true,
            sortable: true,
            render: (r) => <span className={r.status >= 500 ? "text-err" : r.status >= 400 ? "text-warn" : undefined}>{r.status}</span>,
          },
          { key: "ms", header: "Time", align: "right", mono: true, sortable: true, render: (r) => `${r.ms} ms` },
        ]}
      />
    </Panel>
  );
}
```

### Loading and empty

`loading` shows placeholder rows. They appear only if loading takes longer than 300ms, so fast responses never blink (see [Skeleton](/components/skeleton)). With no rows, `empty` is shown. Pass an `EmptyState` for anything more than a sentence.

```tsx live
import { DataTable, EmptyState, Panel, SegmentedControl } from "@nils/ui";
import { useState } from "react";

const columns = [
  { key: "name", header: "Name" },
  { key: "region", header: "Region", mono: true },
  { key: "cost", header: "Cost", align: "right" as const },
];

export default function Example() {
  const [mode, setMode] = useState("loading");
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <SegmentedControl size="sm" value={mode} onValueChange={setMode} items={[{ value: "loading", label: "Loading" }, { value: "empty", label: "Empty" }]} />
      <Panel flush className="w-full">
        <DataTable
          aria-label="Volumes"
          loading={mode === "loading"}
          rows={[]}
          getRowId={(r: { name: string }) => r.name}
          columns={columns}
          empty={<EmptyState title="No volumes yet." description="Volumes you attach to machines show up here." />}
        />
      </Panel>
    </div>
  );
}
```

## Rules

- **Do** put a DataTable in a `<Panel flush>`. The panel gives the frame and the title row, and the table runs edge to edge inside it.
- **Do** right-align numbers and money (`align: "right"`). Right-aligned cells get tabular figures automatically.
- **Do** use `mono` for IDs, regions, hashes and timestamps, and `render` with `Status` for state columns.
- **Do** make `getRowId` return a real, stable id. Selection and the change flash depend on it. An array index breaks both.
- **Don't** put Buttons in every row to "open" it. Use `onRowClick`, and keep per-row actions in a `ContextMenu` or one ghost `icon` button at the end.
- **Don't** colour whole rows by status. Use a `Status` cell.
- **Don't** turn `flash` off for live data. Do turn it off when *you* caused the change (e.g. re-sorting server-side), where the tint would mean nothing.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `DataTableColumn<Row>[]` | — | Column definitions, see below. |
| `rows` | `Row[]` | — | The data. |
| `getRowId` | `(row) => string` | — | Stable id per row. |
| `sort` | `{ key, direction: "asc" \| "desc" } \| null` | — | Controlled sort. |
| `defaultSort` | same | `null` | Initial sort when uncontrolled. |
| `onSortChange` | `(sort) => void` | — | Header clicks cycle asc → desc → off. |
| `selectable` | `boolean` | `false` | Adds the checkbox column. |
| `selected` | `string[]` | — | Controlled selected ids. |
| `defaultSelected` | `string[]` | `[]` | Initial selection when uncontrolled. |
| `onSelectedChange` | `(ids: string[]) => void` | — | Selection changed. |
| `onRowClick` | `(row) => void` | — | Makes rows pressable (pointer, Enter, Space). |
| `flash` | `boolean` | `true` | Tint rows that changed or appeared since the last render. Never on first render. |
| `loading` | `boolean` | `false` | Placeholder rows (after 300ms). |
| `empty` | `ReactNode` | `"No rows."` | Shown when `rows` is empty. |
| `density` | `"default" \| "compact"` | `"default"` | Rows 36px / 28px. |
| `aria-label` | `string` | — | Name the table for screen readers. |
| `className` | `string` | — | On the scroll wrapper: `max-h-*` for a sticky header. |

### `DataTableColumn<Row>`

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Column id, and the field read from the row by default. |
| `header` | `ReactNode` | Header text (rendered in the mono label voice). |
| `align` | `"left" \| "right" \| "center"` | `right` for numbers. |
| `mono` | `boolean` | Mono cell text. |
| `width` | `number \| string` | Fixed width (`120` px or `"20%"`). |
| `sortable` | `boolean` | Header becomes a sort button. |
| `value` | `(row) => unknown` | Raw value for sorting and default display, if not `row[key]`. Return a number or `Date` for numeric sort. |
| `render` | `(row) => ReactNode` | Custom cell content. Sorting still uses `value`. |

## Motion

- **Change flash:** a row whose fields changed (shallow compare by `getRowId`), or that just appeared, gets `ui-flash`: an `accent-tint` wash that fades out over 1s. It restarts if the row changes again mid-fade. It never moves layout and never plays on first render or while `loading`.
- **Hover:** 120ms tone. Keyboard focus is instant and drawn as a 2px accent edge on the left of the row.
- Sorting re-orders instantly. Nothing slides.

## Accessibility

- Renders a native `<table>`. Sortable headers are buttons, and the column's `aria-sort` reflects the state.
- Selected rows have `aria-selected`. The checkboxes are labelled "Select row" and "Select all rows".
- Clickable rows are focusable (`tabIndex=0`) and respond to Enter and Space. Clicks on the checkbox cell don't trigger the row.
- `loading` sets `aria-busy` on the table.
