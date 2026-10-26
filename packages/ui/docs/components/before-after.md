---
title: BeforeAfter
description: Two supplied images with a draggable divider, working by pointer and by keyboard as a real slider.
group: Gimmicks
order: 150
---

# BeforeAfter

Compare two versions of the same picture — an edit, a redesign, a season. Drag anywhere on the image, or focus the handle and use the arrow keys. The widget owns only the divider position: it loads the images you pass and compares nothing itself.

```tsx
import { BeforeAfter } from "@nils/ui";
```

## Examples

### Drag to compare

The divider starts at 50%. Both images fill the frame with `object-fit: cover`, so keep them at the same aspect ratio.

```tsx live
import { BeforeAfter } from "@nils/ui";

const scene = (sky: string, sun: string, hill: string, water: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">` +
      `<rect width="480" height="360" fill="${sky}"/>` +
      `<circle cx="348" cy="92" r="30" fill="${sun}"/>` +
      `<path d="M0 236 96 166l78 52 86-70 134 96 86-40v154H0z" fill="${hill}"/>` +
      `<rect y="288" width="480" height="72" fill="${water}"/>` +
    `</svg>`,
  );

const midday = scene("#dfe8f2", "#f4e7bb", "#9fb0a5", "#c6d4dd");
const dusk = scene("#2b3048", "#e9a06a", "#3a3f57", "#22263a");

export default function Example() {
  return (
    <BeforeAfter
      before={{ src: midday, alt: "Hills above a lake in flat midday light" }}
      after={{ src: dusk, alt: "The same hills at dusk, the lake reflecting a low sun" }}
      beforeLabel="Midday"
      afterLabel="Dusk"
    />
  );
}
```

### Controlled position

Keep `value` in your app to sync the divider with another control or a URL. `onValueChange` receives a percentage with one decimal place.

```tsx live
import { useState } from "react";
import { BeforeAfter, Button } from "@nils/ui";

const frame = (hue: number) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">` +
      `<rect width="480" height="360" fill="hsl(${hue} 24% 88%)"/>` +
      `<path d="M0 210 120 130l104 62 96-44 160 92v120H0z" fill="hsl(${hue} 18% 58%)"/>` +
    `</svg>`,
  );

export default function Example() {
  const [value, setValue] = useState(32);
  return (
    <div className="flex w-full max-w-lg flex-col items-start gap-3">
      <BeforeAfter
        before={{ src: frame(212), alt: "A valley drawn in cool grey-blue tones" }}
        after={{ src: frame(28), alt: "The same valley drawn in warm ochre tones" }}
        beforeLabel="Cool"
        afterLabel="Warm"
        value={value}
        onValueChange={setValue}
        className="max-w-none"
      />
      <div className="flex w-full items-center justify-between gap-3">
        <span className="font-mono text-xs text-ink-3 tabular-nums">{value.toFixed(1)}% before</span>
        <Button size="sm" onClick={() => setValue(50)}>Reset to half</Button>
      </div>
    </div>
  );
}
```

### A portrait frame

The default frame is 4:3. Override the aspect ratio when the pictures are tall.

```tsx live
import { BeforeAfter } from "@nils/ui";

const card = (background: string, ink: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">` +
      `<rect width="300" height="400" fill="${background}"/>` +
      `<rect x="36" y="48" width="228" height="304" rx="8" fill="none" stroke="${ink}" stroke-width="2"/>` +
      `<path d="M72 112h156M72 148h108" stroke="${ink}" stroke-width="6"/>` +
    `</svg>`,
  );

export default function Example() {
  return (
    <BeforeAfter
      before={{ src: card("#eeeeef", "#6b6b72"), alt: "A portrait layout sketch with two text rules" }}
      after={{ src: card("#eef2ff", "#2457f5"), alt: "The same layout with the rules in accent blue" }}
      beforeLabel="Sketch"
      afterLabel="Accent"
      className="aspect-[3/4] max-w-48"
    />
  );
}
```

## Rules

- **Do** write `alt` for what each picture shows, not “before image”. The labels already say which side is which.
- **Do** name the difference in `beforeLabel`/`afterLabel` — “Midday”, “Draft”, “v1” — so the comparison reads without dragging.
- **Do** use the same crop and dimensions for both images. Different framing makes the divider misleading.
- **Do** keep `value` in your app when another control or a shared link should move the divider.
- **Don't** rely on dragging alone. The handle is focusable and every position is reachable from the keyboard.
- **Don't** hide text or a price behind the divider. A comparison reveals detail; it must not be the only way to read essential information.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `before` | `{ src: string; alt: string }` | Required | The image revealed on the left of the divider. |
| `after` | `{ src: string; alt: string }` | Required | The image visible from the divider to the right edge. |
| `value` | `number` | — | Divider position as a percentage from the left, 0–100. Controlled: pair it with `onValueChange`. |
| `defaultValue` | `number` | `50` | Starting position for the uncontrolled divider. |
| `onValueChange` | `(value: number) => void` | — | Called with the new percentage whenever the divider moves, rounded to one decimal. |
| `beforeLabel` | `ReactNode` | `"Before"` | Label at the top left of the frame. |
| `afterLabel` | `ReactNode` | `"After"` | Label at the top right of the frame. |
| `dividerLabel` | `string` | `"Reveal before and after"` | Accessible name of the slider handle. |
| `className` | `string` | — | Layout classes on the frame, e.g. `aspect-[3/4] max-w-48`. |
| `...props` | `ComponentProps<"div">` | — | Standard frame props, including `ref`. Children are not accepted. |

Exports `BeforeAfterProps` and `BeforeAfterImage` types.

## Motion

None. The divider tracks the pointer directly, and arrow-key steps move it one percent per press. There is no easing, snap or entrance animation, so the comparison never lags behind the hand.

## Accessibility

The handle is a `slider` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and a spoken value such as “32% before, 68% after”. Arrow keys move one percent, Shift or Page Up/Down move ten, and Home/End jump to either edge. The frame is a group named “Image comparison”, both pictures keep their `alt` text, and the labels are visible text rather than overlays that only appear on hover. The frame sets `touch-none` so a drag does not scroll the page, and dragging never moves focus away from the handle.
