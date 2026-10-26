---
title: Sidebar
description: The app's navigation column — a brand row, labelled sections of 28px items with counts or shortcuts, and a pinned footer.
group: Shell
order: 20
---

# Sidebar

The navigation column. It has a panel tone, scrolls on its own, and holds sections of 28px items. The current item gets the active fill and a small accent square in the gutter: blue means "you are here".

Put it in an [AppShell](/components/app-shell), which gives it a width and a hairline and turns it into a sheet when narrow. Used alone, give it a width.

```tsx
import { Sidebar, SidebarHeader, SidebarSection, SidebarItem, SidebarFooter } from "@nils/ui";
```

## Examples

### Sections, counts and a footer

```tsx live
import { Sidebar, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from "@nils/ui";
import { ChartLineIcon, CpuIcon, GearSixIcon, HardDrivesIcon, KeyIcon, ReceiptIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function Example() {
  const [active, setActive] = useState("nodes");
  const item = (id: string, label: string, icon: React.ReactNode, trailing?: React.ReactNode) => (
    <SidebarItem icon={icon} trailing={trailing} active={active === id} onClick={() => setActive(id)}>
      {label}
    </SidebarItem>
  );
  return (
    <div className="h-[380px] w-56 overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line-strong)]">
      <Sidebar>
        <SidebarHeader>
          <span className="font-mono text-ui font-medium">gpu.rent</span>
          <span className="font-mono text-[11px] text-ink-3">v2</span>
        </SidebarHeader>
        <SidebarSection>
          {item("usage", "Usage", <ChartLineIcon />)}
          {item("nodes", "Nodes", <CpuIcon />, 12)}
          {item("volumes", "Volumes", <HardDrivesIcon />, 3)}
        </SidebarSection>
        <SidebarSection label="Account">
          {item("billing", "Billing", <ReceiptIcon />)}
          {item("keys", "API keys", <KeyIcon />)}
        </SidebarSection>
        <SidebarFooter>{item("settings", "Settings", <GearSixIcon />)}</SidebarFooter>
      </Sidebar>
    </div>
  );
}
```

### Links

Give an item `href` to make it an `<a>`. For a router, pass the router's link through `render`:

```tsx
import { Link, useLocation } from "react-router-dom";

const { pathname } = useLocation();

<SidebarItem render={<Link to="/nodes" />} active={pathname.startsWith("/nodes")} icon={<CpuIcon />}>
  Nodes
</SidebarItem>
```

### A section action

`action` puts a small control beside the section label, typically an icon-only "+" for "new".

```tsx live
import { Button, Sidebar, SidebarItem, SidebarSection } from "@nils/ui";
import { HashIcon, PlusIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <div className="w-56 overflow-hidden rounded-box shadow-[0_0_0_1px_var(--ui-line-strong)]">
      <Sidebar className="pt-2">
        <SidebarSection
          label="Channels"
          action={<Button variant="ghost" size="sm" icon aria-label="New channel" className="size-6"><PlusIcon /></Button>}
        >
          <SidebarItem icon={<HashIcon />} active>general</SidebarItem>
          <SidebarItem icon={<HashIcon />} trailing={3}>deploys</SidebarItem>
          <SidebarItem icon={<HashIcon />}>random</SidebarItem>
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
```

## Rules

- **Do** mark exactly one item `active`: the current page.
- **Do** keep labels to one or two words, and sentence case.
- **Do** use `trailing` for a count (a number renders in mono `ink-3`) or a `Kbd` shortcut. Pick one per sidebar, not both on every row.
- **Don't** colour icons or counts. An unread or urgent count can sit beside a `StatusDot`, not in red.
- **Don't** nest items more than one level. If a section needs depth, it needs its own page.
- **Don't** put primary actions ("New project") as sidebar items. Use a section `action` or the TopBar.

## Props

### Sidebar

A `<nav aria-label="Main">`. All `<nav>` props pass through.

### SidebarHeader

A 48px row (same height as `TopBar`) with space-between layout. All `<div>` props pass through.

### SidebarSection

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Mono uppercase label. Omit for the first group. |
| `action` | `ReactNode` | — | A small control beside the label. |
| `children` | `SidebarItem`s | — | The items. |

### SidebarItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The label. Truncates. |
| `icon` | `ReactNode` | — | Leading 16px icon. |
| `trailing` | `ReactNode` | — | A number or short string renders as a mono count; anything else as-is. |
| `active` | `boolean` | `false` | The current page: active fill, accent square, `aria-current`. |
| `href` | `string` | — | Render as an `<a>`. |
| `render` | `ReactElement` | — | Render as another element, e.g. a router `<Link>`. |
| `disabled` | `boolean` | — | Dimmed and inert. |
| `onClick` | `(event) => void` | — | Runs before the mobile sheet closes. |

### SidebarFooter

Pinned to the bottom on a hairline. Put settings, the account, or a theme toggle here.

## Accessibility

- Each section's label names its list (`aria-labelledby`).
- The active item gets `aria-current="page"` (or `"true"` on buttons).
- Focus shows a 2px accent ring inside the item, so it's never clipped by the sidebar's edge.
