---
title: ActivityCalendar
description: A year of daily activity as a neutral contribution-style grid, with keyboard navigation and date details.
group: Gimmicks
order: 40
---

# ActivityCalendar

A year of daily counts: contributions, workouts, reading or any activity with a date. Weeks run down each column, with month and weekday labels around the grid. Four neutral intensity levels encode the amount, while an empty cell means zero. The app supplies the data; this component does not connect to GitHub or another service.

```tsx
import { ActivityCalendar } from "@nils/ui";
import type { ActivityCalendarDay, ActivityCalendarProps } from "@nils/ui";
```

## Examples

### A year of contributions

The date strings represent calendar days, not timestamps. Missing dates are zero. Hover, tap or focus a cell for its exact date and amount.

```tsx live
import { ActivityCalendar } from "@nils/ui";

const days = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.UTC(2025, 0, i + 1)).toISOString().slice(0, 10),
  count: i % 7 === 0 || i % 11 === 0 ? 0 : (i * 7 + 3) % 13,
}));

export default function Example() {
  return <ActivityCalendar year={2025} days={days} label="Contributions" className="max-w-full" />;
}
```

### Different units and a stable scale

Set `maxCount` when comparing several calendars: the same shade then represents the same amount. Counts above that value use the darkest cell. A custom count label changes the day details and the annual total.

```tsx live
<ActivityCalendar
  year={2024}
  weekStartsOn={0}
  label="Distance walked"
  maxCount={12}
  formatCount={(count) => `${count.toLocaleString("en-GB")} km`}
  days={[
    { date: "2024-02-28", count: 4 },
    { date: "2024-02-29", count: 8 },
    { date: "2024-03-01", count: 12 },
    { date: "2024-03-02", count: 6 },
  ]}
/>
```

### Open a day's detail

The calendar has one tab stop. Arrow keys move through days; Enter or Space activates the focused day when `onDayClick` is supplied. Without a callback, activating a cell still shows its detail, which also works on touch screens.

```tsx live
import { ActivityCalendar, Code } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="w-full space-y-3">
      <ActivityCalendar
        year={2025}
        label="Reading sessions"
        days={[
          { date: "2025-01-01", count: 2 },
          { date: "2025-01-02", count: 1 },
          { date: "2025-01-03", count: 3 },
        ]}
        onDayClick={(day) => setSelected(day.date)}
      />
      <p className="text-xs text-ink-2">{selected ? <>Selected <Code>{selected}</Code></> : "Select a day to open its record."}</p>
    </div>
  );
}
```

## Rules

- **Do** pass an explicit `year` and `YYYY-MM-DD` dates. Aggregate timestamps into your intended calendar days before passing them.
- **Do** update `days` immutably. Duplicate dates are summed; invalid dates, dates outside the year, negative counts and non-finite counts are ignored.
- **Do** use `maxCount` consistently when comparing calendars. Without it, the darkest shade means the largest daily count in this year.
- **Do** give the activity a meaningful `label` and use `formatCount` for units such as kilometres or minutes.
- **Don't** interpret a missing date as unknown. Missing means zero; load the complete data before displaying the calendar.
- **Don't** use status colours for intensity. Darker neutral cells encode quantity, not success, failure or availability.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `year` | `number` | — | Required integer from 1 to 9999. Invalid years show an unavailable message. |
| `days` | `readonly ActivityCalendarDay[]` | — | Required `{ date: string, count: number }` entries. Dates are calendar days in UTC. An empty array shows a year of zeros. |
| `label` | `string` | `"Activity"` | Heading and accessible name. |
| `weekStartsOn` | `0 \| 1` | `1` | Sunday or Monday. |
| `maxCount` | `number` | year's maximum, at least 1 | Positive finite maximum for four equal intensity bands. Invalid values use the automatic maximum. |
| `locale` | `string` | `"en-GB"` | Locale for month names, full dates and default number formatting. |
| `formatCount` | `(count: number) => string` | activity / activities | Formats the daily amount and annual total. |
| `onDayClick` | `(day: ActivityCalendarDay) => void` | — | Receives the selected date and its aggregated count, including zero days. |
| `className` | `string` | — | Layout classes for the outer wrapper. The calendar scrolls horizontally inside its own bounds. |
| `...props` | `ComponentProps<"div">` | — | Forwarded to the outer wrapper. |

## Motion

Cells and keyboard focus update instantly. Day tooltips use the library's fast tooltip transition. There is no ambient animation.

## Accessibility

- Each cell is named with its full date and amount. Exact values are available independently of shade.
- Tab enters the calendar once. Left / Right move a week, Up / Down a day, Home / End to the week's edges, and Ctrl/⌘ + Home / End to the year's edges. Tab then leaves the calendar.
- A tooltip opens on hover or focus; a persistent line below the grid shows the inspected day for touch users too.
- Horizontal scrolling stays inside the widget. Focused cells scroll into view as the keyboard moves through them.
- All date parsing, alignment and formatting use UTC, so a viewer's timezone cannot move an entry into a different day.
