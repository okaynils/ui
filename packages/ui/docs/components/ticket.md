---
title: Ticket
description: An event ticket with a perforated stub and a real Code 128 barcode; drag or press the stub to tear it off.
group: Gimmicks
order: 200
---

# Ticket

A ticket for an event, a beta invite or a launch: the details on the left, and a perforated stub on the right carrying the ticket code as a real, scannable Code 128 barcode. Visitors can tear the stub off, either by dragging it away or by pressing it. Use the torn state for "checked in", "redeemed" or "used".

```tsx
import { Ticket } from "@nils/ui";
import type { TicketDetail, TicketProps } from "@nils/ui";
```

## Examples

### An event ticket

Drag the stub to the right, or press it, to tear it off.

```tsx live
<Ticket
  title="nils/ui launch night"
  subtitle="Södermalm, Stockholm"
  details={[
    { label: "Date", value: "1 Nov 2026" },
    { label: "Doors", value: "18:00" },
    { label: "Seat", value: "GA" },
  ]}
  code="NUI-0042"
/>
```

### Checking in

Use `onTear` to record the check-in in your app. Paired with a `Stamp`, the ticket clearly reads as used.

```tsx live
import { useState } from "react";
import { Stamp, Ticket } from "@nils/ui";

export default function Example() {
  const [used, setUsed] = useState(false);
  return (
    <div className="relative w-full max-w-md">
      <Ticket
        eyebrow="Beta invite"
        title="Early access"
        subtitle="One seat, for you"
        details={[{ label: "Valid until", value: "31 Dec 2026" }]}
        code="BETA-7F3K"
        onTear={() => setUsed(true)}
      />
      {used ? <Stamp tone="ok" className="absolute top-5 right-36">Redeemed</Stamp> : null}
    </div>
  );
}
```

### Already used, not tearable

`defaultTorn` (or a controlled `torn`) shows a ticket that was already used. `tearable={false}` keeps the stub attached and static, for tickets that are only shown.

```tsx live
<div className="flex w-full max-w-md flex-col gap-4">
  <Ticket title="Spring meetup" details={[{ label: "Date", value: "12 Apr 2026" }]} code="MEET-0007" defaultTorn />
  <Ticket title="Workshop pass" details={[{ label: "Tier", value: "Full day" }]} code="WS-1138" tearable={false} />
</div>
```

## Rules

- **Do** keep `code` short and printable ASCII. It's both the text on the stub and the barcode; anything else hides the barcode and keeps the text.
- **Do** record tearing in your app via `onTear`. The widget only remembers it until the page reloads.
- **Do** keep `details` to four or fewer. A ticket is read at a glance.
- **Don't** rely on the barcode for security. It encodes exactly the code you pass; validate tickets on your server.
- **Don't** make a ticket tearable if nothing happens when it's torn. Use `tearable={false}` for display-only tickets.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | The event or thing the ticket is for. |
| `subtitle` | `ReactNode` | — | A line under the title, e.g. the venue. |
| `eyebrow` | `ReactNode` | `"Admit one"` | Small label above the title. |
| `details` | `readonly TicketDetail[]` | — | Label/value columns along the bottom. |
| `code` | `string` | Required | Ticket code, printed on the stub and encoded as Code 128 (set B). |
| `tearable` | `boolean` | `true` | Allow tearing by drag or press. |
| `torn` | `boolean` | — | Controlled torn state. |
| `defaultTorn` | `boolean` | `false` | Initial torn state when uncontrolled. |
| `onTear` | `() => void` | — | Called when the visitor tears the stub. |
| `className` | `string` | — | Layout classes. Full width up to 448px. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes, including `ref`. |

`TicketDetail` is `{ label: ReactNode; value: ReactNode }`.

## Motion

Tearing is the ticket's signature move. While you drag, the stub follows the pointer one-to-one and pivots from its bottom corner, like paper that's still attached at one end. Let go past 40px and it tears: the stub comes to rest 14px away, tilted. Let go sooner and it settles back (200ms, `ease-snap`). Pressing the stub tears it in one step. Under `prefers-reduced-motion` the stub moves without transitions.

## Accessibility

While tearable, the stub is a button named "Tear off stub NUI-0042", reachable by keyboard and activated with Enter or Space. Tearing announces "Stub torn off." through a status region. The barcode is decorative for assistive technology because the same code is printed as text. In dark mode the barcode is light on dark; most phone scanners read inverted codes, but door scanners may not, so show tickets for scanning in the light theme.
