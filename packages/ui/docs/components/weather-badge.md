---
title: WeatherBadge
description: A compact weather report with supplied conditions, temperature, daily range and optional sun times.
group: Gimmicks
order: 60
---

# WeatherBadge

A small weather report for a personal-site footer, travel page or dashboard. The app supplies the observations, units and location; this component makes no weather request and never claims that a reading is current. An optional observation timestamp shows when the data was measured.

```tsx
import { WeatherBadge } from "@nils/ui";
```

## Examples

### A compact observation

```tsx live
<WeatherBadge location="Stockholm" reading={{ temperature: 8, condition: "rain", conditionLabel: "Light rain" }} />
```

### Daily range and sun times

Sun times and observation times are absolute instants. Supply the location's IANA zone to show its local clock; otherwise times use UTC. These are fixed demonstration observations.

```tsx live
<WeatherBadge
  location="Stockholm"
  timeZone="Europe/Stockholm"
  reading={{
    temperature: 8.4,
    condition: "partly-cloudy",
    high: 10,
    low: 3,
    sunrise: "2026-10-26T06:50:00Z",
    sunset: "2026-10-26T15:05:00Z",
    observedAt: "2026-10-26T11:30:00Z",
  }}
/>
```

### Units

`unit` describes the supplied values; it does not convert them. Convert every temperature together in your data adapter or consuming screen.

```tsx live
import { useState } from "react";
import { Button, WeatherBadge } from "@nils/ui";

export default function Example() {
  const [fahrenheit, setFahrenheit] = useState(false);
  const convert = (celsius: number) => fahrenheit ? celsius * 9 / 5 + 32 : celsius;
  return (
    <div className="flex flex-col items-start gap-3">
      <WeatherBadge location="Stockholm" unit={fahrenheit ? "fahrenheit" : "celsius"} reading={{ temperature: convert(8), high: convert(10), low: convert(3), condition: "clear" }} />
      <Button size="sm" onClick={() => setFahrenheit((value) => !value)}>Show {fahrenheit ? "Celsius" : "Fahrenheit"}</Button>
    </div>
  );
}
```

### Loading and unavailable

Loading marks the widget busy and reserves space for the observation. Null readings and non-finite temperatures show an explicit unavailable message.

```tsx live
<div className="flex flex-col items-start gap-3">
  <WeatherBadge location="Stockholm" reading={null} loading />
  <WeatherBadge location="Stockholm" reading={null} />
</div>
```

## Rules

- **Do** pass values from your own data source. API access, credentials, caching and refresh policy belong to the app.
- **Do** supply `observedAt` when the age of the reading matters. Updating this component's props is what updates the report.
- **Do** keep temperature, high and low in the same `unit`.
- **Do** supply `timeZone` for the place being displayed. ISO timestamp strings should contain `Z` or an explicit UTC offset.
- **Don't** use the condition icon alone. The condition text is always present, and `conditionLabel` can make it more precise.
- **Don't** present unavailable data as zero degrees or hide stale data behind an animated "live" indicator.

## Props

### WeatherBadge

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `location` | `string` | Required | Place name shown alongside the report and in its accessible group name. |
| `reading` | `WeatherReading \| null` | Required | Supplied observation; null or non-finite temperature means unavailable. |
| `unit` | `"celsius" \| "fahrenheit"` | `"celsius"` | Units of all supplied temperatures. No conversion is performed. |
| `timeZone` | `string` | `"UTC"` | IANA zone used to format sun and observation times. Invalid timestamps or zones omit the affected times. |
| `locale` | `string` | `"en-GB"` | Number and time formatting locale. Invalid locales fall back to en-GB for numbers and omit times. |
| `loading` | `boolean` | `false` | Show a placeholder and set `aria-busy`. Hides previously supplied details while loading. |
| `className` | `string` | — | Layout classes on the outer div. |
| `...props` | `ComponentProps<"div">` | — | Standard div attributes, including `ref`. |

### WeatherReading

| Field | Type | Description |
| --- | --- | --- |
| `temperature` | `number` | Required finite temperature in the chosen unit. |
| `condition` | `WeatherCondition` | Required: `clear`, `partly-cloudy`, `cloudy`, `rain`, `snow`, `storm`, `fog`, `wind` or `unknown`. |
| `conditionLabel` | `string` | Optional descriptive text replacing the default condition, e.g. "Light rain". |
| `high` / `low` | `number` | Optional daily range. Non-finite values are omitted. |
| `sunrise` / `sunset` | `Date \| string \| number` | Optional absolute instants; numbers are Unix milliseconds. |
| `observedAt` | `Date \| string \| number` | Optional measurement timestamp, displayed with day, month and time. |

Exports `WeatherBadgeProps`, `WeatherReading`, `WeatherCondition` and `WeatherUnit` types.

## Accessibility

The widget is a named group, and its condition icons are decorative. The main temperature includes screen-reader text spelling out the unit. Sun and observation times use semantic `time` elements with ISO `dateTime` values. Loading is communicated by `aria-busy` and hidden text. No automatic timer or live region announces repeated weather updates.
