---
title: Link
description: An inline text link, accent or quiet, always underlined, with an external variant and router support.
group: Controls
order: 12
---

# Link

An inline text link for sentences and UI copy. It's always underlined, so it never depends on colour alone: the `default` link is accent text with a tinted underline, and `quiet` is ink text with a hairline underline for dense places such as rows, footers and metadata. On hover the underline gets its full colour and doubles in weight without moving the text. `external` marks links that leave your site.

```tsx
import { Link } from "@nils/ui";
import type { LinkProps, LinkVariant } from "@nils/ui";
```

## Examples

### In a sentence

```tsx live
<p className="max-w-md text-sm text-ink-2">
  Read the <Link href="#design">design contract</Link> before adding a component, and check the{" "}
  <Link href="#changelog">changelog</Link> for anything that moved.
</p>
```

### Quiet

For links inside UI where an accent link would shout: names in a table row, a footer, a byline.

```tsx live
<div className="flex flex-col gap-2 text-ui text-ink-2">
  <span>Deployed by <Link variant="quiet" href="#nils">nils</Link> · 4 min ago</span>
  <span>
    <Link variant="quiet" href="#privacy">Privacy</Link> · <Link variant="quiet" href="#terms">Terms</Link> · <Link variant="quiet" href="#status">Status</Link>
  </span>
</div>
```

### External

`external` adds a small ↗, opens a new tab and sets a safe `rel`. Screen readers hear "(opens in a new tab)". Pass `target="_self"` to keep the arrow but stay in the tab.

```tsx live
<p className="text-sm text-ink-2">
  Built on <Link external href="https://base-ui.com">Base UI</Link> and{" "}
  <Link external href="https://tailwindcss.com">Tailwind CSS</Link>.
</p>
```

### With a router

Use `render` to keep your router's link (prefetching, client navigation) with the Link look.

```tsx
import { Link as RouterLink } from "react-router";

<Link render={<RouterLink to="/settings" />}>Open settings</Link>
```

## Rules

- **Do** use `Link` for navigation inside text. For an action, use a `Button` (`variant="ghost"` if it should look light).
- **Do** use `quiet` in dense UI and `default` in prose. Mixing them in one sentence reads as two kinds of link.
- **Do** mark links that leave your site with `external`.
- **Don't** remove the underline. It's what makes a link a link without relying on colour.
- **Don't** make whole sentences or paragraphs into links. Link the few words that say where it goes, never "click here".
- **Don't** use `Link` for a button-shaped link; use `<Button render={<a href="…" />} nativeButton={false}>` or `buttonClassName()`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "quiet"` | `"default"` | Accent text with a tinted underline, or ink text with a hairline underline. |
| `external` | `boolean` | `false` | Adds ↗, opens a new tab unless `target` is set, and adds a hidden "(opens in a new tab)". |
| `href` | `string` | — | Destination. |
| `target` | `string` | — | With `_blank`, `rel` always includes `noopener noreferrer` and `opener` is removed. |
| `render` | `ReactElement \| function` | — | Render another element, such as a router link, with the Link's props merged in. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"a">` | — | Standard anchor attributes, including `ref`. |

## Motion

Only the underline changes: its colour and weight shift in 120ms on hover. The text never moves.

## Accessibility

Links are real anchors, so Enter, middle-click, copy link and the browser's context menu all work. The underline is always visible, which keeps links distinguishable without colour. The focus ring follows the library's 2px accent outline. The external arrow is decorative; a new tab is announced with visually hidden text.
