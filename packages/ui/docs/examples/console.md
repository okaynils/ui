---
title: Console showcase
description: A working machine console composed from library parts: sortable rows, live metrics, filters, deployment form and a details sheet.
group: Examples
order: 10
width: wide
---

# Console showcase

A small machine console built from library parts. Refresh usage to see the changed rows flash and the metrics roll. Filter or sort the table, select rows, open a machine, or deploy a new one. Everything is local demo data; reload to reset it. The full source below is a reference for composing an app with `@nils/ui`.

```tsx
import { AppShell, DataTable, PageHeader, Sidebar, Stat, Sheet } from "@nils/ui";
```

## Examples

### Machine console

```tsx live bleed
import { useState } from "react";
import {
  AppShell, Avatar, Badge, Breadcrumbs, Button, Callout, Code, CopyButton,
  DataTable, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogTitle, EmptyState, Field, Form, Input, KeyValue, NumberField, NumberRoll,
  PageHeader, Panel, Select, Sheet, SheetBody, SheetContent, SheetDescription,
  SheetHeader, SheetTitle, Sidebar, SidebarFooter, SidebarHeader, SidebarItem,
  SidebarSection, Stat, StatGroup, Status, TopBar, toast,
} from "@nils/ui";
import { ArrowClockwiseIcon, CpuIcon, PlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

const initial = [
  { id: "h100-01", region: "eu-north-1", gpu: "H100 · 80 GB", state: "Running", hours: 284.5, rate: 2.1 },
  { id: "h100-02", region: "eu-north-1", gpu: "H100 · 80 GB", state: "Idle", hours: 126.2, rate: 2.1 },
  { id: "a100-01", region: "us-east-1", gpu: "A100 · 40 GB", state: "Running", hours: 873.8, rate: 1.2 },
];
const regions = [
  { value: "eu-north-1", label: "Stockholm · eu-north-1" },
  { value: "us-east-1", label: "Virginia · us-east-1" },
  { value: "us-west-2", label: "Oregon · us-west-2" },
];

export default function Example() {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState<string | null>("eu-north-1");
  const [replicas, setReplicas] = useState<number | null>(1);
  const detail = rows.find((row) => row.id === detailId);
  const visible = rows.filter((row) => `${row.id} ${row.region} ${row.state}`.toLowerCase().includes(query.toLowerCase()));
  const hours = rows.reduce((sum, row) => sum + row.hours, 0);
  const spend = rows.reduce((sum, row) => sum + row.hours * row.rate, 0);

  function refresh() {
    setRows((current) => current.map((row) => row.state === "Running" ? { ...row, hours: Math.round((row.hours + 0.1) * 10) / 10 } : row));
    toast.success("Usage updated");
  }

  const columns = [
    { key: "id", header: "Machine", mono: true, sortable: true },
    { key: "region", header: "Region", mono: true, sortable: true },
    { key: "state", header: "State", sortable: true, render: (row: typeof initial[number]) => <Status tone={row.state === "Running" ? "ok" : "neutral"}>{row.state}</Status> },
    { key: "hours", header: "GPU-h", align: "right" as const, mono: true, sortable: true, render: (row: typeof initial[number]) => <NumberRoll value={row.hours} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} /> },
    { key: "rate", header: "$/hr", align: "right" as const, mono: true, sortable: true, render: (row: typeof initial[number]) => row.rate.toFixed(2) },
  ];

  return (
    <div className="h-[660px] w-full">
      <AppShell
        sidebarWidth={180}
        sidebar={
          <Sidebar aria-label="Console navigation">
            <SidebarHeader><CpuIcon className="size-4 text-ink-2" /><span>north / compute</span></SidebarHeader>
            <SidebarSection label="Workspace">
              <SidebarItem active icon={<CpuIcon />} trailing={rows.length}>Machines</SidebarItem>
            </SidebarSection>
            <SidebarFooter><div className="flex items-center gap-2 px-2 py-2"><Avatar name="Nils" size={24} /><span className="text-ui">Personal workspace</span></div></SidebarFooter>
          </Sidebar>
        }
        topBar={<TopBar start={<Breadcrumbs items={[{ label: "Personal" }, { label: "Machines" }]} />} end={<Badge>Demo</Badge>} />}
      >
        <div className="space-y-6 p-5">
          <PageHeader title="Machines" description="Your compute, at a glance." actions={<Button variant="primary" onClick={() => setDeploying(true)}><PlusIcon />Deploy machine</Button>} meta={<Status tone="ok">All systems operational</Status>} />
          <StatGroup>
            <Stat label="GPU hours" value={hours} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} caption="This month" />
            <Stat label="Spend" value={spend} format={{ style: "currency", currency: "USD" }} caption="This month" />
            <Stat label="Running" value={rows.filter((row) => row.state === "Running").length} caption={`${rows.length} machines total`} />
          </StatGroup>
          <Panel title="Machines" flush actions={<span className="font-mono text-xs text-ink-3">{selected.length ? `${selected.length} selected` : `${visible.length} total`}</span>}>
            <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
              <Input size="sm" leading={<MagnifyingGlassIcon />} aria-label="Filter machines" placeholder="Filter machines…" value={query} onValueChange={setQuery} className="min-w-0 flex-1" />
              <Button size="sm" onClick={refresh}><ArrowClockwiseIcon />Refresh usage</Button>
            </div>
            <DataTable aria-label="Machines" columns={columns} rows={visible} getRowId={(row) => row.id} selectable selected={selected} onSelectedChange={setSelected} onRowClick={(row) => setDetailId(row.id)} empty={<EmptyState title="No matching machines." description="Try a different name, region or state." ><Button size="sm" onClick={() => setQuery("")}>Clear filter</Button></EmptyState>} />
          </Panel>
          <Callout title="A working reference">Local demo data. Open a row for its details, or refresh usage to see what changed.</Callout>
        </div>
      </AppShell>
      <Sheet open={detailId !== null} onOpenChange={(open) => { if (!open) setDetailId(null); }}>
        <SheetContent>
          <SheetHeader><SheetTitle>{detail?.id ?? "Machine"}</SheetTitle><SheetDescription>Machine details and current usage.</SheetDescription></SheetHeader>
          <SheetBody>
            {detail ? <KeyValue keyWidth={100} items={[
              { label: "ID", value: <span className="inline-flex items-center gap-2"><Code>{detail.id}</Code><CopyButton value={detail.id} aria-label="Copy machine ID" /></span> },
              { label: "Region", value: detail.region, mono: true },
              { label: "GPU", value: detail.gpu, mono: true },
              { label: "State", value: <Status tone={detail.state === "Running" ? "ok" : "neutral"}>{detail.state}</Status> },
              { label: "Usage", value: `${detail.hours.toFixed(1)} GPU-h`, mono: true },
            ]} /> : null}
          </SheetBody>
        </SheetContent>
      </Sheet>
      <Dialog open={deploying} onOpenChange={setDeploying}>
        <DialogContent>
          <Form onSubmit={(event) => {
            event.preventDefault();
            const id = name.trim();
            if (rows.some((row) => row.id === id)) { toast.error("That machine name is already in use"); return; }
            const count = replicas ?? 1;
            const machines = Array.from({ length: count }, (_, i) => ({ id: count === 1 ? id : `${id}-${i + 1}`, region: region ?? "eu-north-1", gpu: "H100 · 80 GB", state: "Running", hours: 0, rate: 2.1 }));
            if (machines.some((machine) => rows.some((row) => row.id === machine.id))) { toast.error("A machine with that name already exists"); return; }
            setRows((current) => [...current, ...machines]);
            setName(""); setDeploying(false); toast.success(`${count === 1 ? "Machine" : "Machines"} deployed`);
          }}>
            <DialogTitle>Deploy machine</DialogTitle>
            <DialogDescription>Add an H100 to your workspace. This demo makes no real purchase.</DialogDescription>
            <div className="my-5 space-y-4">
              <Field label="Name"><Input required pattern="[a-z0-9-]+" placeholder="training-01" value={name} onValueChange={setName} /></Field>
              <Field label="Region"><Select items={regions} value={region} onValueChange={setRegion} /></Field>
              <Field label="Replicas"><NumberField steppers min={1} max={8} required value={replicas} onValueChange={setReplicas} /></Field>
            </div>
            <DialogFooter><DialogClose render={<Button />}>Cancel</DialogClose><Button type="submit" variant="primary">Deploy machine</Button></DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## Rules

- **Do** lift shared state into the screen: the table, stats and detail sheet all read the same rows.
- **Do** update rows immutably and give `DataTable` a stable `getRowId` so change flashes identify the right row.
- **Do** use `Field` and `Form` together for labels and validation.
- **Don't** mount another `Toaster` in a screen. The app root supplies it, along with `TooltipProvider`.
- **Don't** copy the demo's in-memory deployment handler into production. Connect it to your backend and show pending and error states.

## Props

This example exports a standalone `Example()` component with no props. Its component APIs are documented under [AppShell](/components/app-shell), [DataTable](/components/data-table), [Stat](/components/stat), [Dialog](/components/dialog) and [Sheet](/components/sheet).

## Motion

Refreshing usage rolls changed digits in 180ms and fades changed rows over 1s. Opening a row slides in the sheet in 200ms. Filtering and sorting update immediately. Reduced motion follows the library settings.

## Accessibility

The filter has an accessible name, sortable headers announce direction, and selectable rows have checkboxes. Focus a row and press Enter or Space to open its details. The dialog and sheet manage focus and close with Escape; mobile navigation opens with the top bar's menu button.
