---
title: Waveform
description: Supplied audio amplitudes and playback position, with optional keyboard and pointer seeking controlled by your player.
group: Gimmicks
order: 130
---

# Waveform

A compact view of an audio recording: peak amplitudes, elapsed time and the part already played. Good for voice notes, short recordings and music excerpts. Pass `onSeek` to make the waveform a seek control; your player remains the source of truth for playback and timing. No audio is fetched, decoded or played by the component.

```tsx
import { Waveform } from "@nils/ui";
```

## Examples

### A recording preview

These are fixed demonstration peaks. In an app, generate the amplitudes from the recording or obtain them from your backend.

```tsx live
<div className="w-full max-w-sm">
  <Waveform
    label="A note from the walk"
    samples={[0.1, 0.3, 0.6, 0.45, 0.8, 0.4, 0.2, 0.1, 0.25, 0.7, 1, 0.8, 0.45, 0.2, 0.1, 0.3, 0.5, 0.7, 0.4, 0.2, 0.1, 0.2, 0.6, 0.4]}
    duration={94}
    currentTime={32}
  />
</div>
```

### Seek locally

Click or drag the waveform. Arrow keys seek one second; Page Up/Down use ten seconds; Home/End reach the endpoints. This preview changes local state only, so no audio plays.

```tsx live
import { useState } from "react";
import { Button, Waveform } from "@nils/ui";

const peaks = Array.from({ length: 80 }, (_, i) => 0.12 + Math.abs(Math.sin(i * 0.57) * Math.cos(i * 0.19)) * 0.85);

export default function Example() {
  const [time, setTime] = useState(15);
  const [committed, setCommitted] = useState(15);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Waveform label="Voice note" samples={peaks} duration={120} currentTime={time} onSeek={setTime} onSeekCommitted={setCommitted} />
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-ink-2">Committed at {Math.round(committed)}s</span>
        <Button size="sm" onClick={() => setTime(0)}>Rewind</Button>
      </div>
    </div>
  );
}
```

### Unavailable and disabled

A missing duration disables seeking. Missing amplitude samples show an honest flat placeholder; a known duration can still be scrubbed. `disabled` temporarily prevents interaction while retaining the supplied state.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-6">
  <Waveform label="Waiting for metadata" samples={[]} duration={0} />
  <Waveform label="Paused for processing" samples={[0.2, 0.5, 0.8, 0.3, 0.6, 0.4, 0.2]} duration={48} currentTime={12} onSeek={() => {}} disabled />
</div>
```

### Connect a real player

Keep audio ownership in the app. Feed `currentTime` from the player's `timeupdate` event, `duration` from metadata, and make `onSeek` assign the player's `currentTime`. For example, given your own `audioRef`, `peaks`, `duration` and `time` state:

```tsx
<Waveform
  label="Recorded message"
  samples={peaks}
  duration={duration}
  currentTime={time}
  onSeek={(seconds) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    setTime(seconds);
  }}
/>
```

The audio element supplies play/pause controls and handles playback errors. A controlled waveform also works with Web Audio or an existing media player.

## Rules

- **Do** pass peak amplitudes in `0…1` and times in seconds. Values are clamped; non-finite samples become silence.
- **Do** update `currentTime` from the real player. The waveform never advances a timer or pretends audio is playing.
- **Do** handle seeking in `onSeek`. Use `onSeekCommitted` as an additional notification when dragging or a keyboard seek finishes.
- **Do** omit `onSeek` for a passive visual preview. It then adds no slider or tab stop.
- **Don't** treat the displayed bars as raw PCM samples. Long arrays are reduced to at most 180 peak-preserving bars.
- **Don't** hide playback failures in this widget. Explain them beside your player controls.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `samples` | `readonly number[]` | — | Required normalized peak amplitudes. Missing values show a placeholder; invalid values clamp to silence. |
| `duration` | `number` | — | Required total duration in seconds. Zero, negative and non-finite values disable seeking and show “Duration unavailable”. |
| `currentTime` | `number` | `0` | Supplied elapsed seconds, clamped to the duration. Non-finite values become zero. |
| `label` | `string` | `"Audio"` | Visible recording name and the seek control's accessible name. |
| `onSeek` | `(seconds: number) => void` | — | Enables controlled pointer and keyboard seeking. Update your player and `currentTime`. |
| `onSeekCommitted` | `(seconds: number) => void` | — | Notification after a seek completes. Only used with `onSeek`. |
| `disabled` | `boolean` | `false` | Disables seeking and dims the waveform. |
| `showTime` | `boolean` | `true` | Show elapsed and total time beside the label. The slider still has formatted time when hidden. |
| `className` | `string` | — | Layout classes on the wrapper. |
| `...props` | `ComponentProps<"div">` | — | Standard root attributes and ref, except children. |

`WaveformProps` is exported.

## Motion

The playhead and played portion update immediately with supplied time. They do not interpolate, loop or pulse. Pointer and keyboard seeking have no motion delay.

## Accessibility

- Seeking uses Base UI Slider, including pointer capture, touch support, keyboard navigation and cleanup.
- The slider is named “Seek [label]” and exposes formatted elapsed and total time through `aria-valuetext`.
- The waveform SVG is decorative; amplitudes are not announced one by one.
- Playback time is not a live region, so frequent player updates do not interrupt screen readers.
- A passive preview has no slider tab stop. Invalid durations and `disabled` remove interactive seeking.
