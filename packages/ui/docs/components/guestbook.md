---
title: Guestbook
description: An old-web guestbook ledger with numbered entries, newest on top; a new signature lands with a change flash while the count rolls.
group: Gimmicks
order: 160
---

# Guestbook

The sign-the-guestbook page from a personal site, as a ledger. Every entry has its number (`#0042`), a name that can link to the visitor's homepage, where they signed from, and a date. The newest entry sits on top. When someone signs and your app adds their entry, it lands at the top of the ledger with a change flash while the signature count rolls up. Saving, spam checks, moderation and pagination stay in your app.

```tsx
import { Guestbook } from "@nils/ui";
import type { GuestbookEntry, GuestbookField, GuestbookProps, GuestbookSigned } from "@nils/ui";
```

## Examples

### Signing locally

`onSubmit` receives what the visitor signed with. Here the demo appends it to state; in a real site the handler posts to your endpoint and you pass back the saved entries. Sign it and watch the new entry land.

```tsx live
import { useState } from "react";
import { Guestbook, type GuestbookEntry } from "@nils/ui";

const initial: GuestbookEntry[] = [
  { id: "1", name: "Ada", location: "London", message: "The quiet grid is doing a lot of work here. Bookmarked.", createdAt: "2026-10-18T09:12:00Z", href: "https://example.com/ada" },
  { id: "2", name: "Anonymous", message: "Found you through the webring. Nice to meet you.", createdAt: "2026-10-21T17:40:00Z" },
  { id: "3", name: "Grace", location: "Arlington", message: "Signed with the keyboard only. Works.", createdAt: "2026-10-25T08:03:00Z" },
];

export default function Example() {
  const [entries, setEntries] = useState(initial);
  return (
    <Guestbook
      entries={entries}
      fields={["location", "homepage"]}
      note="Messages are reviewed before they appear."
      onSubmit={({ name, message, location, homepage }) => {
        setEntries((current) => [...current, { id: String(Date.now()), name, message, location, href: homepage, createdAt: new Date() }]);
      }}
    />
  );
}
```

### Waiting on storage

Return a promise to keep the button pending. The form clears only after it resolves, so a failed save never loses what was typed, and the entry lands only once your app adds it.

```tsx live
import { useState } from "react";
import { Guestbook, type GuestbookEntry } from "@nils/ui";

export default function Example() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  return (
    <Guestbook
      entries={entries}
      emptyMessage="Signatures appear here after they're saved."
      onSubmit={async ({ name, message }) => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        setEntries((current) => [...current, { id: String(Date.now()), name, message, createdAt: new Date() }]);
      }}
    />
  );
}
```

### A failed save

Throw from `onSubmit` and its message appears in an alert under the button. The draft stays in the fields.

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

- **Do** save the signature yourself and pass the resulting entries back in, oldest first. The widget never stores or fetches anything.
- **Do** pass `number` on each entry when you paginate or hide moderated entries, so numbers stay the ones visitors signed under.
- **Do** pass a stable `id` per entry. It keys the ledger and decides which entry is new.
- **Do** moderate on the server, and treat `homepage` as untrusted. Names link with `rel="ugc nofollow"`, but only you can keep spam out.
- **Do** set `maxLength` to the same limit your storage enforces.
- **Don't** add the new entry before the save resolves. A failed write would land a signature that doesn't exist.
- **Don't** ask for more than you'll show. `fields` adds a homepage and a place; leave them out if you won't display them.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` | `readonly GuestbookEntry[]` | Required | Signatures, oldest first. The ledger shows them newest first. |
| `onSubmit` | `(entry: GuestbookSigned) => void \| Promise<void>` | — | Receives each signature. The name is trimmed, or `"Anonymous"` when empty. Return a promise to show pending; throw an `Error` to show its message. |
| `fields` | `readonly ("homepage" \| "location")[]` | `[]` | Extra fields to ask for. Filled-in values arrive as `homepage` and `location`. |
| `heading` | `ReactNode` | `"Guestbook"` | Label at the top of the ledger. |
| `maxLength` | `number` | `280` | Message limit, applied to the field and shown in the counter. |
| `note` | `ReactNode` | — | Line under the form, e.g. how entries are reviewed. |
| `emptyMessage` | `ReactNode` | `"No signatures yet. Be the first."` | Shown in place of the ledger when `entries` is empty. |
| `locale` | `Intl.LocalesArgument` | Browser locale | Locale for the entry dates. |
| `className` | `string` | — | Layout classes on the panel. Full width up to 448px. |
| `...props` | `ComponentProps<"div">` | — | Standard panel props, including `ref`. Children are not accepted. |

### GuestbookEntry

| Prop | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable identity. |
| `name` | `string` | The name they signed with. |
| `message` | `string` | Rendered as text; line breaks are kept. |
| `createdAt` | `Date \| string \| number` | When it was signed. |
| `href` | `string` | Their homepage; links the name. Only `http:` and `https:` addresses become links; anything else shows the name as text. |
| `location` | `string` | Shown as "from Stockholm". |
| `number` | `number` | Ledger number. Defaults to the entry's position in `entries`, oldest being `#0001`. |

`GuestbookSigned` is `{ name: string; message: string; homepage?: string; location?: string }`.

## Motion

A new signature landing is the guestbook's signature move. When `entries` gains an id the ledger hasn't seen, after the first render, that entry appears at the top with the library's change flash: an `accent-tint` wash that fades over 1s without moving anything. At the same moment the signature count's changed digits roll up (`NumberRoll`, 180ms). Entries present on first render never flash. The flash and roll are skipped under `prefers-reduced-motion`; the entry and count still update.

## Accessibility

The form is named "Sign the guestbook", and every field has a visible label. The message is required and its validation message appears through `Field`. A failed save is an `alert`, so it's announced without moving focus, and the draft is kept. The ledger is an ordered list named "Guestbook entries, newest first"; dates are `<time>` elements. New entries aren't announced, because unmoderated text shouldn't be read out uninvited. Linked names have a visible underline, so they never depend on colour.
