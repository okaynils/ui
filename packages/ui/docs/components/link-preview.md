---
title: LinkPreview
description: A supplied bookmark preview with a domain, title, optional imagery and a separate personal annotation.
group: Gimmicks
order: 70
---

# LinkPreview

A bookmark with a little context: the site, title, description and your reason for keeping it. Use it in a blogroll, reading list or shared-link collection. The app supplies metadata and image URLs; `LinkPreview` does not scrape a destination, call a metadata service or store bookmarks.

```tsx
import { LinkPreview } from "@nils/ui";
import type { LinkPreviewProps } from "@nils/ui";
```

## Examples

### An annotated bookmark

The preview is one native link. Your annotation is a separate region underneath it, so selecting a note or activating a separate control there does not follow the bookmark.

```tsx live
<LinkPreview
  href="https://example.com/notes/small-tools"
  title="Small tools, made carefully"
  description="Notes on building software that does one useful thing well."
  annotation="Keeping this nearby for the next time a feature starts growing too many settings."
/>
```

### Supplied images and a new tab

This preview uses local SVG data URLs. In an app, pass image and favicon URLs from your metadata source. The component uses the title as the meaningful text; the thumbnail and favicon are supplementary.

```tsx live
import { LinkPreview } from "@nils/ui";

const image = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23ececee"/><path d="M12 44V20h40v24zM12 28h40M22 28v16" stroke="%236b6b72" fill="none" stroke-width="2"/></svg>'.replaceAll("%23", "#"));
const favicon = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="3" fill="%236b6b72"/><path d="M5 4v8h6" stroke="%23ffffff" fill="none" stroke-width="2"/></svg>'.replaceAll("%23", "#"));

export default function Example() {
  return <LinkPreview href="https://example.com/library" title="The small software library" description="A collection of independent tools and the people behind them." image={image} favicon={favicon} target="_blank" annotation="An example external bookmark. Opens in a new tab." />;
}
```

### Loading and unavailable destinations

While loading, the preview reserves space and exposes no link. An unsupported URL scheme produces a passive preview labelled “Link unavailable”. Relative destinations work too.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-3">
  <LinkPreview href="https://example.com" title="Loading metadata" loading />
  <LinkPreview href="" title="An archived bookmark" description="The note still makes sense even though the original link is no longer available." />
  <LinkPreview href="/components/now-playing" title="NowPlaying" description="A local page in this documentation site." />
</div>
```

## Rules

- **Do** supply a useful `title`; a raw URL alone is rarely a good bookmark label.
- **Do** treat metadata as supplied content. Fetch and cache it in your app rather than asking each preview to make requests.
- **Do** put your own opinion in `annotation`, separate from the site's `description`.
- **Do** set `target="_blank"` only when a new tab helps. The default follows normal same-tab navigation.
- **Don't** put buttons or other links inside the title or description. They are strings so the preview stays one unambiguous link. Put separate interactive content in `annotation`.
- **Don't** interpret a preview as confirmation that the destination is still reachable. Your app owns freshness and availability checks.

## Props

Extends `<div>` props except `title` and `children`; root attributes and `ref` apply to the wrapper.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | Required | Destination. Supports HTTP(S), `mailto:`, `tel:`, and relative links. Empty, malformed or unsupported-scheme destinations render a passive preview. |
| `title` | `string` | Required | Visible link title. Empty text falls back to “Untitled link”. |
| `description` | `string` | — | Site-supplied summary, shown in up to two lines. |
| `favicon` | `string` | — | Small site icon URL. Missing or failed icons use a link outline. |
| `image` | `string` | — | Optional 64px square thumbnail. A failed image shows a link outline in its place. |
| `annotation` | `ReactNode` | — | Your note, shown outside the anchor in a separate footer. |
| `target` | `HTMLAttributeAnchorTarget` | — | Anchor target. `_blank` adds `noopener noreferrer` and a screen-reader hint. |
| `rel` | `string` | — | Anchor relationship tokens. `_blank` preserves supplied tokens except `opener` and adds safe new-tab tokens. |
| `loading` | `boolean` | `false` | Show labelled placeholders, reserving thumbnail space when `image` is supplied. No anchor or annotation renders while loading. |
| `className` | `string` | — | Wrapper layout classes; defaults to full width up to `max-w-sm`. |
| `...props` | `ComponentProps<"div">` | — | Standard wrapper attributes, including `ref`. |

`LinkPreviewProps` is exported.

## Motion

Hover changes the surface tone in 120ms. The preview never scales or animates into place. Loading uses the existing `Skeleton`; reduced motion follows the library styles.

## Accessibility

- A valid preview is a native anchor, with one keyboard tab stop. Enter follows it and normal browser link actions work.
- The title, description and domain form the accessible link text. Thumbnail and favicon images have empty alt text to avoid repeating that information.
- New-tab links include an “opens in a new tab” hint for screen readers and use `noopener noreferrer`.
- Invalid destinations are plain text, not disabled-looking focusable anchors. Loading is labelled and sets `aria-busy` on the wrapper.
- Annotation content sits outside the anchor, so it can contain separate links or controls without nesting interactive elements.
