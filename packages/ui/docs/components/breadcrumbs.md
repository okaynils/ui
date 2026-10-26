---
title: Breadcrumbs
description: Where you are, as a trail of links — Projects / turbine / Settings. Long trails fold their middle into a menu.
group: Shell
order: 40
---

# Breadcrumbs

A trail from the root to the current page. Links are `ink-2`, the slashes are faint, and the current page is `ink`. Trails longer than `maxItems` keep the first item and the last few, and fold the middle into a "…" menu.

```tsx
import { Breadcrumbs } from "@nils/ui";
```

## Examples

### Basic

The last item is the current page and has no `href`.

```tsx live
<Breadcrumbs items={[{ label: "Projects", href: "#" }, { label: "turbine", href: "#" }, { label: "Settings" }]} />
```

### A long trail

Past `maxItems` (4 by default), the middle folds into a menu.

```tsx live
<Breadcrumbs
  items={[
    { label: "Workspace", href: "#" },
    { label: "Projects", href: "#" },
    { label: "turbine", href: "#" },
    { label: "Environments", href: "#" },
    { label: "production", href: "#" },
    { label: "Deploy 4f2a91c" },
  ]}
/>
```

### With a router

Pass `renderLink` to use your router's link. Spread the props it gives you.

```tsx
import { Link } from "react-router-dom";

<Breadcrumbs
  items={trail}
  renderLink={(item, props) => <Link to={item.href!} {...props} />}
/>
```

## Rules

- **Do** start from a real place (a workspace or a section), not from "Home" when the sidebar already has that.
- **Do** make every item but the last a link.
- **Don't** add icons to crumbs. The trail is text.
- **Don't** use breadcrumbs for steps in a flow. They describe place, not progress.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `{ label: ReactNode; href?: string }[]` | — | Root first, current page last. |
| `maxItems` | `number` | `4` | Longest trail shown in full. |
| `renderLink` | `(item, props) => ReactElement` | — | Render links yourself, e.g. a router `<Link>`. Spread `props`. |

Labels truncate at about 18 characters (24 for the current page).

## Accessibility

A `<nav aria-label="Breadcrumb">` around an ordered list. The current page has `aria-current="page"`, and the slashes are hidden from screen readers. The "…" button is labelled with how many items it hides.
