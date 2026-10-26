---
title: UptimeStrip
description: Daily service health as compact status marks, with exact incident details and an optional independently measured uptime percentage.
group: Gimmicks
order: 90
---

# UptimeStrip

A small service-health history for a project page or dashboard. Each mark is a supplied daily report; focus, hover or tap one to read its date, state and incident detail. The app supplies monitoring data. A day marked “outage” does not say how long an outage lasted, so the component never calculates an uptime percentage from day statuses.

```tsx
import { UptimeStrip } from "@nils/ui";
```

## Examples

### A month of reports

The percentage below is separate demo measurement data. It is not calculated from the coloured days. Colours encode service health only in the small chart marks; labels and incident text remain in ink.

```tsx live
import { UptimeStrip } from "@nils/ui";

const days = Array.from({ length: 30 }, (_, index) => ({
  date: `2026-10-${String(index + 1).padStart(2, "0")}`,
  status: index === 8 ? "outage" as const : index === 17 ? "degraded" as const : "operational" as const,
  incident: index === 8 ? "Requests failed for four minutes during a database restart." : index === 17 ? "Elevated latency for twelve minutes. Resolved." : undefined,
}));

export default function Example() {
  return <UptimeStrip label="API" days={days} uptime={99.96} />;
}
```

### Missing observations

Unknown is a real state. Include an explicit unknown entry for a missing day's observation when the day should occupy space in the strip. No missing days are invented, and unknown days are counted separately from reported days.

```tsx live
<UptimeStrip
  label="Personal project"
  days={[
    { date: "2026-10-01", status: "unknown" },
    { date: "2026-10-02", status: "unknown", incident: "Monitoring was not configured yet." },
    { date: "2026-10-03", status: "operational" },
    { date: "2026-10-04", status: "degraded", incident: "Some image requests timed out." },
    { date: "2026-10-05", status: "operational" },
  ]}
/>
```

### Open a report

Each day is a button. A click, tap, Enter or Space can also run an app action. The built-in detail below the strip remains available without a callback.

```tsx live
import { UptimeStrip } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="w-full space-y-3">
      <UptimeStrip
        label="Build service"
        days={[
          { date: "2026-10-24", status: "operational" },
          { date: "2026-10-25", status: "outage", incident: "Build queue stopped accepting jobs. Recovered at 10:42 UTC." },
          { date: "2026-10-26", status: "operational" },
        ]}
        onDaySelect={(day) => setSelected(day.date)}
      />
      <p className="font-mono text-xs text-ink-2">{selected ? `Selected report: ${selected}` : "Choose a report."}</p>
    </div>
  );
}
```

### Loading and empty

```tsx live
<div className="w-full space-y-6">
  <UptimeStrip label="Fetching observations" days={[]} loading />
  <UptimeStrip label="New service" days={[]} />
</div>
```

## Rules

- **Do** supply complete UTC calendar dates (`YYYY-MM-DD`), and use `unknown` when an observation is missing.
- **Do** pass `uptime` only if your app has an independently measured percentage for the displayed reporting period. Leave it out otherwise.
- **Do** explain an incident in plain language, including its duration when known.
- **Do** keep chart marks small. Their status colour encodes data; avoid coloured cards or coloured incident paragraphs.
- **Don't** interpret “Latest report: operational” as a live probe. The app decides which observations are fresh enough to show.
- **Don't** use this component to fetch monitoring data or open an incident service. Supply data and `onDaySelect` from your app.

## Props

### UptimeStrip

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `days` | `readonly UptimeDay[]` | Required | Reports are sorted oldest first. Invalid dates/states are ignored; for duplicate dates, the last supplied report wins. Missing dates are not filled. |
| `label` | `string` | `"Service health"` | Service name above the strip and accessible name of the daily-report group. |
| `uptime` | `number` | — | Independently measured percentage from `0` to `100`, shown to two decimal places. Invalid or non-finite values are hidden. Never derived from the reports. |
| `locale` | `string` | `"en-GB"` | Locale for dates and the percentage; invalid locales fall back to `en-GB`. Dates are formatted in UTC. |
| `loading` | `boolean` | `false` | Show a delayed skeleton and mark the wrapper busy. Reports and percentage stay hidden until loaded. |
| `onDaySelect` | `(day: UptimeDay) => void` | — | Runs on click, tap, Enter or Space. Merely hovering or navigating by arrows does not trigger an app action. |
| `className` | `string` | — | Layout classes on the root wrapper. The strip confines horizontal scrolling to itself when narrow. |
| `...props` | `ComponentProps<"div">` | — | Standard div attributes, including `ref`. |

### UptimeDay

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `date` | `string` | Required | UTC calendar date as `YYYY-MM-DD`. |
| `status` | `"operational" \| "degraded" \| "outage" \| "unknown"` | Required | Reported day state. Unknown means no observation, not an outage. |
| `incident` | `string` | — | Optional plain-language detail, included in the day's accessible name and the persistent detail area. |

`UptimeStripProps`, `UptimeDay` and `UptimeStatus` are exported types.

## Motion

The marks do not animate or pulse. The shared tooltip enters in 100ms and exits in 75ms; keyboard navigation and the detail text update immediately. Reduced motion follows the library styles.

## Accessibility

The report group has one Tab stop. Left/Right move between days, Home/End move to the first/last report, and Tab leaves the strip. Each day has a complete accessible name containing its date, status and incident. Hover and focus show a short tooltip, while full details stay below the strip for touch and keyboard users. The summary spells out the latest report and counts unknown observations separately; colour is never the only source of meaning.
