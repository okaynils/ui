---
title: Kudos
description: An applause button — click for one, press and hold for more; each kudo rolls the count and floats a "+1", and bursts reach your app as one batch.
group: Gimmicks
order: 270
---

# Kudos

An applause button for a post, a project or a changelog entry. Click it for one kudo, or press and hold to keep giving. Each one rolls the count up and floats a small "+1" above it. Each visitor can give up to `max`; after that the button says thanks. A burst of presses reaches your app as one batch once the visitor pauses, so you send one request instead of sixteen.

```tsx
import { Kudos } from "@nils/ui";
import type { KudosProps } from "@nils/ui";
```

## Examples

### At the end of a post

Click once, or press and hold. Your app persists each batch and passes the new `count` back.

```tsx live
import { useState } from "react";
import { Kudos } from "@nils/ui";

export default function Example() {
  const [count, setCount] = useState(128);
  const [log, setLog] = useState<number[]>([]);
  return (
    <div className="flex flex-col items-start gap-3">
      <Kudos
        count={count}
        subject="this post"
        onGive={(delta) => {
          setLog((batches) => [...batches, delta].slice(-4));
          setCount((current) => current + delta);
        }}
      />
      <span className="font-mono text-xs text-ink-3">
        {log.length ? `Batches sent: ${log.join(", ")}` : "No batches sent yet"}
      </span>
    </div>
  );
}
```

### A visitor who already gave

Pass `given` (or `defaultGiven`) from wherever you remember the visitor, e.g. local storage. At `max`, the button keeps showing the total and says thanks.

```tsx live
<div className="flex flex-wrap items-center gap-3">
  <Kudos count={42} defaultGiven={3} max={8} />
  <Kudos count={311} defaultGiven={16} />
</div>
```

### Your own icon

Any icon fits; keep it to 16px.

```tsx live
import { HandsClapping } from "@phosphor-icons/react";
import { Kudos } from "@nils/ui";

export default function Example() {
  return <Kudos count={56} icon={<HandsClapping />} subject="the release notes" />;
}
```

## Rules

- **Do** persist each `onGive` batch and pass the new `count` back. Until it changes, the widget keeps showing the visitor's kudos on top of the old count, so the number never jumps back.
- **Do** remember what a visitor gave (`given`) if you don't want them to start over on every visit.
- **Do** enforce `max` on your server too. The widget's cap is a courtesy, not protection.
- **Don't** animate or bump the count on your own. A kudo is something a person gave.
- **Don't** put more than one Kudos on a screen. It's the applause at the end, not a like button for every row.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | Required | Everyone's kudos, as your app last counted them. |
| `given` | `number` | — | Kudos this visitor already gave. Controlled. |
| `defaultGiven` | `number` | `0` | Starting `given` when uncontrolled. |
| `max` | `number` | `16` | Most kudos one visitor can give. |
| `onGive` | `(delta: number) => void` | — | Receives the new kudos in one batch, 600ms after the visitor's last press, and on unmount if a batch is pending. |
| `icon` | `ReactNode` | Spark | Replaces the default four-point spark. It turns ink once the visitor has given. |
| `subject` | `string` | — | What's being appreciated, used in the accessible name: "Give kudos to this post". |
| `locale` | `string` | `"en-GB"` | Number formatting. |
| `disabled` | `boolean` | — | Disables the button. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"button">` | — | Standard button attributes, including `ref`. |

## Motion

Applause is the button's signature move. A press gives one kudo. Hold for 400ms and it keeps giving one every 120ms until you let go or reach `max`; holding Space or Enter does the same. Each kudo rolls the changed digits of the count up (`NumberRoll`, 180ms) and floats a mono "+1" 10px up out of the count while it fades (300ms, `ease-snap`). The button presses like any Button. Under `prefers-reduced-motion` the "+1" doesn't appear and digits swap instantly; the count still updates.

## Accessibility

The button's name includes what it's for and the current total: "Give kudos to this post. 128 so far." Enter and Space give one kudo, and holding them keeps giving at the same pace as holding the pointer. Activation from assistive technology without a key or pointer also counts. After each batch, a polite status announces "You gave 5 kudos." At `max`, the name says so, the button is `aria-disabled`, and a visible "Thanks" appears next to the total.
