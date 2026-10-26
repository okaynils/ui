---
title: Waitlist
description: A waitlist sign-up that becomes your place in line; when you move up, the number rolls down and the queue steps forward.
group: Gimmicks
order: 220
---

# Waitlist

A waitlist sign-up for a launch page. Before joining, it's an email field and a button. After joining, it shows your place in line as a big number, a little queue of the people ahead of you, and an optional referral link. When your position improves, the number rolls down and the queue steps forward. Your app stores sign-ups and computes positions.

```tsx
import { Waitlist } from "@nils/ui";
import type { WaitlistProps } from "@nils/ui";
```

## Examples

### Join, then move up

This demo joins locally. In your app, `onJoin` saves the email and you pass back the real position.

```tsx live
import { useState } from "react";
import { Button, Waitlist } from "@nils/ui";

export default function Example() {
  const [position, setPosition] = useState<number | null>(null);
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <Waitlist
        position={position}
        total={3204}
        onJoin={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
          setPosition(1284);
        }}
        referralUrl={position ? "https://example.com/r/k7f3" : undefined}
        note="We'll email you when it's your turn."
      />
      {position ? (
        <Button size="sm" onClick={() => setPosition((current) => Math.max(1, (current ?? 1) - 3))}>
          A friend joined through your link
        </Button>
      ) : null}
    </div>
  );
}
```

### Nearly there

Near the front, the queue shows every person ahead of you.

```tsx live
<Waitlist position={3} total={3204} />
```

## Rules

- **Do** compute positions on your server and pass them in. The widget never guesses or estimates a place in line.
- **Do** throw from `onJoin` with a message that says what to do, e.g. `throw new Error("That email is already on the list.")`. It shows under the field.
- **Do** pass `total` only if you're happy to show it. Omitting it keeps the line's length private.
- **Don't** fake movement by decrementing the position on a timer. The line steps forward because someone actually left it, or a referral counted.
- **Don't** use a waitlist for a form with more than an email. Collect the rest after they're in.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `number \| null` | Required | Place in line, 1 being next. `null` shows the sign-up form. |
| `total` | `number` | — | Everyone in line, shown as "3,204 in line". |
| `onJoin` | `(email: string) => void \| Promise<void>` | — | Receives the trimmed email. A promise keeps the button pending; a thrown error's message shows under the field. |
| `referralUrl` | `string` | — | A personal link, shown read-only with a copy button. |
| `label` | `ReactNode` | `"Waitlist"` | Label at the top. |
| `note` | `ReactNode` | — | A quiet line under the form or the position. |
| `locale` | `string` | `"en-GB"` | Number formatting. |
| `className` | `string` | — | Layout classes. Full width up to 384px. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes, including `ref`. |

## Motion

The line stepping forward is the waitlist's signature move. When `position` drops, two things happen together. The changed digits of the number roll down (`NumberRoll`, 180ms), and the queue next to it slides one slot per place gained, up to four slots, in 200ms on `ease-snap`, as if everyone shuffled forward. A worse position, which shouldn't happen but might, updates without the step. Under `prefers-reduced-motion` both update instantly.

## Accessibility

The form has a labelled email field, and errors show through `Field`. Once joined, the position is plain text ("#1,284"), followed by "1,283 ahead of you." The queue drawing is hidden from assistive technology. The referral link is a labelled read-only input that selects itself on focus, next to a "Copy referral link" button.
