---
title: ConfirmDialog
description: Asks "are you sure?" before a consequential action. One component, async-aware, can't be dismissed by accident.
group: Overlays
order: 50
---

# ConfirmDialog

A ready-made confirmation. Use it before anything that's hard to undo: deleting, revoking, publishing, sending. It's one component rather than a set of parts, so there's nothing to assemble wrong.

It's built on an alert dialog: clicking the scrim does nothing, and focus starts on **Cancel** so a stray Enter never confirms.

```tsx
import { ConfirmDialog } from "@nils/ui";
```

## Examples

### Destructive

Ask a question in the title, say plainly what will happen in the description, and repeat the verb on the button.

```tsx live
<ConfirmDialog
  trigger={<Button variant="danger">Delete project</Button>}
  title="Delete turbine-core?"
  description="Its 14 deployments and all environment variables go with it. This can't be undone."
  confirmLabel="Delete project"
  variant="danger"
  onConfirm={() => {}}
/>
```

### Async

Return a promise from `onConfirm`. The confirm button spins until it settles; on success the dialog closes, on failure it stays open so the user can retry or cancel. Report the error yourself, e.g. with a `toast`.

```tsx live
import { Button, ConfirmDialog, toast } from "@nils/ui";

const revoke = () => new Promise((resolve) => setTimeout(resolve, 1200));

export default function Example() {
  return (
    <ConfirmDialog
      trigger={<Button>Revoke token</Button>}
      title="Revoke this token?"
      description="Anything using it stops working immediately."
      confirmLabel="Revoke token"
      variant="danger"
      onConfirm={async () => {
        await revoke();
        toast.success("Token revoked");
      }}
    />
  );
}
```

### Controlled

Without a `trigger`, control it with `open` and `onOpenChange`, for example to confirm from a menu item.

```tsx live
import { Button, ConfirmDialog, Menu, MenuContent, MenuItem, MenuTrigger } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button />}>Release</MenuTrigger>
        <MenuContent>
          <MenuItem>View changelog</MenuItem>
          <MenuItem onClick={() => setConfirming(true)}>Publish v0.2.0…</MenuItem>
        </MenuContent>
      </Menu>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Publish v0.2.0?"
        description="It goes to the registry and can't be unpublished after 72 hours."
        confirmLabel="Publish"
        onConfirm={() => {}}
      />
    </>
  );
}
```

## Rules

- **Do** write the title as a question naming the thing: "Delete turbine-core?", not "Are you sure?".
- **Do** use the description to say what is lost or what happens next, in one or two sentences.
- **Do** make `confirmLabel` the same verb as the action ("Delete project"), never "OK" or "Yes".
- **Do** use `variant="danger"` only when something is destroyed or revoked.
- **Don't** confirm things that are easy to undo. Do them, then offer "Undo" in a `toast`.
- **Don't** put a form in it. For anything beyond yes/no, use a `Dialog`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Required. A question. |
| `description` | `ReactNode` | — | What happens, plainly. |
| `onConfirm` | `() => void \| Promise<unknown>` | — | Required. Return a promise for async work. |
| `trigger` | `ReactElement` | — | Opens the dialog, e.g. a `Button`. Omit when controlling `open`. |
| `confirmLabel` | `string` | `"Confirm"` | Set it. A verb. |
| `cancelLabel` | `string` | `"Cancel"` | |
| `variant` | `"primary" \| "danger"` | `"primary"` | Style of the confirm button. |
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on open and close. |

## Motion

Same as [Dialog](/components/dialog): the scrim fades and the panel settles from 97%, 180ms in and 120ms out.

## Accessibility

- `role="alertdialog"`, labelled by the title and described by the description.
- Focus starts on Cancel. Esc cancels. Clicking the scrim does nothing.
- While `onConfirm` is pending, the dialog can't be closed and the confirm button has `aria-busy`.
