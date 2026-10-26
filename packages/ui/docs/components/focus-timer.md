---
title: FocusTimer
description: A local focus and break timer with start, pause, resume, reset and deliberate phase changes.
group: Gimmicks
order: 120
---

# FocusTimer

A small timer for one piece of focused work, followed by a break. Start it, pause without losing elapsed time, and reset when you need a fresh session. Reaching zero stops the timer; the next phase starts only when you choose it. It runs locally, with no notifications, sound, service account or persistence.

```tsx
import { FocusTimer } from "@nils/ui";
```

## Examples

### A normal session

The default is 25 minutes of focus and a 5-minute break. Duration props are **seconds**, not minutes.

```tsx live
<FocusTimer label="Write the first draft" />
```

### Try a complete cycle

These short durations let you try start, pause, resume, completion and the deliberate transition to a break. The completion count changes once for each phase that finishes; resetting a phase does not count as finishing it.

```tsx live
import { useState } from "react";
import { FocusTimer } from "@nils/ui";

export default function Example() {
  const [completed, setCompleted] = useState(0);
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <FocusTimer focusSeconds={5} breakSeconds={3} label="A short demo" onComplete={() => setCompleted((value) => value + 1)} />
      <p className="font-mono text-xs text-ink-2">Completed phases: {completed}</p>
    </div>
  );
}
```

### Begin with a break

```tsx live
<FocusTimer defaultPhase="break" breakSeconds={10 * 60} label="Step away from the screen" />
```

## Rules

- **Do** pass durations in seconds: `focusSeconds={45 * 60}` is 45 minutes.
- **Do** let the person start the next phase. A finished focus period does not silently become a running break, and time away never skips several phases.
- **Do** keep the label short and specific to the work or rest period.
- **Do** persist sessions or add notifications in the consuming app if your product needs them. This local timer resets when unmounted or reloaded.
- **Don't** use it to measure billable time or as a guaranteed alarm. Browser suspension can delay the completion callback until the page runs again; the elapsed time is still calculated from the deadline.
- **Don't** change duration props to edit a running session. Durations are captured at the start of each phase; new props apply on **Reset** or when starting the next phase. To replace the whole timer immediately, change its React `key`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `focusSeconds` | `number` | `1500` | Focus duration in seconds. Positive finite values round to whole seconds and clamp to `1…86400`; invalid or nonpositive values use 1500. |
| `breakSeconds` | `number` | `300` | Break duration in seconds, with the same normalization; invalid values use 300. |
| `defaultPhase` | `"focus" \| "break"` | `"focus"` | Initial phase, read once on mount. Neither phase starts automatically. |
| `label` | `string` | `"Time to focus"` | Purpose displayed beneath the remaining time. Pass an empty string to omit. |
| `onComplete` | `(phase: FocusTimerPhase) => void` | — | Called once when a started phase reaches zero. Receives the phase that just finished. Uses the latest callback without restarting the timer. |
| `className` | `string` | — | Layout classes for the outer group, such as width. |
| `...props` | `ComponentProps<"div">` | — | Standard root attributes and `ref`, except `children` and `onComplete`. |

Exports `FocusTimerProps` and `FocusTimerPhase` types. The component owns its local session state. **Reset** resets the current phase, not necessarily the focus phase; after a completed phase, **Start break** or **Start focus** switches and begins the next one.

## Motion

Digits update directly with tabular figures. Progress uses the library's 200ms transition and shared reduced-motion settings. There is no blinking colon, digit roll or decorative loop.

## Accessibility

- Start, Pause, Resume, Reset and next-phase controls are library buttons with normal keyboard activation and visible focus.
- The remaining time uses `role="timer"` and `aria-live="off"`, so ticks do not interrupt screen readers. The progress bar has an explicit phase and remaining-time label.
- A separate polite status announces start, pause, resume, reset and completion, rather than every tick. No sound or browser notification is generated.
