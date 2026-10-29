---
title: FocusTimer
description: A focus and break timer on a kitchen-timer dial that drains while it runs, with an optional countdown in the tab title.
group: Gimmicks
order: 120
---

# FocusTimer

A small timer for one piece of focused work, followed by a break, drawn as a kitchen timer: a dial with twelve ticks and an arc for the time that's left. While it runs, the hand sweeps clockwise and the arc drains towards twelve o'clock. Start it, pause without losing elapsed time, and reset when you need a fresh session. Reaching zero stops the timer; the next phase starts only when you choose it. It runs locally, with no notifications, sound, service account or persistence.

```tsx
import { FocusTimer } from "@nils/ui";
```

## Examples

### A normal session

The default is 25 minutes of focus and a 5-minute break. Duration props are **seconds**, not minutes. With `titleCountdown`, the remaining time also shows in the browser tab while the timer runs, so you can see it from another tab.

```tsx live
<FocusTimer label="Write the first draft" titleCountdown />
```

### Try a complete cycle

These short durations let you watch the dial drain, and try pause, resume, completion and the deliberate transition to a break. The completion count changes once for each phase that finishes; resetting a phase does not count as finishing it.

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
- **Do** use `titleCountdown` for timers people leave running in a background tab. Use it on one timer per page; two would fight over the title.
- **Do** persist sessions or add notifications in the consuming app if your product needs them. This local timer resets when unmounted or reloaded.
- **Don't** use it to measure billable time or as a guaranteed alarm. Browser suspension can delay the completion callback until the page runs again; the elapsed time is still calculated from the deadline.
- **Don't** change duration props to edit a running session. Durations are captured at the start of each phase; new props apply on **Reset** or when starting the next phase. To replace the whole timer immediately, change its React `key`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `focusSeconds` | `number` | `1500` | Focus duration in seconds. Positive finite values round to whole seconds and clamp to `1…86400`; invalid or nonpositive values use 1500. |
| `breakSeconds` | `number` | `300` | Break duration in seconds, with the same normalization; invalid values use 300. |
| `defaultPhase` | `"focus" \| "break"` | `"focus"` | Initial phase, read once on mount. Neither phase starts automatically. |
| `label` | `string` | `"Time to focus"` | Purpose shown next to the dial. Pass an empty string to omit. |
| `titleCountdown` | `boolean` | `false` | While running, prefix the tab title with the remaining time and phase, e.g. `12:34 Focus · My app`. The original title is restored on pause, completion and unmount. |
| `onComplete` | `(phase: FocusTimerPhase) => void` | — | Called once when a started phase reaches zero. Receives the phase that just finished. Uses the latest callback without restarting the timer. |
| `className` | `string` | — | Layout classes for the outer group, such as width. |
| `...props` | `ComponentProps<"div">` | — | Standard root attributes and `ref`, except `children` and `onComplete`. |

Exports `FocusTimerProps` and `FocusTimerPhase` types. The component owns its local session state. **Reset** resets the current phase, not necessarily the focus phase; after a completed phase, **Start break** or **Start focus** switches and begins the next one.

## Motion

The draining dial is the timer's signature move. While the timer runs, the arc and its hand are redrawn every frame from the wall clock, so the hand sweeps clockwise smoothly instead of ticking, and the arc of remaining time shrinks towards twelve o'clock. It's the only moving part, and it moves only while the timer is running: paused, ready or complete, the dial holds still. Focus draws the arc in ink, a break in ink-2; a completed phase shows an empty dial and an `ok` status.

The digits update once a second with tabular figures; there is no blinking colon or digit roll. Under `prefers-reduced-motion` the dial skips the per-frame sweep and steps once a second with the digits.

## Accessibility

- Start, Pause, Resume, Reset and next-phase controls are library buttons with normal keyboard activation and visible focus.
- The remaining time uses `role="timer"` and `aria-live="off"`, so ticks do not interrupt screen readers. The dial is decorative; the timer's label gives the phase and remaining time, and the state (Ready, Running, Paused, Complete) is a word next to it.
- `titleCountdown` changes the document title, which some screen readers announce on tab switches. It's off by default.
- A separate polite status announces start, pause, resume, reset and completion, rather than every tick. No sound or browser notification is generated.
