---
title: DatePicker
description: A date field you can type into (YYYY-MM-DD) or pick from a calendar popover. Submits ISO, shows a weekday hint, works inside Field.
group: Controls
order: 140
---

# DatePicker

A date field. Type the date, or open the calendar with the button (or ⌥↓). The text is ISO — `2026-10-26` — on purpose: it reads the same in every locale, sorts, and is exactly what the form submits. A short weekday hint after the date confirms what you typed ("Mon"), the way an old terminal echoes your input back.

```tsx
import { DatePicker } from "@nils/ui";
```

## Examples

### Basic

```tsx live
<div className="w-48">
  <Field label="Start date">
    <DatePicker defaultValue={new Date()} />
  </Field>
</div>
```

### Controlled

Typed text commits on Enter or blur. Something that isn't a real date (or is out of range) quietly goes back to the last good value.

```tsx live
import { Button, DatePicker, Field } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="flex w-48 flex-col gap-2">
      <Field label="Due">
        <DatePicker value={date} onValueChange={setDate} />
      </Field>
      <p className="font-mono text-xs text-ink-2">{date ? date.toISOString() : "null"}</p>
      <Button size="sm" onClick={() => setDate(new Date())}>Set today</Button>
    </div>
  );
}
```

### Limits

`min`, `max` and `isDateDisabled` apply to both the calendar and typed dates.

```tsx live
<div className="w-48">
  <Field label="Delivery" description="Weekdays in the next 30 days.">
    <DatePicker
      min={new Date()}
      max={new Date(Date.now() + 30 * 864e5)}
      isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
    />
  </Field>
</div>
```

### In a form

The input's `name` submits the ISO date, and `required` reports through `Field`.

```tsx live
import { Button, DatePicker, Field, Form } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [sent, setSent] = useState<string | null>(null);
  return (
    <Form
      className="flex w-48 flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(String(new FormData(e.currentTarget).get("start")));
      }}
    >
      <Field label="Start date" name="start">
        <DatePicker name="start" required />
      </Field>
      <Button type="submit" className="self-start">Schedule</Button>
      {sent ? <p className="font-mono text-xs text-ink-2">start={sent}</p> : null}
    </Form>
  );
}
```

### Sizes

```tsx live
<div className="flex w-48 flex-col gap-2">
  <DatePicker size="sm" aria-label="Small" defaultValue={new Date()} />
  <DatePicker size="md" aria-label="Medium" defaultValue={new Date()} />
  <DatePicker size="lg" aria-label="Large" defaultValue={new Date()} />
</div>
```

## Rules

- **Do** keep the ISO text. If a screen needs a friendly date, show it next to the field, not in it.
- **Do** set `min`/`max` rather than validating after the fact.
- **Do** use `Calendar` with `mode="range"` (in a `Popover`) for ranges; `DatePicker` is for a single day.
- **Don't** use it for times or date-times; it holds a calendar day only.
- **Don't** widen it beyond ~12rem. A date is short; a long field suggests a long answer.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `defaultValue` | `Date \| null` | `null` | Selected day (local midnight). |
| `onValueChange` | `(value: Date \| null) => void` | — | Called on pick, or when typed text commits. Clearing the text gives `null`. |
| `min` / `max` | `Date` | — | Selectable bounds, for both typing and the calendar. |
| `isDateDisabled` | `(date: Date) => boolean` | — | Disable specific days. |
| `weekStartsOn` | `0 … 6` | `1` | First weekday in the calendar. |
| `locale` | `string` | browser | Calendar names and the weekday hint. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 28 / 32 / 36px. |
| `name` | `string` | — | Submits `YYYY-MM-DD`. |
| `required` / `disabled` | `boolean` | — | As on any input. |
| `placeholder` | `string` | `"YYYY-MM-DD"` | Shown while empty. |
| `aria-label` | `string` | — | Needed without a surrounding `Field` label. |
| `className` | `string` | — | Layout only (width). |

`formatISODate(date)` and `parseISODate(text)` are exported for your own code.

## Accessibility

- The text field is a real input, so `Field` labels it and `Form` validates it. ⌥↓ opens the calendar from the keyboard.
- The calendar button is labelled "Choose date"; the calendar opens with focus on the selected day (or today) and returns focus to the button when it closes.
- See [Calendar](/components/calendar) for the grid's keyboard model.
