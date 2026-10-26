---
title: SplitFlap
description: Text on a split-flap departure board; changed cells flip through a few letters before landing.
group: Gimmicks
order: 210
---

# SplitFlap

Text on a split-flap departure board, the kind that clatters in old train stations. When the text changes, every cell that differs flips through a few characters before it lands on its own. Use it for a hero line that rotates through a few words, a gate or status code, or any short label that changes now and then.

```tsx
import { SplitFlap } from "@nils/ui";
```

## Examples

### A rotating hero line

Pass `words` and the board rotates through them every `interval` milliseconds. Rotation pauses while the pointer or focus is on it, and the board is always as wide as the longest word.

```tsx live
<p className="text-[26px] leading-10 font-semibold tracking-[-0.02em] text-ink">
  Tools for <SplitFlap words={["designers", "engineers", "founders"]} />
</p>
```

### Driven by your app

Pass `value` to control the text yourself, e.g. from a status or a selection.

```tsx live
import { useState } from "react";
import { SegmentedControl, SplitFlap } from "@nils/ui";

const GATES = { stockholm: "B12", berlin: "A04", lisbon: "C31" };

export default function Example() {
  const [city, setCity] = useState<keyof typeof GATES>("stockholm");
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-3">
        <span className="ui-label">Gate</span>
        <SplitFlap value={GATES[city]} className="text-[26px]" />
      </div>
      <SegmentedControl
        aria-label="Destination"
        value={city}
        onValueChange={setCity}
        items={[
          { value: "stockholm", label: "Stockholm" },
          { value: "berlin", label: "Berlin" },
          { value: "lisbon", label: "Lisbon" },
        ]}
      />
    </div>
  );
}
```

### Sizes

The board takes its size from the surrounding font size; set `text-*` on it or on its parent.

```tsx live
<div className="flex flex-col items-start gap-3">
  <SplitFlap value="ON TIME" className="text-sm" />
  <SplitFlap value="DELAYED" className="text-[26px]" />
</div>
```

## Rules

- **Do** keep values short: a word or a code, up to about twelve characters. Every character is a cell.
- **Do** keep `interval` at 2.5 seconds or more, so each word can be read before it flips.
- **Do** use one split-flap per view. A board of them is a departure hall, not an interface.
- **Don't** put the only copy of important information on a rotating board. Rotation pauses on hover, but a visitor may still miss a word.
- **Don't** flip on keystrokes or anything that changes many times a second. Use plain text there.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | The text to show. Changing it flips the cells that differ. |
| `words` | `readonly string[]` | — | Rotate through these when `value` isn't set. |
| `interval` | `number` | `3000` | Milliseconds each word stays up, at least 1000. Paused on hover, on focus and in background tabs. |
| `length` | `number` | Longest value or word | Number of cells; shorter text is padded with blank cells. |
| `className` | `string` | — | Size the board with `text-*`; layout classes. |
| `...props` | `ComponentProps<"span">` | — | Standard attributes, including `ref`. |

## Motion

The flip is the board's signature move. Each changed cell flips three to five times: the top half falls (35ms) and the next character's bottom half lands (35ms), passing through random letters of the same kind before the real one. Cells start 25ms apart, so the change ripples left to right, and the whole board settles in about half a second. Unchanged cells stay still, and nothing flips on first render. Under `prefers-reduced-motion` characters swap instantly.

## Accessibility

The current text is exposed once as plain text; the cells are hidden from assistive technology. Rotation isn't announced. For a rotating hero line, make sure the sentence still makes sense with any of the words, since a screen reader may read any one of them.
