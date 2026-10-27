---
title: Timeline
description: A vertical activity or audit log with mono times, a hairline spine, optional day headers, and a flash on entries that arrive while you watch.
group: Data
order: 100
---

# Timeline

A history of what happened, newest or oldest first: deploys, sign-ins, edits, incidents. Each entry has a mono time, a dot on a hairline spine, and a line saying what happened, optionally with who did it and some detail. Group entries under day headers for longer logs. Entries that arrive after the first render flash once, the same change flash `DataTable` uses, so a live log shows what's new without moving anything.

```tsx
import { Timeline } from "@nils/ui";
import type { TimelineEntry, TimelineProps } from "@nils/ui";
```

## Examples

### An audit log

`actor` comes first and is emphasised, so phrase `title` as the rest of the sentence. `tone` colours the dot; the title still says what happened.

```tsx live
<Timeline
  entries={[
    { id: "4", time: "2026-10-27T09:42:00Z", actor: "nils", title: "deployed api-gateway v2.14.0", tone: "ok", detail: <code className="font-mono">a1b2c3d</code> },
    { id: "3", time: "2026-10-27T09:31:00Z", actor: "ci", title: "build failed on main", tone: "err", detail: "3 tests failed in auth/session.test.ts" },
    { id: "2", time: "2026-10-27T08:05:00Z", actor: "ana", title: "rotated the production API key" },
    { id: "1", time: "2026-10-26T17:20:00Z", actor: "nils", title: "invited ana@example.com" },
  ]}
/>
```

### Grouped by day, live

With `groupByDay`, a header appears whenever the date changes and times show as `14:02`. Press **New event**: the new entry is added at the top and flashes once.

```tsx live
import { useState } from "react";
import { Button, Timeline } from "@nils/ui";
import type { TimelineEntry } from "@nils/ui";

const START: TimelineEntry[] = [
  { id: "c", time: "2026-10-27T08:12:00Z", title: "Backup completed", tone: "ok" },
  { id: "b", time: "2026-10-26T22:40:00Z", title: "Disk usage above 80%", tone: "warn", detail: "db-1 /var/lib/postgres" },
  { id: "a", time: "2026-10-26T09:00:00Z", title: "Maintenance window ended" },
];

export default function Example() {
  const [entries, setEntries] = useState(START);
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4">
      <Button size="sm" onClick={() => setEntries((current) => [
        { id: String(Date.now()), time: Date.now(), title: "Health check passed", tone: "ok" },
        ...current,
      ])}>New event</Button>
      <Timeline entries={entries} groupByDay timeZone="Europe/Stockholm" />
    </div>
  );
}
```

### Relative times

`timeFormat="relative"` shows "3m ago" and refreshes every minute. Hover a time for the full date. Until the page has mounted it shows absolute times, so server and browser render the same thing.

```tsx live
<Timeline
  timeFormat="relative"
  entries={[
    { id: "2", time: Date.now() - 4 * 60_000, actor: "ana", title: "commented on PR #212" },
    { id: "1", time: Date.now() - 3 * 3_600_000, actor: "nils", title: "opened PR #212" },
  ]}
/>
```

## Rules

- **Do** give every entry a stable `id`. The flash, and React, depend on it.
- **Do** sort entries yourself, newest first for activity feeds and oldest first for a story. The timeline keeps the order you give it.
- **Do** pass `timeZone` for the people reading the log. It defaults to UTC so server and browser agree.
- **Do** make the title say the outcome ("build failed"), and use `tone` only to reinforce it.
- **Don't** use a timeline for a fixed sequence of stages. That's `Steps`.
- **Don't** put actions in every entry. If people act on rows, use a `DataTable`.

## Props

### Timeline

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` | `readonly TimelineEntry[]` | Required | Entries in display order. |
| `groupByDay` | `boolean` | `false` | Insert a day header (`ui-label`) whenever the date changes. |
| `timeFormat` | `"time" \| "datetime" \| "relative"` | `"time"` when grouped, else `"datetime"` | `14:02`, `27 Oct 14:02` or `3m ago`. In grouped relative mode, times stay absolute because the header already gives the day. |
| `timeZone` | `string` | `"UTC"` | IANA zone for times and day boundaries. |
| `locale` | `string` | `"en-GB"` | Formatting locale. |
| `flash` | `boolean` | `true` | Flash entries whose ids weren't there on the previous render. Never on first render. |
| `empty` | `ReactNode` | `"No activity yet."` | Shown when `entries` is empty. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes, including `ref`. |

### TimelineEntry

| Prop | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable identity. |
| `time` | `Date \| string \| number` | When it happened. Invalid values show `—`. |
| `title` | `ReactNode` | What happened. |
| `actor` | `ReactNode` | Who did it, shown first in medium weight. |
| `detail` | `ReactNode` | A second line in `text-xs`: a hash, an error, a path. |
| `tone` | `"ok" \| "warn" \| "err" \| "accent" \| "neutral"` | Dot colour on the spine. Defaults to neutral. |

## Motion

New entries get the library's change flash: an `accent-tint` wash that fades out over 1s. It marks what arrived without moving layout, and it never plays on first render. Relative times update once a minute with no animation. Under `prefers-reduced-motion` the flash is skipped.

## Accessibility

Each day is a `section` named by its header, containing an ordered list. Times are `<time>` elements with a machine-readable `dateTime` and the full date in a tooltip. The spine and dots are decorative; the outcome is always in the title text. New entries aren't announced; if an event needs attention, also raise a toast.
