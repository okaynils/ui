---
title: Countdown
description: Time remaining until an absolute instant, with minute or second precision and an explicit finished state.
group: Gimmicks
order: 110
---

# Countdown

Time until a launch, an event, or the end of a break. The widget calculates from the wall clock, catches up when a background tab returns, and replaces the duration with your finished copy at the deadline. It does not keep an event running or provide a trusted server deadline; your app owns those decisions.

```tsx
import { Countdown } from "@nils/ui";
```

## Examples

### Until a launch

This fixed preview shows the days, hours and minutes until an event. Omit `now` to use the live clock. Use explicit offsets so the same launch happens at the same instant everywhere.

```tsx live
<Countdown
  label="Launch in"
  target="2026-11-01T10:00:00Z"
  now="2026-10-29T05:58:00Z"
  precision="minutes"
  finished="The launch is live."
/>
```

### A short live countdown

Start a local ten-second countdown. The completion callback fires once for that target. Starting again sets a new deadline and resets completion.

```tsx live
import { useState } from "react";
import { Button, Countdown, Status } from "@nils/ui";

export default function Example() {
  const [target, setTarget] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      {target !== null ? (
        <Countdown label="Ready in" target={target} finished="Ready." onComplete={() => setComplete(true)} />
      ) : <span className="text-ui text-ink-2">Start when you are ready.</span>}
      {complete ? <Status tone="ok">Countdown finished</Status> : null}
      <Button size="sm" onClick={() => { setComplete(false); setTarget(Date.now() + 10_000); }}>Start 10 seconds</Button>
    </div>
  );
}
```

### Finished and unavailable

Finished content may be a short message or a link. Invalid dates and strings without a timezone display an unavailable state rather than guessing a local deadline.

```tsx live
<div className="flex flex-col items-start gap-3">
  <Countdown label="Away until Friday" target="2026-10-23T17:00:00Z" now="2026-10-26T09:00:00Z" finished="Back at my desk." />
  <Countdown label="Next event" target="not-a-date" />
</div>
```

## Rules

- **Do** pass a `Date`, Unix milliseconds, or an ISO datetime string with `Z` or an explicit offset such as `+02:00`.
- **Do** use `precision="minutes"` when seconds add noise. Remaining partial minutes round up, so the widget does not claim the deadline has passed early.
- **Do** provide `finished` copy that still makes sense after the deadline. The widget never shows negative time.
- **Do** keep deadline enforcement and data changes in the app. A client clock can be wrong, and a closed tab cannot run a callback.
- **Don't** trigger critical actions solely through `onComplete`; it is a local notification after the widget observes completion.
- **Don't** wrap the timer in an announcing live region. Screen readers should not hear every second.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `Date \| string \| number` | Required | Absolute deadline. Strings need a timezone; numbers are Unix milliseconds. Invalid values show “Countdown unavailable”. |
| `label` | `ReactNode` | — | Context before the remaining duration, e.g. “Launch in”. |
| `precision` | `"minutes" \| "seconds"` | `"seconds"` | Smallest displayed unit and clock update frequency. Days and hours appear when needed; minutes always appear. Partial units round up. |
| `finished` | `ReactNode` | `"It's time."` | Replaces the duration when the target is reached or already past. The label stays visible. |
| `now` | `Date \| string \| number` | Live wall clock | Freeze the current instant for a preview or drive it from your app. No timer runs while supplied. An invalid value shows the unavailable state. |
| `onComplete` | `() => void` | — | Called once after mounting when this target is observed complete, including an already-past target. A changed target resets completion. Works with supplied `now` too. |
| `className` | `string` | — | Layout classes on the wrapper. |
| `...props` | `ComponentProps<"div">` | — | Standard wrapper props, including `ref`. Children are not accepted. |

Exports `CountdownProps` and `CountdownPrecision` types.

## Motion

Digits switch immediately. There is no rolling, blinking or looping animation. The clock recalculates from `Date.now()` rather than subtracting one per callback, and it refreshes on focus or when the document becomes visible. A live countdown shows `--:--` until mounted so server and initial client output agree.

## Accessibility

The wrapper uses `role="timer"` and `aria-live="off"`. Visual abbreviations have a full spoken equivalent, such as “3 days, 4 hours, 2 minutes remaining”. The duration is a semantic `<time>` whose `dateTime` identifies the absolute target. Completion does not steal focus or announce automatically; put important completion feedback in your app's own deliberate notification.
