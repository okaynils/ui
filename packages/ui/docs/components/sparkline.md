---
title: Sparkline
description: A word-sized trend line, area or bar strip for stats, table cells and sentences, with honest gaps and a hover readout.
group: Data
order: 120
---

# Sparkline

A chart the size of a word: the shape of a series, without axes or legends. Put it next to a `Stat`, in a table column, or at the end of a sentence, wherever "is this going up?" matters more than the exact values. Supply the values; missing ones stay visible as gaps instead of being drawn as zeros. For a chart people need to read values off, use a real chart with axes.

```tsx
import { Sparkline } from "@nils/ui";
import type { SparklineProps, SparklineTone, SparklineVariant } from "@nils/ui";
```

## Examples

### Under a stat

Pair the number with its recent history. `dot` marks the latest value so the eye lands on "now". Hover the line to read individual values.

```tsx live
<StatGroup className="w-full max-w-xl">
  <div className="flex flex-col gap-2">
    <Stat label="Requests / min" value={1284} delta={0.12} />
    <Sparkline data={[820, 860, 910, 870, 960, 1020, 990, 1080, 1150, 1120, 1210, 1284]} dot />
  </div>
  <div className="flex flex-col gap-2">
    <Stat label="p95 latency" value="182 ms" delta={-0.08} better="down" />
    <Sparkline variant="area" data={[240, 232, 228, 236, 214, 205, 210, 198, 192, 188, 185, 182]} dot />
  </div>
  <div className="flex flex-col gap-2">
    <Stat label="Errors" value={14} delta={1.8} better="down" />
    <Sparkline variant="bars" tone="err" data={[2, 1, 0, 3, 1, 0, 2, 4, 3, 6, 9, 14]} />
  </div>
</StatGroup>
```

### In a table

A fixed `width` keeps every row's trend on the same scale of time. `baseline` draws a hairline at a target, here the 99.9% SLO.

```tsx live
<Table density="compact">
  <TableHeader>
    <TableRow>
      <TableHead>Service</TableHead>
      <TableHead>Last 14 days</TableHead>
      <TableHead align="right">Uptime</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-mono">api-gateway</TableCell>
      <TableCell><Sparkline width={120} height={20} baseline={99.9} min={99.5} max={100} data={[99.98, 99.99, 100, 99.97, 99.99, 100, 100, 99.96, 99.99, 100, 99.98, 99.99, 100, 99.99]} /></TableCell>
      <TableCell align="right" className="font-mono">99.99%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-mono">postgres-main</TableCell>
      <TableCell><Sparkline width={120} height={20} baseline={99.9} min={99.5} max={100} data={[100, 100, 99.99, 100, 100, 100, 99.99, 100, 100, 100, 100, 100, 99.99, 100]} /></TableCell>
      <TableCell align="right" className="font-mono">99.99%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-mono">legacy-worker</TableCell>
      <TableCell><Sparkline width={120} height={20} baseline={99.9} min={99.5} max={100} tone="warn" data={[99.95, 99.9, 99.82, 99.88, 99.7, 99.91, 99.86, 99.6, 99.8, 99.85, 99.72, 99.9, 99.81, 99.78]} /></TableCell>
      <TableCell align="right" className="font-mono">99.83%</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Gaps, a single point and no data

`NaN` (or any non-finite value) is a gap: the line breaks there, so a missing day never looks like a zero. A lone value between gaps is drawn as a point. With no values at all, a quiet hairline holds the space and the label says "No data".

```tsx live
<div className="flex w-full max-w-xs flex-col gap-4">
  <Sparkline data={[4, 6, 5, NaN, NaN, 7, 8, NaN, 6, 9, 8, 10]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]} />
  <Sparkline data={[NaN, NaN, 5, NaN, NaN]} />
  <Sparkline data={[]} />
</div>
```

### In a sentence

At text height a sparkline reads inline.

```tsx live
<p className="max-w-md text-sm text-ink-2">
  Sign-ups this month <Sparkline width={64} height={14} data={[3, 5, 4, 8, 7, 9, 12, 11, 15]} interactive={false} /> are up 40% on September.
</p>
```

## Rules

- **Do** keep the default `neutral` tone. Use `ok`, `warn` or `err` only when the colour states a status that's also written next to it; use `accent` only for the one series a view is about.
- **Do** use a fixed `width` and shared `min`/`max` when sparklines sit in a column, so rows compare honestly.
- **Do** pass `NaN` for missing values. Never fill gaps with 0 or the previous value.
- **Do** use `bars` for counts per period (errors per day) and `line`/`area` for continuous measures (latency, traffic).
- **Do** pass `format` and `labels` when the readout should say "182 ms · 14 Oct" instead of a bare number.
- **Don't** expect a sparkline to carry exact values. If people need to read numbers, show the number (`Stat`) or a full chart.
- **Don't** add axes, gridlines or a legend. One series, no frame; the surrounding label names it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `readonly number[]` | Required | Values, oldest first. Non-finite values are gaps. |
| `variant` | `"line" \| "area" \| "bars"` | `"line"` | Line, line with a 10% wash, or one bar per value from zero. |
| `height` | `number` | `24` | Height in pixels. |
| `width` | `number` | Fills container | Width in pixels. |
| `tone` | `"neutral" \| "accent" \| "ok" \| "warn" \| "err"` | `"neutral"` | Mark colour. `neutral` is `ink-2`. |
| `dot` | `boolean` | `false` | A dot on the last value. |
| `min` | `number` | Data minimum | Fix the bottom of the scale. Bars always include 0. |
| `max` | `number` | Data maximum | Fix the top of the scale. |
| `baseline` | `number` | — | A `line-strong` hairline at this value (target, limit, average). |
| `labels` | `readonly string[]` | — | A name per value, shown in the hover readout. |
| `format` | `(value: number) => string` | Up to 2 decimals | Formats values in the readout and the spoken summary. |
| `label` | `string` | Generated summary | Replaces the accessible name. |
| `interactive` | `boolean` | `true` | Crosshair and readout under the pointer. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"span">` | — | Standard attributes, including `ref`. The root is an inline-block `span`, so it is valid inside a paragraph. |

Exports `SparklineProps`, `SparklineVariant` and `SparklineTone`.

## Motion

None. A sparkline draws its data immediately and redraws instantly when the data changes; there's no entrance animation or tweening between values. On hover, the crosshair, point and readout follow the pointer with no transition, and the other bars dim.

## Accessibility

The sparkline is a single `role="img"` with a spoken summary, e.g. "Trend of 12 values: from 820 to 1,284, low 820, high 1,284", including how many values are missing. Pass `label` to say what the trend means instead ("Requests rising for 12 hours"). The hover readout is a convenience for pointer users only. Every value it shows should also be available elsewhere, such as the `Stat` beside it or a table, because the readout can't be reached by keyboard. Lines are 1.5px with round caps, and the end dot has a 2px surface ring so it stays visible where it sits on the line.
