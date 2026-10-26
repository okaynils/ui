---
title: FileDrop
description: A dashed drop zone with a file list: drag files in or browse, see names (middle-truncated) and sizes, remove, and get plain reasons for rejected files.
group: Controls
order: 160
---

# FileDrop

A place to put files. Drag them onto the zone or click it to browse. Chosen files are listed underneath with their size and a remove button; files that don't fit (`accept`, `maxSize`, `maxFiles`) are named with the reason.

The dashed edge is deliberate and unique: it's the old web's "put it here", and nothing else in the library uses a dashed line.

```tsx
import { FileDrop } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<div className="w-80">
  <Field label="Attachment">
    <FileDrop description="Any file, up to 10 MB." maxSize={10 * 1024 * 1024} />
  </Field>
</div>
```

### Several images

```tsx live
import { Field, FileDrop } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="w-96">
      <Field label="Screenshots" description={`${files.length} of 4`}>
        <FileDrop
          multiple
          accept="image/png,image/jpeg,.webp"
          maxSize={5 * 1024 * 1024}
          maxFiles={4}
          value={files}
          onValueChange={setFiles}
          description="PNG, JPG or WebP, up to 5 MB each."
        />
      </Field>
    </div>
  );
}
```

### In a form

The real file input stays in sync with the list, so a plain form submit sends exactly what's listed. `required` reports through `Field` like any input.

```tsx live
import { Button, Field, FileDrop, Form } from "@nils/ui";

export default function Example() {
  return (
    <Form className="flex w-80 flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
      <Field label="Dataset" name="dataset">
        <FileDrop name="dataset" accept=".csv,.parquet" required description="CSV or Parquet." />
      </Field>
      <Button type="submit" variant="primary" className="self-start">Upload</Button>
    </Form>
  );
}
```

## Rules

- **Do** say what's accepted in `description` ("PNG or JPG, up to 5 MB"). The checks enforce it, but people should know before they try.
- **Do** keep the list visible; people need to see what they're about to send.
- **Don't** upload on drop without a visible list and a way to remove — unless the whole screen is an uploader.
- **Don't** use a second dashed element on the same screen.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `accept` | `string` | — | `<input accept>` syntax: `"image/*,.pdf"`. Checked on drop too. |
| `multiple` | `boolean` | `false` | Keep several files. Without it, a new file replaces the old. |
| `maxSize` | `number` | — | Bytes per file. |
| `maxFiles` | `number` | — | Most files kept (with `multiple`). |
| `value` / `defaultValue` | `File[]` | `[]` | The chosen files. |
| `onValueChange` | `(files: File[]) => void` | — | Called when files are added or removed. |
| `onReject` | `(rejections: { file, reason }[]) => void` | — | Files turned away, with a plain reason. |
| `title` | `ReactNode` | "Drop files here or browse" | Main line. |
| `description` | `ReactNode` | — | Small line under it. |
| `name` / `required` / `disabled` | — | — | As on any input. |
| `className` | `string` | — | Layout only. |

`formatBytes(bytes)` is exported ("1.5 KB", "12 MB").

## Accessibility

- A real (visually hidden) `<input type="file">` holds focus; Enter or Space opens the system picker, and the zone shows the focus ring.
- Each listed file has a "Remove {name}" button. Rejections are announced through a polite live region.
- Long names are truncated in the middle so the extension stays visible; the full name is in the tooltip (`title`).

## Motion

On drag-over the edge and icon turn accent and the zone fills with `accent-tint` (120ms). Nothing moves.
