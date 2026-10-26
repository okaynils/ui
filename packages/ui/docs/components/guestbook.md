---
title: Guestbook
description: A message form and a list of supplied entries, with pending and error states; storage and moderation stay in your app.
group: Gimmicks
order: 160
---

# Guestbook

The sign-the-guestbook form from a personal site, without the backend. The widget renders the form and the entries you pass, reports what was signed, and shows pending and failure states. Saving, spam checks, moderation and pagination are yours.

```tsx
import { Guestbook } from "@nils/ui";
```

## Examples

### Appending a message locally

`onSubmit` receives the trimmed name and message. Here the demo keeps entries in state; in a real site the handler posts to your endpoint and revalidates the list.

```tsx live
import { useState } from "react";
import { Guestbook, type GuestbookEntry } from "@nils/ui";

const initial: GuestbookEntry[] = [
  { id: "1", name: "Ada", message: "The quiet grid is doing a lot of work here. Bookmarked.", createdAt: "2026-10-18T09:12:00Z", href: "https://example.com/ada" },
  { id: "2", name: "Anonymous", message: "Found you through the webring. Nice to meet you.", createdAt: "2026-10-21T17:40:00Z" },
];

export default function Example() {
  const [entries, setEntries] = useState(initial);
  return (
    <Guestbook
      entries={entries}
      note="Messages are reviewed before they appear."
      onSubmit={({ name, message }) => {
        setEntries((current) => [...current, { id: String(Date.now()), name, message, createdAt: new Date() }]);
      }}
    />
  );
}
```

### Waiting on storage

Return a promise to keep the button pending and the fields locked. Clearing happens only after it resolves, so a failed save never loses what was typed.

```tsx live
import { useState } from "react";
import { Guestbook } from "@nils/ui";

export default function Example() {
  const [entries, setEntries] = useState<Array<{ id: string; name: string; message: string; createdAt: Date }>>([]);
  return (
    <Guestbook
      entries={entries}
      emptyMessage="Messages appear here after they are saved."
      onSubmit={async ({ name, message }) => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        setEntries((current) => [...current, { id: String(Date.now()), name, message, createdAt: new Date() }]);
      }}
    />
  );
}
```

### A failed save

Throw from `onSubmit` — with an `Error`, or any value — and its message appears above the button in an alert. The draft stays in the fields.

```tsx live
import { Guestbook } from "@nils/ui";

export default function Example() {
  return (
    <Guestbook
      entries={[]}
      note="This example deliberately fails so you can see the error state."
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        throw new Error("The guestbook is read-only right now. Try again later.");
      }}
    />
  );
}
```

## Rules

- **Do** save the message yourself and pass the resulting entries back in. The widget never stores or fetches anything.
- **Do** return a promise from `onSubmit` when saving is asynchronous; the form stays pending until it settles, then clears.
- **Do** moderate on the server. Rendering a message as text stops markup injection, not spam.
- **Do** set `maxLength` to the same limit your storage enforces, so the counter never promises more room than the server accepts.
- **Do** pass a stable `id` per entry. It keys the list while entries change.
- **Don't** append the new entry before the save resolves — a failed write would show a message that does not exist.
- **Don't** put unmoderated messages in a live region; new entries appear quietly when you update `entries`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` | `readonly GuestbookEntry[]` | Required | Messages to show, oldest first. Each needs `id`, `name`, `message` and `createdAt`; `href` links the name. |
| `onSubmit` | `(entry: { name: string; message: string }) => void \| Promise<void>` | — | Receives each signed message. The name is trimmed, or `"Anonymous"` when empty. Return a promise to show pending; throw an `Error` to show its message. |
| `heading` | `ReactNode` | `"Guestbook"` | Label in the header row. |
| `maxLength` | `number` | `280` | Message limit, applied to the field and shown in the counter. |
| `note` | `ReactNode` | — | Line under the form, e.g. how entries are reviewed. |
| `emptyMessage` | `ReactNode` | `"No messages yet. Be the first to sign."` | Shown in place of the list when `entries` is empty. |
| `locale` | `Intl.LocalesArgument` | Browser locale | Locale for the entry dates. |
| `className` | `string` | — | Layout classes on the panel. |
| `...props` | `ComponentProps<"div">` | — | Standard panel props, including `ref`. Children are not accepted. |

Exports `GuestbookProps`, `GuestbookEntry` and `GuestbookSigned` types.

## Accessibility

Both fields have visible labels, and the name field says that it may be left empty. The message is required, and the validation message appears through `Field`, next to the field rather than in a browser bubble. A failed save is an `alert`, so it is announced without moving focus; the draft is preserved. Dates are `<time>` elements with a machine-readable `dateTime`. Submitted names link with a visible underline so they never depend on colour alone.

## Motion

Only the button's spinner while a save is pending. Entries are inserted without an entrance animation — a guestbook should not make a person wait to read a message.
