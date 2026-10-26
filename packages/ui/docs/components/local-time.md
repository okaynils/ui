---
title: LocalTime
description: A place's local clock, with optional working hours and a daylight-saving-aware difference from the visitor.
group: Gimmicks
order: 20
---

# LocalTime

A quiet answer to “what time is it where you are?” Put it in a personal-site footer, a team directory or a contact page. It formats an IANA time zone, updates once a minute, and can show working hours and the current difference from the visitor. No location lookup or network service is involved.

```tsx
import { LocalTime } from "@nils/ui";
```

## Examples

### A live clock

```tsx live
<LocalTime timeZone="Europe/Stockholm" label="Stockholm" />
```

### Working hours and visitor difference

This fixed preview is 14:30 in Stockholm on a Monday, during the configured working hours. The offset is calculated at that instant, including daylight saving time. Omit `at` and `viewerTimeZone` in an app to use the current instant and the visitor's browser zone.

```tsx live
<LocalTime
  timeZone="Europe/Stockholm"
  label="Stockholm"
  at="2026-06-15T12:30:00Z"
  workingHours={{ start: 9, end: 17 }}
  showDifference
  viewerTimeZone="America/New_York"
/>
```

### Fractional offsets and overnight hours

The difference need not be a whole number of hours. Overnight shifts are attributed to the day on which they start: a Monday 22:00–06:00 shift includes early Tuesday morning.

```tsx live
<div className="flex flex-col items-start gap-3">
  <LocalTime timeZone="Asia/Kathmandu" label="Kathmandu" at="2026-06-15T12:30:00Z" showDifference viewerTimeZone="Europe/London" />
  <LocalTime timeZone="Europe/Stockholm" label="Night shift" at="2026-06-15T23:00:00Z" workingHours={{ start: 22, end: 6, days: [1, 2, 3, 4, 5] }} />
</div>
```

## Rules

- **Do** supply an IANA zone such as `Europe/Stockholm`, not an abbreviation such as `CST` or a fixed UTC offset. IANA zones carry daylight-saving rules.
- **Do** set a short place `label` when the zone's city name would be unclear.
- **Do** treat working hours as informative. They are a local wall-clock schedule, not proof someone is available or online.
- **Do** pass `at` when rendering a fixed event or a deterministic preview. It freezes the widget and starts no clock timer.
- **Don't** infer location from the visitor's time zone. `viewerTimeZone` is used only to compare clocks.
- **Don't** show seconds or animate the clock. Minute precision is enough for this widget.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `timeZone` | `string` | Required | IANA time zone. An invalid zone or date shows “Time unavailable”. |
| `label` | `ReactNode` | Last segment of `timeZone` | Place name before the clock. Pass `null` to omit. Underscores in the default name become spaces. |
| `locale` | `string` | `"en-GB"` | Clock formatting locale; the default uses 24-hour time. |
| `at` | `Date \| string \| number` | Current time | Freeze at an instant. Strings should contain an explicit offset, e.g. `2026-06-15T12:30:00Z`; numbers are Unix milliseconds. |
| `workingHours` | `LocalTimeWorkingHours` | — | `{ start, end, days? }`. Local hours from 0 to 24, with an exclusive end. `start` must be below 24; equal start/end is invalid. Fractions such as `9.5` mean 09:30. A lower end means an overnight shift. |
| `workingHours.days` | `readonly number[]` | `[1, 2, 3, 4, 5]` | Days on which a shift starts, Sunday `0` through Saturday `6`. An empty array means no working days. |
| `showDifference` | `boolean` | `false` | Add “6h ahead of you”, “4h 45m ahead of you”, or “Same time as you”. |
| `viewerTimeZone` | `string` | Browser's zone | Zone used for the comparison. An invalid comparison zone shows “Time difference unavailable”. |
| `className` | `string` | — | Layout classes on the outer span. |
| `...props` | `ComponentProps<"span">` | — | Standard span props, including `ref`. |

`LocalTimeProps` and `LocalTimeWorkingHours` are exported types. Invalid working-hour bounds show “Hours unavailable” without hiding the clock.

## Accessibility

The clock is a semantic `<time>` with the full ISO instant in `dateTime`. Working-hour status is text plus a decorative dot. The clock is not a live region, so minute changes do not interrupt screen readers. A live clock shows `--:--` until mounted; server and initial client output match. The visitor's time zone is resolved after mounting unless it is supplied explicitly.
