---
title: StarButton
description: A "Star · 1,284" split button; starring fills the star and rolls the count up by one.
group: Gimmicks
order: 250
---

# StarButton

The split button from code forges: "Star" on the left, the count on the right. Starring turns the outline star into a filled one and rolls the count up by one on a small odometer; unstarring rolls it back down. Use it on a project page, a README-style landing page or anywhere visitors can bookmark something publicly. The count and the starring itself come from your app, e.g. the GitHub API.

```tsx
import { StarButton } from "@nils/ui";
import type { StarButtonProps, StarButtonSize } from "@nils/ui";
```

## Examples

### On a project page

Uncontrolled, the button keeps its own starred state and the count follows the visitor's clicks straight away.

```tsx live
<StarButton count={1284} href="https://example.com/okaynils/ui/stargazers" />
```

### Optimistic starring

Controlled, your app owns both `starred` and `count`. Update both at once, call your API, and roll back if it fails. The count rolls in both directions.

```tsx live
import { useState } from "react";
import { StarButton } from "@nils/ui";

async function saveStar(starred: boolean) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (Math.random() < 0.2) throw new Error("Couldn't reach the server.");
}

export default function Example() {
  const [starred, setStarred] = useState(false);
  const [count, setCount] = useState(8675);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <StarButton
        count={count}
        starred={starred}
        onStarredChange={async (next) => {
          setError(null);
          setStarred(next);
          setCount((c) => c + (next ? 1 : -1));
          try {
            await saveStar(next);
          } catch (cause) {
            setStarred(!next);
            setCount((c) => c + (next ? -1 : 1));
            setError((cause as Error).message);
          }
        }}
      />
      {error ? <p className="text-xs text-ink-2">{error} Your star wasn't saved.</p> : null}
    </div>
  );
}
```

### Sizes and labels

```tsx live
<div className="flex items-center gap-3">
  <StarButton size="sm" count={42} />
  <StarButton size="md" count={42} defaultStarred />
  <StarButton count={318} label="Follow" starredLabel="Following" />
</div>
```

## Rules

- **Do** show the real count. Fetch it from your forge or database; don't round up or pad it.
- **Do** update `count` together with `starred` when you control both, and undo both if saving fails.
- **Do** link the count to the list of stargazers with `href` when you have one.
- **Don't** use it for likes on content. That's `Kudos`; a star is a public bookmark, one per visitor.
- **Don't** put more than one on a page.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | Required | Total stars. Negative or non-finite values show 0. |
| `starred` | `boolean` | — | Controlled starred state. Your app then owns `count` too. |
| `defaultStarred` | `boolean` | `false` | Initial state when uncontrolled; the shown count then adds or removes the visitor's own star. |
| `onStarredChange` | `(starred: boolean) => void` | — | Called on each toggle with the new state. |
| `href` | `string` | — | Makes the count a link, e.g. to stargazers. |
| `label` | `string` | `"Star"` | Button text before starring. |
| `starredLabel` | `string` | `"Starred"` | Button text after starring. Both share one width, so the button never shifts. |
| `size` | `"sm" \| "md"` | `"sm"` | 28 or 32px, matching Button. |
| `locale` | `string` | `"en-GB"` | Digit grouping of the count. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes on the wrapper, including `ref`. |

## Motion

Starring is the button's signature move. The outline star crossfades and scales into a filled star in 150ms on `ease-snap`, the same move as `CopyButton`'s copy → check, while the label crossfades from "Star" to "Starred". At the same time the count's changed digits roll up (`NumberRoll`, 180ms); unstarring reverses both and rolls down. The button gives under the pointer like every compact control (`ui-press`). Under `prefers-reduced-motion` everything swaps instantly.

## Accessibility

The star is a real button with `aria-pressed`, so screen readers announce "Star, toggle button, pressed" or "not pressed"; the visible label stays the accessible name. The count is read as "1,284 stars", either as the link's name or as hidden text, while the rolling digits are hidden from assistive technology. Both parts have their own focus ring and are reachable with Tab.
