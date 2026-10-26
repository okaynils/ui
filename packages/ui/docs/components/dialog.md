---
title: Dialog
description: A modal panel over a scrim, for focused tasks that need an answer before going back to the page.
group: Overlays
order: 40
---

# Dialog

A modal panel, centred over a dimmed page. Use it for a short, focused task: a small form, a choice, a detail view that you'd otherwise navigate away for. It traps focus, locks scroll, and closes on Esc, the ×, or a click on the scrim.

To ask "are you sure?" before something destructive, use [ConfirmDialog](/components/confirm-dialog) instead.

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@nils/ui";
```

## Examples

### Basic

Title, a sentence of description, content, and a footer with the actions. The primary action goes last.

```tsx live
<Dialog>
  <DialogTrigger render={<Button />}>Rename project</DialogTrigger>
  <DialogContent>
    <DialogTitle>Rename project</DialogTitle>
    <DialogDescription>The URL changes too. Old links redirect for 30 days.</DialogDescription>
    <Field label="Name" className="mt-4">
      <Input defaultValue="turbine-core" />
    </Field>
    <DialogFooter>
      <DialogClose render={<Button />}>Cancel</DialogClose>
      <DialogClose render={<Button variant="primary" />}>Rename</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Controlled

Control `open` when the dialog opens from somewhere other than a trigger (a menu item, a keyboard shortcut) or must close after async work.

```tsx live
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 1000);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open settings</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogTitle>Project settings</DialogTitle>
          <DialogDescription>Changes apply to every environment.</DialogDescription>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={save}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Sizes

`size="sm"` (380px) for confirmations and one-field forms, `md` (480px, default) for most things, `lg` (640px) for content that needs room.

```tsx live
<Dialog>
  <DialogTrigger render={<Button />}>Large dialog</DialogTrigger>
  <DialogContent size="lg">
    <DialogTitle>Deployment log</DialogTitle>
    <DialogDescription>Build 2041 · main · 3m 12s</DialogDescription>
    <pre className="mt-4 max-h-60 overflow-auto rounded-ui bg-panel p-3 font-mono text-xs leading-5 text-ink-2">
{`12:01:04  cloning repository
12:01:06  installing dependencies (bun 1.1.29)
12:02:41  building packages/ui
12:03:58  building apps/docs
12:04:16  deployed → https://ui.example.dev`}
    </pre>
    <DialogFooter>
      <DialogClose render={<Button />}>Close</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Rules

- **Do** always include a `DialogTitle`. It names the dialog for screen readers.
- **Do** put actions in `DialogFooter`, primary last, labelled with what they do ("Rename", not "OK").
- **Do** keep it to one task. If it needs scrolling sections or tabs, it should be a page.
- **Don't** open a dialog on page load or without a user action.
- **Don't** stack dialogs. Close one before opening the next.
- **Don't** use a dialog for a message that needs no decision. That's a `toast`.

## Props

`Dialog` accepts Base UI [Dialog.Root](https://base-ui.com/react/components/dialog) props: `open`, `defaultOpen`, `onOpenChange`, `modal`, `disablePointerDismissal`. `DialogTrigger` and `DialogClose` accept `render` and native button attributes.

### DialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Max width 380 / 480 / 640px. |
| `showClose` | `boolean` | `true` | The × button top-right. |
| `initialFocus` | `RefObject \| boolean \| fn` | first focusable | Where focus lands on open. |
| `className` | `string` | — | Layout only. |

`DialogTitle`, `DialogDescription` and `DialogFooter` take their element's usual props. `DialogFooter` bleeds to the panel's edges and must be the last child.

## Motion

The scrim fades and the panel settles from 97%: 180ms in, 120ms out, `ease-snap`. Nothing slides.

## Accessibility

- `role="dialog"`, `aria-modal`, labelled by `DialogTitle` and described by `DialogDescription`.
- Focus is trapped inside while open and returns to the trigger on close.
- Esc closes. The × button is there for touch screen readers, which can't press Esc.
