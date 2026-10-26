---
title: Toast
description: Short notices that confirm something happened, bottom-right, with an optional status, detail, and one action. Call toast() from anywhere.
group: Overlays
order: 70
---

# Toast

A short notice in the bottom-right corner that confirms something happened ("Saved", "Copied", "Deployed") and goes away on its own. Call `toast()` from anywhere, including event handlers, async functions, and code outside React, as long as one `<Toaster />` is mounted.

```tsx
import { Toaster, toast } from "@nils/ui";
```

## Setup

Mount one `Toaster` near the root of the app, once:

```tsx
import { Toaster } from "@nils/ui";

export function App() {
  return (
    <>
      <Routes />
      <Toaster />
    </>
  );
}
```

If two get mounted by mistake, only the first renders, so toasts never show twice.

## Examples

### Plain

Most toasts are just a title.

```tsx live
<Button onClick={() => toast("Link copied")}>Copy link</Button>
```

### Status

`toast.success`, `toast.error` and `toast.warning` add a coloured dot before the title. The dot carries the colour; the words stay ink.

```tsx live
<Button onClick={() => toast.success("Deployed", { description: "v0.4.2 is live on production." })}>Success</Button>
<Button onClick={() => toast.error("Couldn't save", { description: "The file is read-only." })}>Error</Button>
<Button onClick={() => toast.warning("Usage at 90%", { description: "Builds pause at 1,000 minutes." })}>Warning</Button>
```

### With an action

One action at most, usually "Undo". This is the alternative to asking "are you sure?" first.

```tsx live
<Button
  onClick={() =>
    toast("Project archived", {
      action: { label: "Undo", onClick: () => toast("Restored") },
    })
  }
>
  Archive
</Button>
```

### Following a promise

`toast.promise` shows one toast that goes from loading to success or error.

```tsx live
import { Button, toast } from "@nils/ui";

const deploy = () =>
  new Promise((resolve, reject) => setTimeout(() => (Math.random() > 0.3 ? resolve("v0.4.3") : reject(new Error("timeout"))), 1500));

export default function Example() {
  return (
    <Button
      variant="primary"
      onClick={() =>
        toast.promise(deploy(), {
          loading: "Deploying…",
          success: (version) => `Deployed ${version}`,
          error: "Deploy failed",
        })
      }
    >
      Deploy
    </Button>
  );
}
```

## Rules

- **Do** confirm the result in a few words, past tense: "Saved", "Invite sent", "3 files deleted".
- **Do** say what went wrong and what to do in error descriptions: "The file is read-only."
- **Do** offer "Undo" instead of a confirmation dialog for reversible actions.
- **Don't** toast things the user can already see happening on screen.
- **Don't** put anything essential only in a toast. It disappears, and screen magnifier users may never see it.
- **Don't** use more than one action, or links to elsewhere, inside a toast.

## API

### `toast(title, options?)`

Returns the toast's id. Variants: `toast.success`, `toast.error`, `toast.warning`. Also `toast.dismiss(id)` and `toast.promise(promise, { loading, success, error })`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `description` | `ReactNode` | — | A second line with detail. |
| `action` | `{ label: string; onClick: () => void }` | — | One button, e.g. Undo. |
| `timeout` | `number` | `5000` | Auto-dismiss after ms. `0` keeps it until dismissed. |
| `id` | `string` | — | Reuse an id to update a toast in place. |
| `priority` | `"low" \| "high"` | `"low"` (`"high"` for errors) | How urgently screen readers announce it. |

### `<Toaster />`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `limit` | `number` | `3` | Most toasts visible at once; older ones fade out. |
| `timeout` | `number` | `5000` | Default auto-dismiss, in ms. |

## Motion

A toast rises 8px and fades in over 200ms and leaves in 150ms. Toasts stack behind each other, 8px apart; hover the stack to fan it out. Swipe down or right to dismiss.

## Accessibility

- Toasts are announced by screen readers: politely by default, urgently for errors.
- F6 moves focus into the toast region; Tab reaches the action and the dismiss button.
- The timer pauses while the stack is hovered or focused.
