---
title: Webring
description: An old-web webring: a ring of member dots marking where you are, previous and next links, and a Random that shuffles before it lands.
group: Gimmicks
order: 80
---

# Webring

A small old-web navigation widget for a community of sites. The ring is drawn literally: every member is a dot on a circle, with this site marked in accent, and "Site 2 of 12" beneath the ring's name. Previous and next wrap around the ring. Random shuffles through a few members on the ring before it lands and navigates. Supply the ordered members and identify this site by its id or URL. The links work without a shared redirect service, a backend or a network request from the component.

```tsx
import { Webring } from "@nils/ui";
```

## Examples

### A personal-site footer

These explicit example destinations illustrate an ordered ring. On the middle site, Previous leads to Ada and Next to Grace.

```tsx live
<Webring
  name="Small web"
  href="https://example.com/ring"
  current="alan"
  members={[
    { id: "ada", name: "Ada's notebook", href: "https://example.com/ada" },
    { id: "alan", name: "Alan's workshop", href: "https://example.com/alan" },
    { id: "grace", name: "Grace's garden", href: "https://example.com/grace" },
  ]}
/>
```

### Try the navigation locally

This preview prevents native navigation and changes the current member instead. Press Random to watch it shuffle around the ring before it lands. In an app, leave `onNavigate` out for normal links, or use it to connect your router. Random always excludes the current site.

```tsx live
import { useState } from "react";
import { Webring } from "@nils/ui";

const members = [
  { id: "ada", name: "Ada", href: "https://example.com/ada" },
  { id: "alan", name: "Alan", href: "https://example.com/alan" },
  { id: "grace", name: "Grace", href: "https://example.com/grace" },
];

export default function Example() {
  const [current, setCurrent] = useState("ada");
  return (
    <div className="flex flex-col items-start gap-3">
      <Webring name="Friends" members={members} current={current} onNavigate={(member, direction, event) => { event.preventDefault(); setCurrent(member.id); }} />
      <p className="font-mono text-xs text-ink-2">Current site: {current}</p>
    </div>
  );
}
```

### A ring that's just starting

With one member, navigation is disabled. With two, Previous, Next and Random all lead to the other site. An empty ring or a missing current member explains why navigation is unavailable.

```tsx live
<div className="flex flex-col items-start gap-3">
  <Webring name="New friends" current="ada" members={[{ id: "ada", name: "Ada", href: "https://example.com/ada" }]} />
  <Webring name="New ring" current="ada" members={[]} />
</div>
```

## Rules

- **Do** provide members in the order you want the ring to follow. Endpoints wrap around.
- **Do** give each member a stable, unique `id` and an explicit URL. Repeated ids use their first entry.
- **Do** identify `current` by member id where possible. URL matching resolves relative URLs against the same neutral base; absolute URLs must otherwise match, including query and fragment.
- **Do** maintain membership and fetch any directory data in the consuming app.
- **Don't** use a webring for a sequential flow or a multi-page form; it navigates between independent sites.
- **Don't** rely on a different random destination when copying the Random link or opening its context menu. The initial destination is the first other member; ordinary click, keyboard activation and middle-click choose at activation time.
- **Don't** read `event.currentTarget` in `onNavigate` for Random. It fires after the shuffle, when the click is over; call `event.preventDefault()` to take over navigation, as with the other links.

## Props

### Webring

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `members` | `readonly WebringMember[]` | — | Ordered list of sites. |
| `current` | `string` | — | Required. Current member id or URL. Missing membership disables navigation. |
| `name` | `string` | `"Webring"` | Visible ring name and default navigation landmark name. |
| `href` | `string` | — | Makes the ring name a link to its directory or about page. |
| `onNavigate` | `(member, direction, event) => void` | — | Runs before navigation. `direction` is `"previous"`, `"random"` or `"next"`; call `event.preventDefault()` for a local preview or client-side router. For a plain Random click it runs after the shuffle, with the member it landed on. |
| `aria-label` | `string` | `"<name> navigation"` | Accessible name of the navigation landmark. |
| `className` | `string` | — | Layout classes on the outer nav. |
| `...props` | `ComponentProps<"nav">` | — | Standard navigation attributes and `ref`. |

### WebringMember

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Stable unique member identity. |
| `name` | `string` | — | Readable site name used in destination labels. |
| `href` | `string` | — | Native link destination. |

`WebringProps`, `WebringMember` and `WebringDirection` are exported types.

## Motion

The shuffle is the webring's signature move. A plain click or Enter on Random lights up a different member's dot on the ring (and shows its name under the ring's name) six times at 70ms intervals, lands on the chosen site, holds it for 140ms, then navigates: about half a second in all. It's one of the few sequences allowed past 200ms, because the spin *is* the joke. Clicks during a shuffle are ignored.

Modified clicks (⌘, Ctrl, Shift, middle-click) skip the shuffle and open the destination natively. Under `prefers-reduced-motion` Random navigates immediately. Nothing on the ring moves on its own.

## Accessibility

The widget is a named navigation landmark. The ring drawing is decorative; "Site 2 of 12" says the same thing in text. Previous and Next are real anchors whose accessible names include their destination's name, so keyboard activation, link copying and browser navigation work normally. Random is also a real link with a deterministic fallback URL. Unavailable destinations render disabled buttons. Directional arrows are decorative, and visible text explains an empty or incomplete ring.
