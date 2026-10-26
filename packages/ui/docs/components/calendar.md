---
title: Calendar
description: A month grid for picking a day or a range, built on Intl with no date library. Full keyboard support; today in accent, selection in ink.
group: Controls
order: 130
---

# Calendar

A month grid for picking one day or a range. It works on plain `Date`s (local midnight), formats with `Intl`, and needs no date library. Use it inline in a panel or a popover; for a form field, use `DatePicker`, which wraps it.

Today is marked in accent with a small dot (it's "you are here"). The selected day is solid ink, so the accent stays free for the view's one primary action.

```tsx
import { Calendar } from "@nils/ui";
```

## Examples

### Single day

```tsx live
import { Calendar } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar value={date} onValueChange={setDate} />
      <p className="font-mono text-xs text-ink-2">{date ? date.toDateString() : "No date"}</p>
    </div>
  );
}
```

### Range

The first click sets the start, the second the end. While choosing the end, the span follows the pointer.

```tsx live
import { Calendar } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [range, setRange] = useState({ from: null, to: null });
  const fmt = (d) => (d ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "…");
  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar mode="range" value={range} onValueChange={setRange} />
      <p className="font-mono text-xs text-ink-2">{fmt(range.from)} → {fmt(range.to)}</p>
    </div>
  );
}
```

### Limits and disabled days

`min`, `max` and `isDateDisabled` dim days and refuse them. The keyboard can still walk across them.

```tsx live
<Calendar
  min={new Date()}
  isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
/>
```

### Week start and locale

`weekStartsOn` (0 = Sunday … 6) and `locale` follow the people using it.

```tsx live
<div className="flex flex-wrap justify-center gap-6">
  <Calendar weekStartsOn={0} locale="en-US" />
  <Calendar weekStartsOn={1} locale="sv-SE" />
</div>
```

## Rules

- **Do** use `DatePicker` in forms; use `Calendar` directly when the grid itself is the interface (a booking panel, a schedule sidebar).
- **Do** set `weekStartsOn` to match your audience. Monday is the default.
- **Don't** colour days for meaning (busy, booked). Disable them, or put that information next to the calendar.
- **Don't** animate month changes. The grid switches instantly: you're scanning, not travelling, and a slide would only delay the next click.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `"single" \| "range"` | `"single"` | One day, or a `{ from, to }` range. |
| `value` / `defaultValue` | `Date \| null` / `DateRange` | — | Selection, controlled or not. |
| `onValueChange` | `(value) => void` | — | Called with the new day or range. In range mode `to` is `null` after the first click. |
| `month` / `defaultMonth` | `Date` | selected or today | The month shown (any day in it). |
| `onMonthChange` | `(month: Date) => void` | — | Called with the 1st of the new month. |
| `weekStartsOn` | `0 … 6` | `1` | First weekday column. |
| `locale` | `string` | browser | Month and weekday names. |
| `min` / `max` | `Date` | — | Selectable bounds. |
| `isDateDisabled` | `(date: Date) => boolean` | — | Disable specific days. |
| `autoFocus` | `boolean` | `false` | Focus the selected day (or today) on mount. |
| `className` | `string` | — | Layout only. |

## Accessibility

- `role="grid"` with rows and `gridcell`s; each day is a button labelled with its full date ("Monday, 26 October 2026"), today has `aria-current="date"`, selected days `aria-pressed`.
- One Tab stop for the whole grid. Arrows move by day and week, Page Up/Down by month, ⇧ + Page Up/Down by year, Home/End to the edges of the week, Enter/Space selects.
- The month title is a polite live region, so changing months is announced.
