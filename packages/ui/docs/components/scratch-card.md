---
title: ScratchCard
description: A scratch-off card hiding a promo code, date or invite; scratch the hatched coating away, or press Reveal.
group: Gimmicks
order: 280
---

# ScratchCard

A scratch-off card, like a lottery ticket. The content sits under a hatched grey coating, and scratching with a mouse or finger wipes the coating away along the stroke. Once about half of it is gone, the rest falls away. A Reveal button under the card does the same in one step, for keyboards, screen readers and the impatient. Use it to hand out a promo code, unveil a launch date or hide a small easter egg.

```tsx
import { ScratchCard } from "@nils/ui";
import type { ScratchCardProps } from "@nils/ui";
```

## Examples

### A promo code

Scratch the card. Once it's revealed, the code can be copied.

```tsx live
import { CopyButton, ScratchCard } from "@nils/ui";

export default function Example() {
  return (
    <ScratchCard>
      <div className="ui-label">Launch week</div>
      <div className="mt-1 flex items-center justify-center gap-1">
        <span className="font-mono text-[17px] font-medium tracking-[0.08em]">EARLY-4F9K</span>
        <CopyButton value="EARLY-4F9K" aria-label="Copy promo code" />
      </div>
      <div className="mt-1 text-xs text-ink-2">30% off Pro for a year</div>
    </ScratchCard>
  );
}
```

### Revealing a date, controlled

Use `revealed` and `onReveal` to remember the reveal in your app, e.g. so a returning visitor isn't asked to scratch again. Setting `revealed` back to `false` puts on a fresh coating.

```tsx live
import { useState } from "react";
import { Button, ScratchCard } from "@nils/ui";

export default function Example() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <ScratchCard revealed={revealed} onReveal={() => setRevealed(true)} hint="Scratch for the date">
        <div className="ui-label">We launch on</div>
        <div className="mt-1 text-[26px] leading-8 font-semibold tracking-[-0.02em]">1 November</div>
      </ScratchCard>
      {revealed ? <Button size="sm" variant="ghost" onClick={() => setRevealed(false)}>Cover it again</Button> : null}
    </div>
  );
}
```

### Already revealed

`defaultRevealed` shows the content with no coating and no button.

```tsx live
<ScratchCard defaultRevealed>
  <div className="ui-label">Invite</div>
  <div className="mt-1 font-mono text-[17px] font-medium">BETA-7F3K</div>
</ScratchCard>
```

## Rules

- **Do** keep the hidden content small: one code, one date, one line. The card is a moment, not a container.
- **Do** record the reveal through `onReveal` if it matters later, such as a claimed code. The widget forgets on reload.
- **Do** make the hidden thing worth the scratch. A coupon, a date or a joke; not your terms of service.
- **Don't** treat the coating as security. The content is in the page from the start, hidden only visually and from assistive technology. Don't put anything under it the visitor isn't allowed to have.
- **Don't** put more than one scratch card in a view. Two of them is a casino.
- **Don't** hide the Reveal button. It's how keyboard and screen-reader users get to the content.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | The hidden content. Inert and hidden from assistive technology until revealed. |
| `hint` | `string` | `"Scratch to reveal"` | Mono text printed on the coating; it scratches away too. `""` for none. |
| `revealed` | `boolean` | — | Controlled revealed state. Back to `false` re-coats the card. |
| `defaultRevealed` | `boolean` | `false` | Initial state when uncontrolled. |
| `onReveal` | `() => void` | — | Called once per coating when the visitor reveals the card by scratching or with the button. |
| `threshold` | `number` | `0.5` | Share of the coating to scratch off before the rest falls away. |
| `revealLabel` | `string` | `"Reveal"` | Label of the reveal button. |
| `className` | `string` | — | Layout classes on the wrapper. The card is at least 240px wide. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes, including `ref`. |

## Motion

Scratching is the card's signature move. The coating disappears under the pointer as you drag, along a round 32px brush, with the points between frames filled in so a fast swipe leaves a line rather than dots. When about half is gone, the rest of the coating fades out in 180ms on `ease-snap`. Nothing moves on its own. Under `prefers-reduced-motion` the coating vanishes without the fade; scratching still works, because it follows your hand rather than playing an animation.

## Accessibility

Until it's revealed, the content is `inert` and `aria-hidden`, so it can't be focused or read early. The coating is decorative and hidden from assistive technology. The Reveal button sits under the card; pressing it clears the coating, announces "Revealed." through a status region and moves focus to the revealed content, so a screen reader reads it next. Interactive content inside, like a copy button, becomes reachable once revealed. The coating repaints in the right colours when the theme changes, keeping any scratches already made.
