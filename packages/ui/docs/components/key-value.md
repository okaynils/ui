---
title: KeyValue
description: A description list for the properties of one thing (keys in the mono label voice, values in ink), as a key column or stacked.
group: Data
order: 50
---

# KeyValue

The properties of one thing (a machine, an order, a deploy) as label/value rows. Keys use the mono label voice and values are ink, with hairlines between rows. Use `layout="stacked"` in narrow spaces like a sidebar or a popover.

```tsx
import { KeyValue, KeyValueItem } from "@nils/ui";
```

## Examples

### Details panel

```tsx live
<Panel title="h100-01" className="w-full max-w-md">
  <KeyValue
    items={[
      { label: "State", value: <Status tone="ok">Running</Status> },
      { label: "GPU", value: "8× H100 80GB" },
      { label: "Region", value: "us-west-2", mono: true },
      { label: "Image", value: "ghcr.io/nils/train:2026.10.3", mono: true },
      { label: "Started", value: "2026-10-26 09:12 UTC", mono: true },
      { label: "Rate", value: "$18.40 / hr" },
    ]}
  />
</Panel>
```

### Stacked

```tsx live
<div className="w-56">
  <KeyValue
    layout="stacked"
    dividers={false}
    items={[
      { label: "Owner", value: "nils" },
      { label: "Commit", value: "8f2c1e0", mono: true },
      { label: "Note", value: undefined },
    ]}
  />
</div>
```

### Children instead of items

`KeyValueItem` children work when values need logic or components.

```tsx live
import { Button, KeyValue, KeyValueItem } from "@nils/ui";

export default function Example() {
  return (
    <KeyValue className="max-w-md" keyWidth={100}>
      <KeyValueItem label="API key" mono>
        <span className="flex items-center justify-between gap-2">
          sk_live_••••••••3f9a
          <Button size="sm" variant="ghost">Reveal</Button>
        </span>
      </KeyValueItem>
      <KeyValueItem label="Created">3 days ago</KeyValueItem>
    </KeyValue>
  );
}
```

## Rules

- **Do** use `mono` for anything you'd copy-paste: IDs, hashes, regions, versions, timestamps.
- **Do** use it for *one* object's properties. For many objects, use a [DataTable](/components/data-table).
- **Don't** pass `key` as a field. It's `label` (React reserves `key`).
- **Don't** right-align values. They read left to right from the key column.
- An empty value renders a quiet "—". Don't write "N/A" yourself.

## Props

### KeyValue

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `{ label, value, mono? }[]` | — | The rows. Or use `KeyValueItem` children. |
| `layout` | `"horizontal" \| "stacked"` | `"horizontal"` | Key column beside values, or key above value. |
| `keyWidth` | `number \| string` | `140` | Key column width (horizontal). |
| `dividers` | `boolean` | `true` | Hairlines between rows. |
| `...props` | `ComponentProps<"dl">` | — | On the `<dl>`. |

### KeyValueItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | The key. |
| `children` | `ReactNode` | — | The value. Empty shows "—". |
| `mono` | `boolean` | `false` | Mono value. |

## Accessibility

Renders a `<dl>` with `<dt>`/`<dd>` pairs, so screen readers announce each value with its key.
